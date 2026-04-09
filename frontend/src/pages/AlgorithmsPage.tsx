import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { AlgorithmStepper } from '../components/AlgorithmStepper'
import { algorithms, type AlgorithmCategory } from '../data/algorithms'

export function AlgorithmsPage() {
    const categories = useMemo(() => {
        return Array.from(new Set(algorithms.map((algorithm) => algorithm.category))) as AlgorithmCategory[]
    }, [])

    const [activeCategory, setActiveCategory] = useState<AlgorithmCategory>(categories[0])
    const [openCode, setOpenCode] = useState<Record<string, boolean>>({})
    const [copiedCards, setCopiedCards] = useState<Record<string, boolean>>({})

    const visibleAlgorithms = useMemo(
        () => algorithms.filter((algorithm) => algorithm.category === activeCategory),
        [activeCategory],
    )

    const toggleCode = (slug: string) => {
        setOpenCode((current) => ({
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
                <p className="eyebrow">Theory - Algorithms</p>
                <h1 className="mt-2 max-w-[20ch] text-[clamp(1.8rem,4.7vw,2.7rem)] font-bold leading-[1.08] tracking-[-0.02em] text-[var(--text)]">
                    Algorithm refresh with live step playback
                </h1>
                <p className="mt-3 max-w-[74ch] text-[0.95rem] leading-7 text-[var(--muted)]">
                    Focus on when each algorithm is the right choice. Step through concrete examples,
                    then inspect the implementation when needed.
                </p>
            </header>

            <nav className="mb-5 flex flex-wrap gap-2" aria-label="Algorithm categories">
                {categories.map((category) => {
                    const isActive = category === activeCategory
                    return (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setActiveCategory(category)}
                            className={`soft-focus rounded-full border px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] transition ${isActive ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]' : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'}`}
                        >
                            {category}
                        </button>
                    )
                })}
            </nav>

            <section className="space-y-4" aria-label="Algorithm cards">
                {visibleAlgorithms.map((algorithm) => {
                    const isCodeOpen = Boolean(openCode[algorithm.slug])
                    const isCopied = Boolean(copiedCards[algorithm.slug])

                    return (
                        <article key={algorithm.slug} className="surface-card space-y-4 p-4 md:p-5">
                            <header className="space-y-2">
                                <h2 className="text-[1.15rem] font-semibold tracking-[-0.01em] text-[var(--text)]">
                                    {algorithm.title}
                                </h2>
                                <p className="text-[0.93rem] leading-7 text-[var(--muted)]">{algorithm.summary}</p>
                                <p className="text-[0.88rem] leading-6 text-[var(--text)]">
                                    <span className="font-semibold">Best use:</span> {algorithm.bestFor}
                                </p>
                                <div className="flex flex-wrap gap-2 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                                    <span className="rounded-full border border-[var(--line)] px-2.5 py-1">
                                        Time {algorithm.complexity.time}
                                    </span>
                                    <span className="rounded-full border border-[var(--line)] px-2.5 py-1">
                                        Space {algorithm.complexity.space}
                                    </span>
                                </div>
                            </header>

                            <AlgorithmStepper algorithm={algorithm} />

                            <div className="border-t border-[var(--line)] pt-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleCode(algorithm.slug)}
                                        aria-expanded={isCodeOpen}
                                        aria-controls={`${algorithm.slug}-code`}
                                        className="soft-focus inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                    >
                                        {isCodeOpen ? 'Hide Python snippet' : 'Show Python snippet'}
                                    </button>

                                    {isCodeOpen ? (
                                        <button
                                            type="button"
                                            onClick={() => copyCode(algorithm.slug, algorithm.code)}
                                            aria-label={`Copy ${algorithm.title} Python snippet`}
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

                                {isCodeOpen ? (
                                    <div
                                        id={`${algorithm.slug}-code`}
                                        className="mt-3 rounded-2xl border border-[var(--line)] p-3"
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
                                            {algorithm.code}
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
