import { Navigate, useParams } from 'react-router-dom'
import { sections } from '../data/sections'
import { DataStructuresPage } from './DataStructuresPage'
import { GenericSectionPage } from './GenericSectionPage'

export function SectionPage() {
  const { slug } = useParams()
  const section = sections.find((item) => item.slug === slug)

  if (!section) {
    return <Navigate to="/" replace />
  }

  if (section.slug === 'data-structures') {
    return <DataStructuresPage />
  }

  return <GenericSectionPage section={section} />
}
