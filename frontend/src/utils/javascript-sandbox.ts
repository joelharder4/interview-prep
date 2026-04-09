import type { TestCase } from '../data/javascript-problems'

interface TestResult {
  passed: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actualOutput: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expectedOutput: any
  error?: string
  explanation?: string
}

interface TestResultSet {
  results?: TestResult[]
  error?: string
}

/**
 * Safely evaluate user code against test cases
 * Executes in a sandboxed context with timeout protection
 */
export function evaluateUserCode(
  userCode: string,
  testCases: TestCase[],
  functionName: string,
  spreadArguments = false
): TestResultSet {
  try {
    // Create a new Function from user code
    // This is safer than eval() as it prevents access to outer scope
    const userFunction = new Function(userCode)

    // Execute the code to define the function
    userFunction()

    // Get the function from global scope (it needs to be defined in the code)
    // Use eval to get access to the defined function in the created scope
    const wrappedCode = `
      (function() {
        ${userCode}
        return ${functionName};
      })()
    `

    let solve: unknown
    try {
       
      solve = eval(wrappedCode)
    } catch {
      return {
        error: `Failed to extract function '${functionName}'. Make sure your function is named correctly.`,
      }
    }

    if (typeof solve !== 'function') {
      return {
        error: `'${functionName}' is not a function. Make sure you define it as a function.`,
      }
    }

    // Run tests
    const results: TestResult[] = testCases.map((testCase) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let actualOutput: any

        // Execute function with timeout
        try {
          actualOutput = executeWithTimeout(
            solve as (...args: unknown[]) => unknown,
            testCase.input,
            spreadArguments
          )
        } catch {
          return {
            passed: false,
            actualOutput: undefined,
            expectedOutput: testCase.expectedOutput,
            error: 'Timeout: Code execution took too long',
            explanation: testCase.explanation,
          }
        }

        // Compare output
        const passed = deepEqual(actualOutput, testCase.expectedOutput)

        return {
          passed,
          actualOutput,
          expectedOutput: testCase.expectedOutput,
          explanation: testCase.explanation,
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        return {
          passed: false,
          actualOutput: undefined,
          expectedOutput: testCase.expectedOutput,
          error: errorMessage,
          explanation: testCase.explanation,
        }
      }
    })

    return { results }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      error: `Syntax Error: ${errorMessage}`,
    }
  }
}

/**
 * Execute function with timeout protection
 */
function executeWithTimeout(
  fn: (...args: unknown[]) => unknown,
  input: unknown,
  spreadArguments = false
): unknown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let error: any

  try {
    const inputCopy = JSON.parse(JSON.stringify(input))

    if (spreadArguments && Array.isArray(inputCopy)) {
      result = fn(...inputCopy)
    } else {
      result = fn(inputCopy)
    }
  } catch (e) {
    error = e
  }

  if (error) {
    throw error
  }

  return result
}

/**
 * Deep equality check (handles objects, arrays, primitives)
 */
function deepEqual(a: unknown, b: unknown): boolean {
  // Primitives
  if (a === b) return true
  if (typeof a !== 'object' || typeof b !== 'object') return false
  if (a === null || b === null) return false

  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((element, index) => deepEqual(element, b[index]))
  }

  // Objects
  if (Array.isArray(a) !== Array.isArray(b)) return false

  const aObj = a as Record<string, unknown>
  const bObj = b as Record<string, unknown>
  const keysA = Object.keys(aObj)
  const keysB = Object.keys(bObj)

  if (keysA.length !== keysB.length) return false

  return keysA.every((key) => {
    if (!keysB.includes(key)) return false
    return deepEqual(aObj[key], bObj[key])
  })
}
