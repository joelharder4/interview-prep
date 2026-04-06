import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    browserJourneyVariants,
    httpMethodSpecs,
    networkingModules,
    type NetworkingModule,
} from '../data/networking'

export function NetworkingFundamentalsPage() {
    const [activeJourney, setActiveJourney] = useState(browserJourneyVariants[0].id)

    const activeJourneyData = useMemo(
        () => browserJourneyVariants.find((variant) => variant.id === activeJourney) ?? browserJourneyVariants[0],
        [activeJourney],
    )

    return (
        <main className="page-shell pb-16 pt-10 md:pt-12">
            <header className="mb-8 space-y-3">
                <div className="mb-4">
                    <Link to="/" className="home-link soft-focus" aria-label="Back to home">
                        Home
                    </Link>
                </div>
                <p className="eyebrow">Theory - Networking and Web Fundamentals</p>
                <h1 className="max-w-[24ch] text-[clamp(1.95rem,5.1vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.02em] text-[var(--text)]">
                    Internet request lifecycle, protocols, and practical caveats
                </h1>
                <p className="max-w-[78ch] text-[0.96rem] leading-7 text-[var(--muted)]">
                    Designed for deep junior-level understanding: what happens on the wire, why each
                    protocol step exists, and where production behavior diverges because of caching,
                    negotiation, and network constraints.
                </p>
            </header>

            <section className="surface-card mb-6 space-y-4 p-4 md:p-5" aria-label="Open browser scenario">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-[1.14rem] font-semibold tracking-[-0.01em] text-[var(--text)]">
                        Scenario Walkthrough: You type www.example.com and press Enter
                    </h2>
                    <span className="rounded-full border border-[var(--line)] px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                        Branch-aware flow
                    </span>
                </div>

                <div className="flex flex-wrap gap-2" aria-label="Journey variants">
                    {browserJourneyVariants.map((variant) => {
                        const isActive = variant.id === activeJourneyData.id
                        return (
                            <button
                                key={variant.id}
                                type="button"
                                onClick={() => setActiveJourney(variant.id)}
                                className={`soft-focus rounded-full border px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] transition ${isActive ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]' : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'}`}
                            >
                                {variant.label}
                            </button>
                        )
                    })}
                </div>

                <p className="text-[0.9rem] leading-6 text-[var(--muted)]">{activeJourneyData.description}</p>

                <ol className="grid gap-2 md:grid-cols-2">
                    {activeJourneyData.steps.map((step) => (
                        <li key={step.title} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
                            <p className="font-semibold text-[var(--text)]">{step.title}</p>
                            <p className="mt-1 text-[0.88rem] leading-6 text-[var(--muted)]">{step.detail}</p>
                            {step.caveat ? (
                                <p className="mt-2 rounded-md bg-[#fff4df] px-2 py-1 text-[0.8rem] leading-6 text-[#7c2d12]">
                                    Caveat: {step.caveat}
                                </p>
                            ) : null}
                        </li>
                    ))}
                </ol>
            </section>

            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
                <aside className="surface-card top-4 h-fit p-3 lg:sticky" aria-label="Module index">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                        Modules
                    </p>
                    <nav className="mt-2 space-y-1">
                        {networkingModules.map((module) => (
                            <a
                                key={module.id}
                                href={`#module-${module.id}`}
                                className="soft-focus block rounded-lg px-2 py-2 text-[0.86rem] text-[var(--muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                            >
                                {module.title}
                            </a>
                        ))}
                    </nav>
                </aside>

                <div className="space-y-5">
                    {networkingModules.map((module) => (
                        <NetworkingModuleSection key={module.id} module={module} />
                    ))}

                    <section id="module-http-method-reference" className="surface-card space-y-3 p-4 md:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-[1.12rem] font-semibold tracking-[-0.01em] text-[var(--text)]">
                                HTTP Method Reference
                            </h2>
                            <span className="rounded-full border border-[var(--line)] px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-[var(--muted)]">
                                Detailed semantics
                            </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
                            <table className="w-full min-w-[760px] border-collapse text-left">
                                <thead className="bg-[#f2f4f6]">
                                    <tr>
                                        <th className="px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-[var(--muted)]">Method</th>
                                        <th className="px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-[var(--muted)]">Safe</th>
                                        <th className="px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-[var(--muted)]">Idempotent</th>
                                        <th className="px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-[var(--muted)]">Typical Use</th>
                                        <th className="px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-[var(--muted)]">Caveat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {httpMethodSpecs.map((spec) => (
                                        <tr key={spec.method} className="border-t border-[var(--line)] bg-[var(--surface)]">
                                            <td className="px-3 py-2 font-mono text-[0.76rem] text-[var(--text)]">{spec.method}</td>
                                            <td className="px-3 py-2"><BooleanBadge value={spec.safe} /></td>
                                            <td className="px-3 py-2"><BooleanBadge value={spec.idempotent} /></td>
                                            <td className="px-3 py-2 text-[0.86rem] leading-6 text-[var(--text)]">{spec.typicalUse}</td>
                                            <td className="px-3 py-2 text-[0.84rem] leading-6 text-[var(--muted)]">{spec.caveat}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

function NetworkingModuleSection({ module }: { module: NetworkingModule }) {
    return (
        <section id={`module-${module.id}`} className="surface-card space-y-3 p-4 md:p-5">
            <header className="space-y-2">
                <h2 className="text-[1.14rem] font-semibold tracking-[-0.01em] text-[var(--text)]">{module.title}</h2>
                <p className="text-[0.92rem] leading-7 text-[var(--muted)]">{module.summary}</p>
                <p className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[0.87rem] leading-6 text-[var(--text)]">
                    <span className="font-semibold">Why this matters:</span> {module.whyItMatters}
                </p>
            </header>

            <div className="grid gap-4 lg:grid-cols-2">
                <article>
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.08em] text-[var(--muted)]">Key concepts</p>
                    <ul className="mt-2 space-y-2 text-[0.88rem] leading-6 text-[var(--text)]">
                        {module.keyConcepts.map((item) => (
                            <li key={item} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
                                {item}
                            </li>
                        ))}
                    </ul>
                </article>

                <article>
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.08em] text-[var(--muted)]">Caveats and reminders</p>
                    <ul className="mt-2 space-y-2 text-[0.88rem] leading-6 text-[#7c2d12]">
                        {module.caveats.map((item) => (
                            <li key={item} className="rounded-lg border border-[#f4b76a] bg-[#fff1d6] px-3 py-2">
                                {item}
                            </li>
                        ))}
                    </ul>
                </article>
            </div>

            {module.diagrams.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                    {module.diagrams.map((diagram) => (
                        <figure key={diagram.label} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
                            <img
                                src={diagram.src}
                                alt={diagram.label}
                                loading="lazy"
                                className="w-full rounded-lg border border-[var(--line)] bg-[#f3f4f6] p-2"
                            />
                            <figcaption className="mt-2 text-[0.83rem] leading-6 text-[var(--muted)]">
                                <span className="font-semibold text-[var(--text)]">{diagram.label}:</span> {diagram.caption}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            ) : null}
        </section>
    )
}

function BooleanBadge({ value }: { value: boolean }) {
    return (
        <span
            className={`inline-flex rounded-full border px-2 py-1 font-mono text-[0.63rem] uppercase tracking-[0.08em] ${value ? 'border-[#9ecfb8] bg-[#d7f0e5] text-[#1e5b49]' : 'border-[#f4b76a] bg-[#fff1d6] text-[#92400e]'}`}
        >
            {value ? 'Yes' : 'No'}
        </span>
    )
}
