import { Link } from 'react-router-dom'
import type { Section } from '../data/sections'

type GenericSectionPageProps = {
  section: Section
}

export function GenericSectionPage({ section }: GenericSectionPageProps) {
  return (
    <main className="section-page">
      <div className="section-shell">
        <div className="page-topbar">
          <Link to="/" className="home-pill" aria-label="Back to home">
            Home
          </Link>
        </div>
        <img src={section.image} alt={`${section.title} artwork`} className="section-cover" />
        <span className={`chip ${section.kind.toLowerCase()}`}>{section.kind}</span>
        <h1>{section.title}</h1>
        <p>{getSectionMessage(section)}</p>
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
