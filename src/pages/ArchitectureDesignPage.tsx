import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    architectureModules,
    architectureScenarioVariants,
    type ArchitectureModule,
} from '../data/architecture'
import { sections } from '../data/sections'

const architectureSection = sections.find((section) => section.slug === 'architecture-design')

export function ArchitectureDesignPage() {
    const [activeScenario, setActiveScenario] = useState(architectureScenarioVariants[0].id)

    const scenario = useMemo(
        () => architectureScenarioVariants.find((variant) => variant.id === activeScenario) ?? architectureScenarioVariants[0],
        [activeScenario],
    )

    if (!architectureSection) {
        return null
    }

    return (
        <main className="page-shell pb-16 pt-10 md:pt-12">
            <header className="mb-8 space-y-3">
                <div className="mb-4">
                    <Link to="/" className="home-link soft-focus" aria-label="Back to home">
                        Home
                    </Link>
                </div>
                <p className="eyebrow">Theory - Architecture & Design</p>
                <h1 className="max-w-[22ch] text-[clamp(1.95rem,5.2vw,3rem)] font-bold leading-[1.06] tracking-[-0.02em] text-(--text)">
                    System thinking, tradeoffs, and resilient design choices
                </h1>
                <p className="max-w-[74ch] text-[0.95rem] leading-7 text-(--muted)">
                    A decision-focused refresher for system design interviews: start with constraints, pick the
                    right boundaries, and explain why one shape is better than another for the problem at hand.
                </p>
            </header>

            <section className="surface-card mb-6 space-y-4 p-4 md:p-5" aria-label="Architecture scenario">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-[1.14rem] font-semibold tracking-[-0.01em] text-(--text)">
                            Scenario: design a product that needs to grow safely
                        </h2>
                        <span className="rounded-full border border-(--line) px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">
                            Decision flow
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2" aria-label="Scenario variants">
                        {architectureScenarioVariants.map((variant) => {
                            const isActive = variant.id === scenario.id
                            return (
                                <button
                                    key={variant.id}
                                    type="button"
                                    onClick={() => setActiveScenario(variant.id)}
                                    className={`soft-focus rounded-full border px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] transition ${isActive ? 'border-(--accent) bg-(--accent-soft) text-(--accent)' : 'border-(--line) bg-(--surface) text-(--muted) hover:border-(--accent) hover:text-(--accent)'}`}
                                >
                                    {variant.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <p className="text-[0.9rem] leading-6 text-(--muted)">{scenario.description}</p>

                <ol className="grid gap-2 md:grid-cols-3">
                    {scenario.steps.map((step) => (
                        <li key={step.title} className="rounded-xl border border-(--line) bg-(--surface) p-3">
                            <p className="font-semibold text-(--text)">{step.title}</p>
                            <p className="mt-1 text-[0.88rem] leading-6 text-(--muted)">{step.detail}</p>
                            <p className="mt-2 rounded-md bg-[#fff4df] px-2 py-1 text-[0.8rem] leading-6 text-[#7c2d12]">
                                Prompt: {step.prompt}
                            </p>
                        </li>
                    ))}
                </ol>
            </section>

            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
                <aside className="surface-card top-4 h-fit p-3 lg:sticky" aria-label="Module index">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-(--muted)">
                        Modules
                    </p>
                    <nav className="mt-2 space-y-1">
                        {architectureModules.map((module) => (
                            <a
                                key={module.id}
                                href={`#module-${module.id}`}
                                className="soft-focus block rounded-lg px-2 py-2 text-[0.86rem] text-(--muted) transition hover:bg-(--accent-soft) hover:text-(--accent)"
                            >
                                {module.title}
                            </a>
                        ))}
                    </nav>
                </aside>

                <div className="space-y-5">
                    {architectureModules.map((module) => (
                        <ArchitectureModuleSection key={module.id} module={module} />
                    ))}

                    <section className="surface-card space-y-3 p-4 md:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-[1.12rem] font-semibold tracking-[-0.01em] text-(--text)">
                                Database Choices
                            </h2>
                            <span className="rounded-full border border-(--line) px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">
                                Relational vs non-relational
                            </span>
                        </div>

                        <p className="max-w-[72ch] text-[0.9rem] leading-7 text-(--muted)">
                            Pick the database based on the shape of the data and the kind of query you need to make fast.
                            The table below is a quick interview guide, not a hard rulebook.
                        </p>

                        <div className="overflow-hidden rounded-xl border border-(--line)">
                            <table className="w-full table-fixed border-collapse text-left">
                                <thead className="bg-[#f2f4f6]">
                                    <tr>
                                        <th className="w-[18%] px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">Database</th>
                                        <th className="w-[14%] px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">Relational?</th>
                                        <th className="w-[24%] px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">Good at</th>
                                        <th className="w-[22%] px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">Not great for</th>
                                        <th className="w-[22%] px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">Use when</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['PostgreSQL / MySQL', 'Yes', 'transactions, joins, reporting, strong consistency', 'highly variable documents or very loose schemas', 'relationships and correctness matter most'],
                                        ['SQLite', 'Yes', 'embedded apps, local state, simple deployments', 'heavy concurrent writes or distributed scale', 'you need something small, reliable, and local'],
                                        ['MongoDB', 'No', 'document-shaped data, fast iteration, flexible schemas', 'deep joins and rigid relational workflows', 'your data is naturally document-like and evolving'],
                                        ['Redis', 'No', 'cache, sessions, counters, fast lookups', 'durable primary storage or complex querying', 'you need speed and can rebuild or expire data'],
                                        ['DynamoDB', 'No', 'high-scale key-value access with predictable access patterns', 'ad hoc querying or relational joins', 'you know the access pattern up front and need elasticity'],
                                        ['Neo4j', 'No', 'graph relationships, traversal, connected data', 'simple tabular reporting or bulk transactional CRUD', 'relationships between entities are the main problem'],
                                    ].map(([database, relational, goodAt, notGreatFor, useWhen]) => (
                                        <tr key={database} className="border-t border-(--line) bg-(--surface)">
                                            <td className="px-3 py-2 align-top text-[0.84rem] leading-6 text-(--text) wrap-break-word">{database}</td>
                                            <td className="px-3 py-2 align-top font-mono text-[0.76rem] text-(--text) wrap-break-word">{relational}</td>
                                            <td className="px-3 py-2 align-top text-[0.84rem] leading-6 text-(--text) wrap-break-word">{goodAt}</td>
                                            <td className="px-3 py-2 align-top text-[0.84rem] leading-6 text-(--muted) wrap-break-word">{notGreatFor}</td>
                                            <td className="px-3 py-2 align-top text-[0.84rem] leading-6 text-(--muted) wrap-break-word">{useWhen}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="surface-card space-y-3 p-4 md:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-[1.12rem] font-semibold tracking-[-0.01em] text-(--text)">
                                Architecture Decision Reference
                            </h2>
                            <span className="rounded-full border border-(--line) px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">
                                Tradeoff matrix
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-(--line)">
                            <table className="w-full table-fixed border-collapse text-left">
                                <thead className="bg-[#f2f4f6]">
                                    <tr>
                                        <th className="w-[20%] px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">Choice</th>
                                        <th className="w-[38%] px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">Best when</th>
                                        <th className="w-[42%] px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">Watch out</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['Monolith', 'The team is small or the domain is still changing quickly.', 'Boundaries must stay disciplined or the codebase becomes tangled.'],
                                        ['Microservices', 'Ownership and scale pressure justify separate deployables.', 'Operational complexity and coordination cost rise quickly.'],
                                        ['Cache-first', 'Read-heavy data can tolerate brief staleness.', 'Invalidation and source-of-truth drift must be planned carefully.'],
                                        ['Async queue', 'Work does not need to finish inside the user request.', 'Eventual consistency and retry handling become part of the design.'],
                                    ].map(([choice, bestWhen, watchOut]) => (
                                        <tr key={choice} className="border-t border-(--line) bg-(--surface)">
                                            <td className="px-3 py-2 align-top font-mono text-[0.76rem] text-(--text) wrap-break-word">{choice}</td>
                                            <td className="px-3 py-2 align-top text-[0.86rem] leading-6 text-(--text) wrap-break-word">{bestWhen}</td>
                                            <td className="px-3 py-2 align-top text-[0.84rem] leading-6 text-(--muted) wrap-break-word">{watchOut}</td>
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

function ArchitectureModuleSection({ module }: { module: ArchitectureModule }) {
    return (
        <section id={`module-${module.id}`} className="surface-card space-y-4 p-4 md:p-5">
            <header className="space-y-2">
                <h2 className="text-[1.14rem] font-semibold tracking-[-0.01em] text-(--text)">{module.title}</h2>
                <p className="text-[0.92rem] leading-7 text-(--muted)">{module.summary}</p>
            </header>

            {module.diagrams.length ? (
                <div className="space-y-3">
                    {module.diagrams.map((diagram) => (
                        <figure key={diagram.label} className="overflow-hidden rounded-2xl border border-(--line) bg-[#f8fafc] p-4">
                            <img
                                src={diagram.src}
                                alt={diagram.label}
                                loading="lazy"
                                className="block h-auto w-full"
                            />
                            <figcaption className="mt-3 text-[0.88rem] leading-6 text-(--muted)">
                                <span className="font-semibold text-(--text)">{diagram.label}:</span> {diagram.caption}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-xl border border-(--line) bg-(--surface) p-3">
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">Decision points</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.88rem] leading-6 text-(--text) marker:text-(--accent)">
                        {module.decisionPoints.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </article>

                <article className="space-y-3">
                    <p className="rounded-lg border border-(--line) bg-(--surface) px-3 py-2 text-[0.87rem] leading-6 text-(--text)">
                        <span className="font-semibold">Why it matters:</span> {module.whyItMatters}
                    </p>

                    <section className="rounded-xl border border-(--line) bg-(--surface) p-3">
                        <p className="font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">Tradeoffs</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.88rem] leading-6 text-(--text) marker:text-(--accent)">
                            {module.tradeoffs.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>
                </article>
            </div>

            <section className="rounded-xl border border-(--line) bg-(--surface) p-3">
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.08em] text-(--muted)">Anti-patterns</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.88rem] leading-6 text-[#7c2d12] marker:text-[#d97706]">
                    {module.antiPatterns.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>
        </section>
    )
}
