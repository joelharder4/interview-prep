interface TestResult {
  passed: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actualOutput: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expectedOutput: any
  error?: string
  explanation?: string
}

export interface TestHarnessResults {
  error?: string
  results?: TestResult[]
}

interface TestHarnessProps {
  testResults: TestHarnessResults
}

export default function TestHarness({ testResults }: TestHarnessProps) {
  if (testResults.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-red-900 text-sm">Error</h3>
        <p className="text-xs text-red-800 font-mono whitespace-pre-wrap break-words">{testResults.error}</p>
      </div>
    )
  }

  if (!testResults.results || testResults.results.length === 0) {
    return null
  }

  const allPassed = testResults.results.every((r) => r.passed)
  const passedCount = testResults.results.filter((r) => r.passed).length

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div
        className={`p-4 rounded-lg border ${
          allPassed
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}
      >
        <p className={`font-semibold text-sm ${allPassed ? 'text-green-900' : 'text-yellow-900'}`}>
          {passedCount} of {testResults.results.length} tests passed
          {allPassed ? ' ✓' : ''}
        </p>
      </div>

      {/* Test Cases */}
      <div className="space-y-2">
        {testResults.results.map((result, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border ${
              result.passed
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              <span className={`text-sm font-semibold ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
                Test {idx + 1}
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                result.passed
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}>
                {result.passed ? '✓ PASS' : '✗ FAIL'}
              </span>
            </div>

            {result.explanation && (
              <p className="text-xs text-slate-700 mb-2">{result.explanation}</p>
            )}

            {!result.passed && (
              <div className="text-xs space-y-1 font-mono">
                <p className="text-slate-700">
                  <span className="font-semibold text-blue-700">Expected:</span> {JSON.stringify(result.expectedOutput)}
                </p>
                <p className="text-slate-700">
                  <span className="font-semibold text-red-700">Actual:</span> {JSON.stringify(result.actualOutput)}
                </p>
              </div>
            )}

            {result.error && (
              <p className="text-xs text-red-700 font-mono mt-2">{result.error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
