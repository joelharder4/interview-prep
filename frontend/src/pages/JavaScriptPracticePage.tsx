import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { syntaxTopics } from '../data/javascript-syntax'
import { javascriptProblems } from '../data/javascript-problems'
import ProblemDetail from '../components/ProblemDetail'

type Tab = 'learn' | 'practice'

export default function JavaScriptPracticePage() {
  const [activeTab, setActiveTab] = useState<Tab>('learn')
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(() => {
    return sessionStorage.getItem('javascript-practice.selectedProblemId')
  })

  useEffect(() => {
    if (selectedProblemId) {
      sessionStorage.setItem('javascript-practice.selectedProblemId', selectedProblemId)
      return
    }

    sessionStorage.removeItem('javascript-practice.selectedProblemId')
  }, [selectedProblemId])

  const categories = ['Fundamentals', 'Functions & Async', 'Data Structures', 'OOP'] as const
  const problemCategories = ['Array Manipulation', 'String Handling', 'Object Handling', 'Function Challenge'] as const

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'Easy') return 'text-green-700 bg-green-50'
    if (difficulty === 'Medium') return 'text-amber-700 bg-amber-50'
    return 'text-red-700 bg-red-50'
  }

  if (selectedProblemId) {
    return (
      <ProblemDetail
        problem={javascriptProblems.find((p) => p.id === selectedProblemId)!}
        onBack={() => setSelectedProblemId(null)}
      />
    )
  }

  return (
    <div className="page-shell space-y-8 pb-12 pt-8">      {/* Home Link */}
      <Link to="/" className="home-link inline-block mb-2">
        ← Back to Home
      </Link>
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-[clamp(1.95rem,5.2vw,3rem)] font-bold leading-tight text-black">JavaScript</h1>
        <p className="text-[0.94rem] leading-7 text-slate-700 max-w-2xl">
          Master JavaScript essentials through guided learning and hands-on coding problems. Learn syntax, solve real challenges, and validate your code with instant test feedback.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('learn')}
          className={`px-4 py-3 font-medium text-sm transition-colors ${
            activeTab === 'learn'
              ? 'text-slate-900 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Learn Syntax
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-3 font-medium text-sm transition-colors ${
            activeTab === 'practice'
              ? 'text-slate-900 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Practice Problems
        </button>
      </div>

      {/* Learn Syntax Tab */}
      {activeTab === 'learn' && (
        <div className="space-y-8">
          {categories.map((category) => {
            const topicsInCategory = syntaxTopics.filter((topic) => topic.category === category)
            return (
              <section key={category} className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">{category}</h2>
                <div className="grid gap-4 lg:grid-cols-2">
                  {topicsInCategory.map((topic) => (
                    <article
                      key={topic.id}
                      className="surface-card space-y-3 p-4 md:p-5 rounded-[18px] border border-slate-200 bg-white"
                    >
                      <header>
                        <h3 className="font-semibold text-slate-900 text-sm">{topic.title}</h3>
                      </header>
                      <p className="text-[0.875rem] leading-6 text-slate-700">{topic.explanation}</p>
                      
                      {/* Code Example */}
                      <SyntaxHighlighter
                        language="javascript"
                        style={atomOneDark}
                        wrapLongLines
                        className="rounded-md !p-3 text-xs !m-0"
                      >
                        {topic.codeExample}
                      </SyntaxHighlighter>

                      {/* Pitfall */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <div className="text-xs font-semibold text-yellow-900 mb-1">⚠️ Common Pitfall</div>
                        <p className="text-xs text-yellow-800 leading-5">{topic.commonPitfall}</p>
                      </div>

                      {/* Job Relevance */}
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <div className="text-xs font-semibold text-blue-900 mb-1">💼 Job Relevance</div>
                        <p className="text-xs text-blue-800 leading-5">{topic.jobRelevance}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {/* Practice Problems Tab */}
      {activeTab === 'practice' && (
        <div className="space-y-8">
          {problemCategories.map((category) => {
            const problemsInCategory = javascriptProblems.filter((p) => p.category === category)
            return (
              <section key={category} className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">{category}</h2>
                <div className="space-y-3">
                  {problemsInCategory.map((problem) => (
                    <button
                      key={problem.id}
                      onClick={() => setSelectedProblemId(problem.id)}
                      className="surface-card w-full text-left p-4 md:p-5 rounded-[18px] border border-slate-200 bg-white hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {problem.title}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{problem.description}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                          <span className="text-slate-400 group-hover:text-slate-600">→</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                          {problem.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
