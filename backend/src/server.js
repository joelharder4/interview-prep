const http = require('node:http')
const vm = require('node:vm')
const { spawn } = require('node:child_process')
const { mkdtempSync, rmSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')
const { tmpdir } = require('node:os')

const PORT = Number(process.env.PORT || 3333)

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendCorsHeaders(response)
    response.statusCode = 204
    response.end()
    return
  }

  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)

  if (request.method === 'GET' && url.pathname === '/api/health') {
    sendJson(response, 200, { ok: true })
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/run/javascript') {
    const body = await readJsonBody(request)
    const result = runJavaScriptTests(body)
    sendJson(response, result.error ? 400 : 200, result)
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/run/python') {
    const body = await readJsonBody(request)
    const result = await runPythonSnippet(body)
    sendJson(response, result.timedOut || result.exitCode !== 0 ? 400 : 200, result)
    return
  }

  sendJson(response, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`Local execution backend listening on http://127.0.0.1:${PORT}`)
})

function sendCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function sendJson(response, statusCode, payload) {
  sendCorsHeaders(response)
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0

    request.on('data', (chunk) => {
      size += chunk.length
      if (size > 1_000_000) {
        reject(new Error('Request body too large'))
        request.destroy()
        return
      }

      chunks.push(chunk)
    })

    request.on('end', () => {
      try {
        const rawBody = Buffer.concat(chunks).toString('utf8')
        resolve(rawBody ? JSON.parse(rawBody) : {})
      } catch (error) {
        reject(error)
      }
    })

    request.on('error', reject)
  })
}

function createSandbox() {
  const sandbox = {
    console,
    Math,
    JSON,
    Number,
    String,
    Boolean,
    Array,
    Object,
    Date,
    RegExp,
    Set,
    Map,
    WeakSet,
    WeakMap,
    Promise,
    Error,
    TypeError,
    RangeError,
    ReferenceError,
    SyntaxError,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
  }

  sandbox.globalThis = sandbox
  return sandbox
}

function toJsExpression(value) {
  const serialized = JSON.stringify(value)
  return serialized === undefined ? 'undefined' : serialized
}

function buildInvocationExpression(input, inputMode) {
  const serializedInput = toJsExpression(input)

  if (inputMode === 'spread' && Array.isArray(input)) {
    return `...${serializedInput}`
  }

  return serializedInput
}

function executeJavaScriptSnippet(source, functionName, input, inputMode, timeoutMs = 1000) {
  const sandbox = createSandbox()
  vm.runInNewContext(source, sandbox, {
    timeout: timeoutMs,
    displayErrors: true,
  })

  const targetFunction = sandbox[functionName]

  if (typeof targetFunction !== 'function') {
    throw new Error(`Failed to extract function '${functionName}'. Make sure your function is named correctly.`)
  }

  sandbox.__targetFunction = targetFunction

  const invocation = buildInvocationExpression(input, inputMode)
  const script = new vm.Script(`globalThis.__result = globalThis.__targetFunction(${invocation})`, {
    filename: 'user-code-invocation.js',
    displayErrors: true,
  })

  script.runInNewContext(sandbox, { timeout: timeoutMs })
  return sandbox.__result
}

function runJavaScriptTests(payload) {
  try {
    const source = String(payload?.source || '')
    const functionName = String(payload?.functionName || '')
    const inputMode = payload?.inputMode === 'spread' ? 'spread' : 'single'
    const timeoutMs = Number(payload?.timeoutMs || 1000)
    const testCases = Array.isArray(payload?.testCases) ? payload.testCases : []

    if (!source.trim()) {
      return { error: 'Source code is required.' }
    }

    if (!functionName.trim()) {
      return { error: 'Function name is required.' }
    }

    executeJavaScriptSnippet(source, functionName, testCases[0]?.input ?? undefined, inputMode, timeoutMs)

    const results = testCases.map((testCase) => {
      try {
        const actualOutput = executeJavaScriptSnippet(
          source,
          functionName,
          testCase.input,
          inputMode,
          timeoutMs
        )

        return {
          passed: deepEqual(actualOutput, testCase.expectedOutput),
          actualOutput,
          expectedOutput: testCase.expectedOutput,
          explanation: testCase.explanation,
        }
      } catch (error) {
        return {
          passed: false,
          actualOutput: undefined,
          expectedOutput: testCase.expectedOutput,
          error: error instanceof Error ? error.message : String(error),
          explanation: testCase.explanation,
        }
      }
    })

    return { results }
  } catch (error) {
    return { error: `Syntax Error: ${error instanceof Error ? error.message : String(error)}` }
  }
}

function deepEqual(left, right) {
  if (left === right) {
    return true
  }

  if (typeof left !== 'object' || typeof right !== 'object') {
    return false
  }

  if (left === null || right === null) {
    return false
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) {
      return false
    }

    return left.every((element, index) => deepEqual(element, right[index]))
  }

  if (Array.isArray(left) !== Array.isArray(right)) {
    return false
  }

  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)

  if (leftKeys.length !== rightKeys.length) {
    return false
  }

  return leftKeys.every((key) => rightKeys.includes(key) && deepEqual(left[key], right[key]))
}

function runPythonSnippet(payload) {
  const source = String(payload?.source || '')
  const stdin = String(payload?.stdin || '')
  const timeoutMs = Number(payload?.timeoutMs || 1000)

  if (!source.trim()) {
    return Promise.resolve({
      exitCode: 1,
      stdout: '',
      stderr: 'Source code is required.',
      timedOut: false,
    })
  }

  const workingDirectory = mkdtempSync(join(tmpdir(), 'interview-prep-python-'))
  const scriptPath = join(workingDirectory, 'main.py')

  writeFileSync(scriptPath, source, 'utf8')

  const command = process.env.PYTHON_EXECUTABLE || 'python'

  return new Promise((resolve) => {
    const child = spawn(command, [scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    })

    let stdout = ''
    let stderr = ''
    let finished = false

    const timer = setTimeout(() => {
      finished = true
      child.kill()
      rmSync(workingDirectory, { recursive: true, force: true })
      resolve({
        exitCode: null,
        stdout,
        stderr: stderr || 'Execution timed out.',
        timedOut: true,
      })
    }, timeoutMs)

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf8')
    })

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8')
    })

    child.on('error', (error) => {
      if (finished) {
        return
      }

      clearTimeout(timer)
      rmSync(workingDirectory, { recursive: true, force: true })
      resolve({
        exitCode: 1,
        stdout,
        stderr: error instanceof Error ? error.message : String(error),
        timedOut: false,
      })
    })

    child.on('close', (exitCode) => {
      if (finished) {
        return
      }

      clearTimeout(timer)
      rmSync(workingDirectory, { recursive: true, force: true })
      resolve({
        exitCode,
        stdout,
        stderr,
        timedOut: false,
      })
    })

    child.stdin.end(stdin)
  })
}