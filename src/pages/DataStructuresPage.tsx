import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { dataStructureCards } from '../data/dataStructures'

export function DataStructuresPage() {
  const [flippedCards, setFlippedCards] = useState<string[]>([])

  const toggleCard = (slug: string) => {
    setFlippedCards((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    )
  }

  return (
    <main className="data-structures-page">
      <header className="data-header">
        <div className="page-topbar">
          <Link to="/" className="home-pill" aria-label="Back to home">
            Home
          </Link>
        </div>
        <p className="eyebrow">Theory - Data Structures</p>
        <h1>One-minute memory refresh cards</h1>
        <p className="data-intro">
          Click a diagram to flip it and reveal a compact Python implementation. Each card is
          intentionally short so you can scan and recall fast.
        </p>
      </header>

      <section className="ds-list" aria-label="Data structure quick cards">
        {dataStructureCards.map((card, index) => {
          const isFlipped = flippedCards.includes(card.slug)
          const rowClass = index % 2 === 0 ? 'ds-row' : 'ds-row reverse'

          return (
            <article key={card.slug} className={rowClass}>
              <div className="ds-copy">
                <h2>{card.title}</h2>
                <p>{card.summary}</p>
                <p className="complexity">{card.complexity}</p>
              </div>

              <button
                type="button"
                className={`ds-flip ${isFlipped ? 'is-flipped' : ''}`}
                onClick={() => toggleCard(card.slug)}
                aria-label={`Flip ${card.title} card`}
              >
                <div className="ds-flip-inner">
                  <div className="ds-face ds-front">
                    <div className="diagram-wrap">{card.diagram}</div>
                    <span className="flip-hint">Click diagram for Python code</span>
                  </div>

                  <div className="ds-face ds-back">
                    <SyntaxHighlighter
                      language="python"
                      style={oneLight}
                      showLineNumbers={false}
                      wrapLongLines
                      customStyle={{
                        margin: 0,
                        borderRadius: '10px',
                        padding: '0.75rem',
                        background: '#f6f8fa',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.84rem',
                        lineHeight: '1.46',
                        flex: 1,
                        overflow: 'visible',
                      }}
                      className="python-code"
                    >
                      {card.code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </button>
            </article>
          )
        })}
      </section>
    </main>
  )
}
