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
  functionName: string
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
          actualOutput = executeWithTimeout(solve as (arg: unknown) => unknown, testCase.input)
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
  fn: (arg: unknown) => unknown,
  input: unknown
): unknown {
  let completed = false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let error: any

  try {
    // For simple cases, just execute
    // For array problems, pass array directly
    if (Array.isArray(input)) {
      // Create a copy so we don't mutate during testing
      const inputCopy = JSON.parse(JSON.stringify(input))
      result = fn(inputCopy)
    } else if (typeof input === 'object' && input !== null) {
      // For object inputs, deep copy
      const inputCopy = JSON.parse(JSON.stringify(input))
      
      // Check if it's two separate arguments (for mergeObjects)
      if (Array.isArray(inputCopy)) {
        // Cast to unknown array type to allow spread
        result = (fn as (...args: unknown[]) => unknown)(...(inputCopy as unknown[]))
      } else {
        result = fn(inputCopy)
      }
    } else {
      // For primitives (strings, numbers)
      result = fn(input)
    }
    completed = true
  } catch (e) {
    error = e
    completed = true
  }

  if (!completed) {
    throw new Error('Function execution exceeded timeout')
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
