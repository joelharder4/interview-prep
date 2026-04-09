import type { JavaScriptProblem } from '../data/javascript-problems'
import type { TestHarnessResults } from '../components/TestHarness'
import { evaluateUserCode } from './javascript-sandbox'

type JavaScriptRunRequest = {
  source: string
  functionName: string
  inputMode: 'single' | 'spread'
  testCases: JavaScriptProblem['testCases']
}

export function getJavaScriptProblemFunctionName(problemId: string): string {
  if (problemId === 'reverse-array') return 'reverseArray'
  if (problemId === 'count-unique-chars') return 'countUniqueChars'
  if (problemId === 'merge-objects') return 'mergeObjects'
  if (problemId === 'filter-and-transform') return 'filterAndTransform'

  return 'solve'
}

export async function runJavaScriptProblemTests(
  problem: JavaScriptProblem,
  source: string
): Promise<TestHarnessResults> {
  const requestBody: JavaScriptRunRequest = {
    source,
    functionName: getJavaScriptProblemFunctionName(problem.id),
    inputMode: problem.argumentMode ?? 'single',
    testCases: problem.testCases,
  }

  try {
    const response = await fetch('/api/run/javascript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = (await response.json().catch(() => null)) as TestHarnessResults | null

    if (data) {
      return data
    }
  } catch {
    // Fall back to the in-browser evaluator when the backend is not available yet.
  }

  return evaluateUserCode(
    source,
    problem.testCases,
    requestBody.functionName,
    requestBody.inputMode === 'spread'
  )
}