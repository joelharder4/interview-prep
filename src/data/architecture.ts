export type ArchitectureModuleId =
    | 'system-goals'
    | 'boundaries'
    | 'data-and-cache'
    | 'scaling-and-reliability'
    | 'operations-and-observability'

export type ArchitectureDiagram = {
    label: string
    src: string
    caption: string
}

export type ArchitectureModule = {
    id: ArchitectureModuleId
    title: string
    summary: string
    whyItMatters: string
    decisionPoints: string[]
    tradeoffs: string[]
    antiPatterns: string[]
    diagrams: ArchitectureDiagram[]
}

export type ArchitectureScenarioStep = {
    title: string
    detail: string
    prompt: string
}

export type ArchitectureScenarioVariant = {
    id: 'starter-app' | 'growing-product' | 'spiky-traffic'
    label: string
    description: string
    steps: ArchitectureScenarioStep[]
}

export const architectureScenarioVariants: ArchitectureScenarioVariant[] = [
    {
        id: 'starter-app',
        label: 'Starter App',
        description: 'A small team is shipping a product quickly and needs a sane first architecture.',
        steps: [
            {
                title: '1. Define the first boundary',
                detail: 'Pick the smallest set of responsibilities you can keep simple and independent.',
                prompt: 'What must stay in the core app, and what can wait for later?',
            },
            {
                title: '2. Choose the persistence shape',
                detail: 'Decide whether one database is enough or whether separate stores are already justified.',
                prompt: 'What data needs strong consistency, and what can be derived later?',
            },
            {
                title: '3. Keep the deploy path simple',
                detail: 'Prefer one deployable unit until the team has a real scaling or ownership reason to split it.',
                prompt: 'What complexity are you avoiding by not splitting too early?',
            },
        ],
    },
    {
        id: 'growing-product',
        label: 'Growing Product',
        description: 'Traffic is rising and the team needs to remove bottlenecks without creating coordination chaos.',
        steps: [
            {
                title: '1. Remove the hottest bottleneck',
                detail: 'Find the slowest path first: database reads, expensive jobs, or a synchronous dependency.',
                prompt: 'Which part of the request path is hurting latency the most?',
            },
            {
                title: '2. Add the right cache',
                detail: 'Cache only the data that is expensive to recompute and safe to serve briefly stale.',
                prompt: 'What data can be cached without confusing users or breaking correctness?',
            },
            {
                title: '3. Introduce async work carefully',
                detail: 'Move slow side effects to a queue when the user does not need the result immediately.',
                prompt: 'Which tasks can leave the request path and still satisfy the product?',
            },
        ],
    },
    {
        id: 'spiky-traffic',
        label: 'Spiky Traffic',
        description: 'A campaign or event creates sudden load, and the design must survive bursts cleanly.',
        steps: [
            {
                title: '1. Protect the backend',
                detail: 'Use edge caching, rate limiting, and backpressure before the database starts collapsing.',
                prompt: 'What can absorb the spike before it reaches the core service?',
            },
            {
                title: '2. Make failure boring',
                detail: 'Return partial results, retries, or graceful degradation when the ideal path is unavailable.',
                prompt: 'What should the system do when a dependency is slow or down?',
            },
            {
                title: '3. Watch the signals',
                detail: 'Instrument the paths that will tell you whether the burst was handled or hidden.',
                prompt: 'How will you know the architecture actually survived the spike?',
            },
        ],
    },
]

