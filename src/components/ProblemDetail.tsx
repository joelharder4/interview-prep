import { useRef, useState, type KeyboardEvent } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import type { JavaScriptProblem } from '../data/javascript-problems'
import TestHarness from './TestHarness'
import { evaluateUserCode } from '../utils/javascript-sandbox'
import type { TestHarnessResults } from './TestHarness'

type ViewMode = 'solve' | 'solution'

interface ProblemDetailProps {
  problem: JavaScriptProblem
  onBack: () => void
}

export default function ProblemDetail({ problem, onBack }: ProblemDetailProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('solve')
  const editorRef = useRef<HTMLTextAreaElement | null>(null)
  const highlightRef = useRef<HTMLDivElement | null>(null)
  const indentUnit = '  '
  const draftStorageKey = `javascript-practice.problem-draft.${problem.id}`
  const [userCode, setUserCode] = useState(
    () => {
      const storedDraft = sessionStorage.getItem(draftStorageKey)

      if (storedDraft) {
        return storedDraft
      }

      return `function solve(${problem.id === 'reverse-array' ? 'arr' : problem.id === 'count-unique-chars' ? 'str' : problem.id === 'merge-objects' ? 'obj1, obj2' : 'arr'}) {\n  // Write your solution here\n  \n}\n`
    }
  )
  const [expandedHints, setExpandedHints] = useState<Set<string>>(new Set())
  const [testResults, setTestResults] = useState<TestHarnessResults | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const toggleHint = (hint: string) => {
    const updated = new Set(expandedHints)
    if (updated.has(hint)) {
      updated.delete(hint)
    } else {
      updated.add(hint)
    }
    setExpandedHints(updated)
  }

  const updateEditorValue = (nextValue: string, nextSelectionStart: number, nextSelectionEnd = nextSelectionStart) => {
    setUserCode(nextValue)
    sessionStorage.setItem(draftStorageKey, nextValue)

    requestAnimationFrame(() => {
      const editor = editorRef.current
      if (!editor) {
        return
      }

      editor.selectionStart = nextSelectionStart
      editor.selectionEnd = nextSelectionEnd
    })
  }

  const getLineIndent = (value: string, cursorStart: number) => {
    const lineStart = value.lastIndexOf('\n', cursorStart - 1) + 1
    const lineEnd = value.indexOf('\n', cursorStart)
    const currentLine = value.slice(lineStart, lineEnd === -1 ? value.length : lineEnd)
    const match = currentLine.match(/^\s*/)

    return match ? match[0] : ''
  }

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return
    }

    const editor = editorRef.current
    if (!editor) {
      return
    }

    const { selectionStart: start, selectionEnd: end, value } = editor

    if (event.key === 'Tab') {
      event.preventDefault()

      const insertion = indentUnit
      const nextValue = `${value.slice(0, start)}${insertion}${value.slice(end)}`

      updateEditorValue(nextValue, start + insertion.length)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()

      const lineIndent = getLineIndent(value, start)
      const previousChar = value[start - 1]
      const nextChar = value[start]

      if (previousChar === '{' && nextChar === '}') {
        const insertion = `\n${lineIndent}${indentUnit}\n${lineIndent}`
        const nextValue = `${value.slice(0, start)}${insertion}${value.slice(end)}`

        updateEditorValue(nextValue, start + 1 + lineIndent.length + indentUnit.length)
        return
      }

      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const lineEnd = value.indexOf('\n', start)
      const currentLine = value.slice(lineStart, lineEnd === -1 ? value.length : lineEnd)
      const extraIndent = /{\s*$/.test(currentLine) ? indentUnit : ''
      const insertion = `\n${lineIndent}${extraIndent}`
      const nextValue = `${value.slice(0, start)}${insertion}${value.slice(end)}`

      updateEditorValue(nextValue, start + insertion.length)
      return
    }

    const bracketPairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
    }

    const closingBrackets = new Set(Object.values(bracketPairs))

    if (closingBrackets.has(event.key)) {
      if (value[start] === event.key) {
        event.preventDefault()
        updateEditorValue(value, start + 1)
      }

      return
    }

    if (!(event.key in bracketPairs)) {
      return
    }

    event.preventDefault()

    const closingBracket = bracketPairs[event.key]

    if (start !== end) {
      const selectedText = value.slice(start, end)
      const nextValue = `${value.slice(0, start)}${event.key}${selectedText}${closingBracket}${value.slice(end)}`
      updateEditorValue(nextValue, start + 1, end + 1)
      return
    }

    const nextValue = `${value.slice(0, start)}${event.key}${closingBracket}${value.slice(end)}`
    updateEditorValue(nextValue, start + 1)
  }

  const handleEditorScroll = () => {
    const editor = editorRef.current
    const highlighter = highlightRef.current

    if (!editor || !highlighter) {
      return
    }

    highlighter.scrollTop = editor.scrollTop
    highlighter.scrollLeft = editor.scrollLeft
  }

  const handleEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value
    setUserCode(nextValue)
    sessionStorage.setItem(draftStorageKey, nextValue)
  }

  const handleRunTests = async () => {
    setIsRunning(true)
    try {
      // Extract function name based on problem
      let funcName = 'solve'
      if (problem.id === 'reverse-array') funcName = 'reverseArray'
      if (problem.id === 'count-unique-chars') funcName = 'countUniqueChars'
      if (problem.id === 'merge-objects') funcName = 'mergeObjects'
      if (problem.id === 'filter-and-transform') funcName = 'filterAndTransform'

      const results = evaluateUserCode(userCode, problem.testCases, funcName)
      setTestResults(results)
    } catch (error) {
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="page-shell pb-12 pt-8 md:pt-10 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <button
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors mb-3"
          >
            ← Back to Problems
          </button>
          <h1 className="text-3xl font-bold text-slate-900">{problem.title}</h1>
          <div className="flex gap-2 mt-3">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                problem.difficulty === 'Easy'
                  ? 'bg-green-50 text-green-700'
                  : problem.difficulty === 'Medium'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-red-50 text-red-700'
              }`}
            >
              {problem.difficulty}
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
              {problem.category}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Problem Description & Hints */}
        <div className="lg:col-span-1 space-y-6">
          {/* Problem Description */}
          <section className="surface-card p-5 rounded-[18px] border border-slate-200 space-y-4">
            <div>
              <h2 className="font-semibold text-slate-900 text-sm mb-2">Problem Description</h2>
              <p className="text-sm text-slate-700 leading-6">{problem.description}</p>
            </div>

            {/* Constraints */}
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Constraints</h3>
              <ul className="space-y-1">
                {problem.constraints.map((constraint, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex gap-2">
                    <span className="text-slate-400">•</span>
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Hints */}
          <section className="surface-card p-5 rounded-[18px] border border-slate-200 space-y-3">
            <h2 className="font-semibold text-slate-900 text-sm">Hints</h2>
            <div className="space-y-2">
              {['hint1', 'hint2', 'hint3'].map((hintKey, idx) => (
                <button
                  key={hintKey}
                  onClick={() => toggleHint(hintKey)}
                  className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">Hint {idx + 1}</span>
                    <span className="text-slate-400">{expandedHints.has(hintKey) ? '−' : '+'}</span>
                  </div>
                  {expandedHints.has(hintKey) && (
                    <p className="text-xs text-slate-600 mt-2 leading-5">
                      {problem.hints[hintKey as keyof typeof problem.hints]}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Test Cases Reference */}
          <section className="surface-card p-5 rounded-[18px] border border-slate-200 space-y-3">
            <h2 className="font-semibold text-slate-900 text-sm">Test Cases</h2>
            <div className="space-y-2 text-xs">
              {problem.testCases.map((testCase, idx) => (
                <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200">
                  <p className="text-slate-600 mb-1">
                    <span className="font-mono text-slate-900">Test {idx + 1}:</span> {testCase.explanation}
                  </p>
                  <p className="text-slate-700 font-mono ml-1">
                    <span className="text-blue-600">Input:</span> {JSON.stringify(testCase.input)}
                  </p>
                  <p className="text-slate-700 font-mono ml-1">
                    <span className="text-green-600">Output:</span> {JSON.stringify(testCase.expectedOutput)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Code Editor & Solution */}
        <div className="lg:col-span-2 space-y-6">
          {/* View Mode Toggle */}
          <div className="flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setViewMode('solve')}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                viewMode === 'solve'
                  ? 'text-slate-900 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Write Code
            </button>
            <button
              onClick={() => setViewMode('solution')}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                viewMode === 'solution'
                  ? 'text-slate-900 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              View Solution
            </button>
          </div>

          {/* Code Editor */}
          {viewMode === 'solve' && (
            <section className="surface-card p-5 rounded-[18px] border border-slate-200 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Your Solution</label>
                <div className="relative min-h-[28rem] overflow-hidden rounded-lg border border-slate-200 bg-slate-900 lg:min-h-[36rem] xl:min-h-[42rem]">
                  <div ref={highlightRef} aria-hidden="true" className="absolute inset-0 overflow-auto pointer-events-none problem-editor-highlighter">
                    <SyntaxHighlighter
                      language="javascript"
                      style={atomOneDark}
                      wrapLongLines
                      customStyle={{
                        margin: 0,
                        minHeight: '100%',
                        background: 'transparent',
                        padding: '0',
                        fontSize: '0.875rem',
                        lineHeight: '1.25rem',
                        overflow: 'visible',
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: 'Consolas, monospace',
                          fontSize: '0.875rem',
                          lineHeight: '1.25rem',
                          letterSpacing: '0',
                          fontWeight: 400,
                          fontVariantLigatures: 'none',
                          tabSize: 2,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        },
                      }}
                    >
                      {userCode || ' '}
                    </SyntaxHighlighter>
                  </div>
                  <textarea
                    ref={editorRef}
                    value={userCode}
                    onChange={handleEditorChange}
                    onKeyDown={handleEditorKeyDown}
                    onScroll={handleEditorScroll}
                    style={{
                      fontFamily: 'Consolas, monospace',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0',
                      fontWeight: 400,
                      fontVariantLigatures: 'none',
                      tabSize: 2,
                    }}
                    className="absolute inset-0 h-full w-full resize-none border-0 bg-transparent p-4 text-transparent caret-white focus:outline-none"
                    placeholder="Write your function here..."
                    spellCheck="false"
                    wrap="soft"
                  />
                </div>
              </div>

              <button
                onClick={handleRunTests}
                disabled={isRunning}
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
              >
                {isRunning ? 'Running Tests...' : 'Run Tests'}
              </button>

              {/* Test Harness - Results */}
              {testResults && (
                <TestHarness testResults={testResults} />
              )}
            </section>
          )}

          {/* Solution View */}
          {viewMode === 'solution' && (
            <section className="space-y-6">
              {/* Optimal Solution */}
              <div className="surface-card p-5 rounded-[18px] border border-slate-200 space-y-4">
                <div>
                  <h2 className="font-semibold text-slate-900 text-lg mb-2">Optimal Solution</h2>
                  <p className="text-xs text-slate-600 mb-4">{problem.fullSolution.explanation}</p>
                  <SyntaxHighlighter language="javascript" style={atomOneDark} wrapLongLines className="rounded-lg !p-4 text-xs !m-0">
                    {problem.fullSolution.code}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Other Approaches */}
              {problem.otherApproaches.length > 0 && (
                <div className="surface-card p-5 rounded-[18px] border border-slate-200 space-y-4">
                  <h2 className="font-semibold text-slate-900 text-lg">Other Approaches</h2>
                  <div className="space-y-3">
                    {problem.otherApproaches.map((approach, idx) => (
                      <div key={idx} className="border-l-4 border-amber-300 bg-amber-50 p-3 rounded">
                        <h3 className="font-semibold text-slate-900 text-sm mb-1">{approach.title}</h3>
                        <p className="text-xs text-slate-700 leading-5">{approach.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
