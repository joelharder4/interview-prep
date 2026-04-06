import { Navigate, useParams } from 'react-router-dom'
import type { ComponentType } from 'react'
import { sections } from '../data/sections'
import { AlgorithmsPage } from './AlgorithmsPage'
import { DataStructuresPage } from './DataStructuresPage'
import { GenericSectionPage } from './GenericSectionPage'
import { NetworkingFundamentalsPage } from './NetworkingFundamentalsPage'

const specializedSectionPages: Record<string, ComponentType> = {
  algorithms: AlgorithmsPage,
  'data-structures': DataStructuresPage,
  'networking-web-fundamentals': NetworkingFundamentalsPage,
}

export function SectionPage() {
  const { slug } = useParams()
  const section = sections.find((item) => item.slug === slug)

  if (!section) {
    return <Navigate to="/" replace />
  }

  const SpecializedPage = specializedSectionPages[section.slug]
  if (SpecializedPage) {
    return <SpecializedPage />
  }

  return <GenericSectionPage section={section} />
}