export const architectureModules: ArchitectureModule[] = [
    {
        id: 'system-goals',
        title: 'System Goals and Constraints',
        summary: 'Start with the problem shape, not the technology stack.',
        whyItMatters: 'A good architecture answer begins with constraints: scale, latency, durability, team size, and delivery speed.',
        decisionPoints: [
            'What are the primary user journeys?',
            'Which quality attribute matters most right now: speed, reliability, cost, or simplicity?',
            'What failure is acceptable, and what failure is not?',
        ],
        tradeoffs: [
            'Optimizing for delivery speed usually means fewer moving parts at the beginning.',
            'Optimizing for scale too early often creates unnecessary operational burden.',
            'The best design depends on the constraint you choose to protect first.',
        ],
        antiPatterns: [
            'Starting with microservices because they sound “scalable”.',
            'Ignoring the product shape and jumping straight into tools.',
            'Treating every requirement as equally urgent.',
        ],
        diagrams: [
            {
                label: 'Architecture decision frame',
                src: '/diagrams/architecture-decision-frame.svg',
                caption: 'Arrow sequence: constraints -> choices -> tradeoffs -> feedback loop back to constraints for the next iteration.',
            },
        ],
    },
    {
        id: 'boundaries',
        title: 'Boundaries and Modular Design',
        summary: 'Choose clear ownership before you choose service count.',
        whyItMatters: 'Well-defined boundaries keep the codebase understandable and make later splitting cheaper.',
        decisionPoints: [
            'Which responsibilities belong together?',
            'What data should stay private inside a module?',
            'Where does the team need a stable interface?',
        ],
        tradeoffs: [
            'A monolith can be easier to change when the boundary is still evolving.',
            'Microservices can help when ownership and deployment need to split cleanly.',
            'The wrong boundary creates more coordination cost than code reuse ever saves.',
        ],
        antiPatterns: [
            'Splitting services along database tables instead of domain responsibilities.',
            'Letting every team invent its own contract style.',
            'Creating shared libraries that quietly become distributed monoliths.',
        ],
        diagrams: [
            {
                label: 'Boundary and ownership map',
                src: '/diagrams/architecture-boundaries.svg',
                caption: 'Arrows show cross-boundary contracts: direct API call first, then event-driven handoff for async work.',
            },
        ],
    },
    {
        id: 'data-and-cache',
        title: 'Data, Storage, and Caching',
        summary: 'Pick storage and cache behavior based on access patterns and correctness needs.',
        whyItMatters: 'Most architecture bottlenecks are really data bottlenecks.',
        decisionPoints: [
            'Does the data need strong consistency, flexible schema, or both?',
            'Which reads are expensive enough to cache?',
            'How long can stale data be tolerated?',
        ],
        tradeoffs: [
            'SQL is often the safer default when relationships and transactions matter.',
            'NoSQL can help when the schema is loose or the access pattern is narrow and known.',
            'Caching improves latency only when invalidation is understood.',
        ],
        antiPatterns: [
            'Using a cache as a second source of truth.',
            'Choosing a database for trendiness instead of access pattern fit.',
            'Adding more indexes or caches without measuring the actual bottleneck.',
        ],
        diagrams: [
            {
                label: 'Data and cache path',
                src: '/diagrams/architecture-data-cache.svg',
                caption: 'Top path is cache hit; bottom path is cache miss to primary store, then cache is refreshed for future requests.',
            },
        ],
    },
    {
        id: 'scaling-and-reliability',
        title: 'Scaling and Reliability',
        summary: 'Make load balancing and failure handling part of the design, not a cleanup task.',
        whyItMatters: 'Scaling is not just about more traffic; it is about keeping the system stable while traffic changes.',
        decisionPoints: [
            'What needs to be replicated horizontally?',
            'Which dependencies need retries, timeouts, or circuit breakers?',
            'Where should failures degrade gracefully instead of propagating?',
        ],
        tradeoffs: [
            'Stateless services are easier to scale and recover.',
            'Async queues reduce request latency but add eventual consistency.',
            'Redundancy improves availability, but every replica adds cost and operational surface area.',
        ],
        antiPatterns: [
            'Letting synchronous dependencies stack until the request path is fragile.',
            'Scaling the app server but ignoring the database.',
            'Returning hard failures for every missing dependency instead of degrading selectively.',
        ],
        diagrams: [
            {
                label: 'Load and failure path',
                src: '/diagrams/architecture-scaling-reliability.svg',
                caption: 'Requests are spread across app instances, slow work is queued asynchronously, and persistence remains protected.',
            },
        ],
    },
    {
        id: 'operations-and-observability',
        title: 'Operations and Observability',
        summary: 'A design is only useful if you can operate and understand it in production.',
        whyItMatters: 'You cannot fix what you cannot observe, and you cannot trust what you cannot explain.',
        decisionPoints: [
            'What metrics show the system is healthy or unhealthy?',
            'What logs or traces will explain a bad request path?',
            'Which alerts actually need human action?',
        ],
        tradeoffs: [
            'Better instrumentation adds cost up front but saves time during incidents.',
            'Too many alerts create noise; too few hide real problems.',
            'Operational simplicity is a design constraint, not a postscript.',
        ],
        antiPatterns: [
            'Shipping a design with no tracing or request correlation.',
            'Alerting on every symptom instead of the root signal.',
            'Assuming a system is resilient because the happy path was tested.',
        ],
        diagrams: [
            {
                label: 'Operations feedback loop',
                src: '/diagrams/architecture-observability-loop.svg',
                caption: 'Clockwise loop: metrics detect issues, logs diagnose causes, traces verify request-level behavior.',
            },
        ],
    },
]
