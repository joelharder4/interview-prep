import { Link } from 'react-router-dom'
import { sections } from '../data/sections'

export function HomePage() {
  const practiceCount = sections.filter((section) => section.kind === 'Practice').length
  const theoryCount = sections.filter((section) => section.kind === 'Theory').length

  return (
    <main className="home-page">
      <header className="hero">
        <p className="eyebrow">My Interview Prep</p>
        <h1>My local interview gym, not vibe coded at all :)</h1>
        <p className="hero-copy">
          Built for future me: one place to return to whenever I need to sharpen coding speed,
          review fundamentals, and rebuild confidence before interviews.
        </p>
        <div className="hero-tags" aria-label="Section summary">
          <span>{practiceCount} Practice Tracks</span>
          <span>{theoryCount} Theory Tracks</span>
        </div>
      </header>

      <section className="section-grid" aria-label="Main learning sections">
        {sections.map((section) => (
          <Link
            className="topic-card"
            to={`/section/${section.slug}`}
            key={section.slug}
            aria-label={`Open ${section.title} section`}
          >
            <img src={section.image} alt={`${section.title} cover`} loading="lazy" />
            <div className="card-body">
              <span className={`chip ${section.kind.toLowerCase()}`}>{section.kind}</span>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
