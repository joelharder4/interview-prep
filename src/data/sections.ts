import javascriptImage from '../assets/javascript.svg'
import reactImage from '../assets/reactjs.svg'
import dataStructuresImage from '../assets/data-structures.svg'
import algorithmsImage from '../assets/algorithms.svg'
import pythonImage from '../assets/python.svg'
import cssImage from '../assets/css.svg'
import networkingImage from '../assets/networking.svg'
import architectureImage from '../assets/architecture.svg'

export type Section = {
  slug: string
  title: string
  kind: 'Practice' | 'Theory'
  description: string
  image: string
}

export const sections: Section[] = [
  {
    slug: 'javascript',
    title: 'JavaScript',
    kind: 'Practice',
    description: 'Language essentials, patterns, and problem-solving drills.',
    image: javascriptImage,
  },
  {
    slug: 'react',
    title: 'React.js',
    kind: 'Practice',
    description: 'Hooks, rendering patterns, state, and component architecture.',
    image: reactImage,
  },
  {
    slug: 'css',
    title: 'CSS',
    kind: 'Practice',
    description: 'Layout systems, responsive styling, and visual problem solving.',
    image: cssImage,
  },
  {
    slug: 'data-structures',
    title: 'Data Structures',
    kind: 'Theory',
    description: 'Core structures, tradeoffs, and real interview use cases.',
    image: dataStructuresImage,
  },
  {
    slug: 'algorithms',
    title: 'Algorithms',
    kind: 'Theory',
    description: 'Complexity strategy, common techniques, and walkthroughs.',
    image: algorithmsImage,
  },
  {
    slug: 'python',
    title: 'Python',
    kind: 'Practice',
    description: 'Syntax fluency, coding exercises, and implementation speed.',
    image: pythonImage,
  },
  {
    slug: 'networking-web-fundamentals',
    title: 'Networking & Web Fundamentals',
    kind: 'Theory',
    description: 'HTTP, DNS, caching, browsers, and request lifecycle mastery.',
    image: networkingImage,
  },
  {
    slug: 'architecture-design',
    title: 'Architecture & Design',
    kind: 'Theory',
    description: 'System thinking, scaling basics, and resilient design choices.',
    image: architectureImage,
  },
]
