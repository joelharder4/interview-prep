import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { dataStructureCards } from '../data/dataStructures'

export function DataStructuresPage() {
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({})
  const [copiedCards, setCopiedCards] = useState<Record<string, boolean>>({})

  const toggleCardCode = (slug: string) => {
    setOpenCards((current) => ({
      ...current,
      [slug]: !current[slug],
    }))
  }

  const copyCode = async (slug: string, code: string) => {
    const text = code.replace(/\t/g, '    ').replace(/[ \t]+$/gm, '')

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        textarea.style.pointerEvents = 'none'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setCopiedCards((current) => ({
        ...current,
        [slug]: true,
      }))

      window.setTimeout(() => {
        setCopiedCards((current) => ({
          ...current,
          [slug]: false,
        }))
      }, 1200)
    } catch {
      setCopiedCards((current) => ({
        ...current,
        [slug]: false,
      }))
    }
  }

  return (
    <main className="page-shell pb-16 pt-10 md:pt-12">
      <header className="mb-6 md:mb-8">
        <div className="mb-4">
          <Link to="/" className="home-link soft-focus" aria-label="Back to home">
            Home
          </Link>
        </div>
        <p className="eyebrow">Theory - Data Structures</p>
        <h1 className="mt-2 max-w-[20ch] text-[clamp(1.8rem,4.7vw,2.7rem)] font-bold leading-[1.08] tracking-[-0.02em] text-[var(--text)]">
          Data structures quick refresh
        </h1>
        <p className="mt-3 max-w-[74ch] text-[0.95rem] leading-7 text-[var(--muted)]">
          Built for recall, not teaching. Scan the signal, then open code only when you need a
          syntax nudge.
        </p>
      </header>

      <section className="space-y-4" aria-label="Data structure quick cards">
        {dataStructureCards.map((card, index) => {
          const copyOrder = index % 2 === 0 ? 'xl:order-1' : 'xl:order-2'
          const diagramOrder = index % 2 === 0 ? 'xl:order-2' : 'xl:order-1'
          const isOpen = Boolean(openCards[card.slug])
          const isCopied = Boolean(copiedCards[card.slug])

          return (
            <article key={card.slug} className="surface-card p-4 md:p-5">
              <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className={`${copyOrder} flex flex-col justify-center gap-3`}>
                  <h2 className="text-[1.18rem] font-semibold tracking-[-0.01em] text-[var(--text)]">
                    {card.title}
                  </h2>
                  <p className="text-[0.93rem] leading-7 text-[var(--muted)]">{card.summary}</p>
                  <p className="font-mono text-[0.74rem] uppercase tracking-[0.06em] text-[var(--accent)]">
                    {card.complexity}
                  </p>
                </div>

                <div
                  className={`${diagramOrder} flex min-h-[180px] items-center justify-center rounded-2xl border border-[var(--line)] bg-[#f0eeea] p-4 md:min-h-[200px]`}
                >
                  <img
                    src={card.diagramSrc}
                    alt={`${card.title} diagram`}
                    className="h-auto max-h-[185px] w-full max-w-[280px]"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="mt-4 border-t border-[var(--line)] pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCardCode(card.slug)}
                    aria-expanded={isOpen}
                    aria-controls={`${card.slug}-code`}
                    className="soft-focus inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {isOpen ? 'Hide Python snippet' : 'Show Python snippet'}
                  </button>

                  {isOpen ? (
                    <button
                      type="button"
                      onClick={() => copyCode(card.slug, card.code)}
                      aria-label={`Copy ${card.title} Python snippet`}
                      className="soft-focus inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      {isCopied ? (
                        <span>Copied!</span>
                      ) : (
                        <>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M9 9.75A1.75 1.75 0 0 1 10.75 8h8.5A1.75 1.75 0 0 1 21 9.75v8.5A1.75 1.75 0 0 1 19.25 20h-8.5A1.75 1.75 0 0 1 9 18.25v-8.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M15 8V5.75A1.75 1.75 0 0 0 13.25 4h-8.5A1.75 1.75 0 0 0 3 5.75v8.5A1.75 1.75 0 0 0 4.75 16H9"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  ) : null}
                </div>

                {isOpen ? (
                  <div
                    id={`${card.slug}-code`}
                    className="mt-3 rounded-2xl border border-[var(--line)] bg-[#f8f8f5] p-3"
                  >
                    <SyntaxHighlighter
                      language="python"
                      style={oneLight}
                      showLineNumbers={false}
                      wrapLongLines
                      customStyle={{
                        margin: 0,
                        padding: '0.8rem',
                        border: '1px solid var(--line)',
                        borderRadius: '14px',
                        background: '#f9fafb',
                        fontSize: '0.8rem',
                        lineHeight: 1.55,
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: 'var(--mono)',
                        },
                      }}
                    >
                      {card.code}
                    </SyntaxHighlighter>
                  </div>
                ) : null}
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}
