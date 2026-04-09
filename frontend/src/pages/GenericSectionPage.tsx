import { Link } from 'react-router-dom'
import type { Section } from '../data/sections'

type GenericSectionPageProps = {
  section: Section
}

export function GenericSectionPage({ section }: GenericSectionPageProps) {
  return (
    <main className="page-shell pb-16 pt-10 md:pt-12">
      <div className="surface-card p-4 md:p-6">
        <div className="mb-4">
          <Link to="/" className="home-link soft-focus" aria-label="Back to home">
            Home
          </Link>
        </div>
        <img
          src={section.image}
          alt={`${section.title} artwork`}
          className="aspect-[16/9] w-full rounded-2xl border border-[var(--line)] bg-[#eef1f3] p-2 object-contain"
        />
        <span className={`kind-chip mt-4 ${section.kind.toLowerCase()}`}>{section.kind}</span>
        <h1 className="mt-3 text-[clamp(1.7rem,4.2vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.02em] text-[var(--text)]">
          {section.title}
        </h1>
        <p className="mt-3 max-w-[70ch] text-[0.95rem] leading-7 text-[var(--muted)]">
          {getSectionMessage(section)}
        </p>
      </div>
    </main>
  )
}

function getSectionMessage(section: Section): string {
  if (section.kind === 'Practice') {
    return 'This practice area will hold drills, coding prompts, examples, and eventually live execution workflows connected to your backend.'
  }

  return 'This theory area will evolve into concise, interactive refreshers with visuals and code snippets for quick memory rebuilds.'
}
