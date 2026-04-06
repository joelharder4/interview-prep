import { Link } from 'react-router-dom'
import { sections } from '../data/sections'

export function HomePage() {
  const practiceCount = sections.filter((section) => section.kind === 'Practice').length
  const theoryCount = sections.filter((section) => section.kind === 'Theory').length

  return (
    <main className="page-shell px-0 pb-16 pt-11 md:pt-14">
      <header className="mb-10">
        <p className="eyebrow">Interview Prep Workspace</p>
        <h1 className="mt-2 max-w-[18ch] text-[clamp(2rem,6vw,3.3rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-[var(--text)]">
          A focused space for deliberate interview practice
        </h1>
        <p className="mt-4 max-w-[62ch] text-[0.98rem] leading-7 text-[var(--muted)]">
          Built for repeatable reps: revisit core concepts, run coding drills, and sharpen systems
          instincts without fighting your own notes.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5" aria-label="Section summary">
          <span className="surface-card rounded-full px-3 py-1.5 text-[0.8rem] text-[var(--text)]">
            {practiceCount} Practice Tracks
          </span>
          <span className="surface-card rounded-full px-3 py-1.5 text-[0.8rem] text-[var(--text)]">
            {theoryCount} Theory Tracks
          </span>
        </div>
      </header>

      <section className="grid grid-cols-12 gap-4" aria-label="Main learning sections">
        {sections.map((section) => (
          <Link
            className="surface-card soft-focus col-span-12 overflow-hidden no-underline transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] md:col-span-6 xl:col-span-4"
            to={`/section/${section.slug}`}
            key={section.slug}
            aria-label={`Open ${section.title} section`}
          >
            <img
              src={section.image}
              alt={`${section.title} cover`}
              loading="lazy"
              className="aspect-[16/9] w-full border-b border-[var(--line)] bg-[#edf1f2] p-2 object-contain"
            />
            <div className="px-4 pb-5 pt-4">
              <span className={`kind-chip ${section.kind.toLowerCase()}`}>{section.kind}</span>
              <h2 className="mt-3 text-[1.08rem] font-semibold leading-6 tracking-[-0.01em] text-[var(--text)]">
                {section.title}
              </h2>
              <p className="mt-2 text-[0.92rem] leading-6 text-[var(--muted)]">{section.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
