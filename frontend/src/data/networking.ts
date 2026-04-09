export type NetworkingModuleId =
    | 'dns'
    | 'transport'
    | 'http'
    | 'https'
    | 'browser-lifecycle'
    | 'caching'

export type DiagramItem = {
    label: string
    src: string
    caption: string
}

export type HttpMethodSpec = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
    safe: boolean
    idempotent: boolean
    typicalUse: string
    caveat: string
}

export type NetworkingModule = {
    id: NetworkingModuleId
    title: string
    summary: string
    whyItMatters: string
    keyConcepts: string[]
    caveats: string[]
    diagrams: DiagramItem[]
}

export type JourneyStep = {
    title: string
    detail: string
    caveat?: string
}

export type JourneyVariant = {
    id: 'cold-start' | 'dns-cached' | 'http-cached'
    label: string
    description: string
    steps: JourneyStep[]
}

export const httpMethodSpecs: HttpMethodSpec[] = [
    {
        method: 'GET',
        safe: true,
        idempotent: true,
        typicalUse: 'Fetch a resource representation.',
        caveat: 'Should not mutate server state; use query params for filters.',
    },
    {
        method: 'POST',
        safe: false,
        idempotent: false,
        typicalUse: 'Create a resource or trigger a server-side action.',
        caveat: 'Retries can duplicate effects unless backend adds idempotency keys.',
    },
    {
        method: 'PUT',
        safe: false,
        idempotent: true,
        typicalUse: 'Replace a full resource at a stable URL.',
        caveat: 'Often overwrites missing fields; APIs must define replacement semantics clearly.',
    },
    {
        method: 'PATCH',
        safe: false,
        idempotent: false,
        typicalUse: 'Apply partial updates to a resource.',
        caveat: 'Patch format and conflict handling vary (JSON Patch vs merge patch).',
    },
    {
        method: 'DELETE',
        safe: false,
        idempotent: true,
        typicalUse: 'Delete a resource.',
        caveat: 'Repeated calls should remain safe; response may be 404 after first delete.',
    },
    {
        method: 'HEAD',
        safe: true,
        idempotent: true,
        typicalUse: 'Check headers/metadata without downloading body.',
        caveat: 'Great for existence checks and cache validation.',
    },
    {
        method: 'OPTIONS',
        safe: true,
        idempotent: true,
        typicalUse: 'Discover supported methods/cross-origin permissions.',
        caveat: 'Browsers send preflight OPTIONS for many non-simple CORS requests.',
    },
]

export const networkingModules: NetworkingModule[] = [
    {
        id: 'dns',
        title: 'DNS Resolution Fundamentals',
        summary: 'How names become IP addresses and where caches shortcut the path.',
        whyItMatters: 'DNS is often the first place latency or failure shows up.',
        keyConcepts: [
            'Resolver vs authoritative server',
            'A, AAAA, CNAME, TXT, NS records',
            'TTL controls cache freshness',
            'Typical chain: root -> TLD -> authoritative',
        ],
        caveats: [
            'DNS can be cached in the browser, OS, and resolver.',
            'CNAME chains add extra lookups.',
        ],
        diagrams: [
            {
                label: 'DNS query flow',
                src: '/diagrams/dns-resolution-flow.svg',
                caption: 'Where a cold lookup travels and where cache hits short-circuit network hops.',
            },
        ],
    },
    {
        id: 'transport',
        title: 'Transport Layer: TCP vs UDP and Handshake',
        summary: 'Reliability, ordering, and connection setup tradeoffs.',
        whyItMatters: 'Protocol choice affects latency and delivery guarantees.',
        keyConcepts: [
            'TCP = ordered, reliable stream',
            'UDP = no connection setup, no delivery guarantee',
            '3-way handshake: SYN -> SYN-ACK -> ACK',
            'Handshake adds RTT before payload',
        ],
        caveats: [
            'High latency makes handshake cost obvious.',
            'UDP is not automatically faster for reliable apps.',
        ],
        diagrams: [
            {
                label: 'TCP 3-way handshake',
                src: '/diagrams/tcp-3way-handshake.svg',
                caption: 'Connection establishment sequence and state transition to established.',
            },
        ],
    },
    {
        id: 'http',
        title: 'HTTP Methods, Status, and Request Design',
        summary: 'How APIs express intent through verbs, headers, and response codes.',
        whyItMatters: 'Clear semantics prevent retries, bugs, and bad API design.',
        keyConcepts: [
            'Method semantics: safety and idempotency',
            'Status classes: 2xx success, 3xx redirects, 4xx client errors, 5xx server errors',
            'Headers for auth, negotiation, conditional requests, and caching',
            'Body shape and content types as contract boundaries',
        ],
        caveats: [
            'POST retries can duplicate writes.',
            'PUT vs PATCH confusion can lose data.',
        ],
        diagrams: [],
    },
    {
        id: 'https',
        title: 'HTTPS and TLS Handshake',
        summary: 'How transport security is negotiated and why certificate checks matter.',
        whyItMatters: 'TLS failures often look like generic networking problems.',
        keyConcepts: [
            'ClientHello and ServerHello negotiation',
            'Certificate chain validation and trust anchors',
            'Session keys and encrypted application data channel',
            'Why mixed content breaks secure page guarantees',
        ],
        caveats: [
            'Bad certificates fail before HTTP routing starts.',
            'Proxies and local tooling can change trust behavior.',
        ],
        diagrams: [
            {
                label: 'TLS handshake phases',
                src: '/diagrams/tls-handshake.svg',
                caption: 'Negotiation flow before encrypted HTTP payload exchange begins.',
            },
        ],
    },
    {
        id: 'browser-lifecycle',
        title: 'Browser Request Lifecycle End-to-End',
        summary: 'From URL entry to rendered page and secondary asset loading.',
        whyItMatters: 'This is the mental model behind most web performance and debugging questions.',
        keyConcepts: [
            'URL parse -> DNS -> TCP/TLS -> request -> response -> parse -> subresource fetch',
            'Render blocking behavior for CSS and synchronous scripts',
            'Parallel requests after initial HTML parse',
            'Connection reuse and persistent transport sessions',
        ],
        caveats: [
            'Inline assets may skip separate requests.',
            'Caches can skip major parts of the flow.',
        ],
        diagrams: [
            {
                label: 'Open URL lifecycle',
                src: '/diagrams/browser-request-lifecycle.svg',
                caption: 'Core request path plus branch points for caching and secondary fetches.',
            },
        ],
    },
    {
        id: 'caching',
        title: 'Caching Layers and Conditional Fetches',
        summary: 'How browser, CDN, and origin caches affect correctness and speed.',
        whyItMatters: 'The biggest perf win is often skipping the request.',
        keyConcepts: [
            'Cache-Control directives and freshness windows',
            'ETag / If-None-Match and Last-Modified / If-Modified-Since revalidation',
            '304 Not Modified flow and payload avoidance',
            'Layered caches: browser -> edge -> origin',
        ],
        caveats: [
            'Bad cache headers create stale bugs.',
            'HTML and versioned assets need different TTLs.',
        ],
        diagrams: [
            {
                label: 'Cache layer hierarchy',
                src: '/diagrams/cache-layers.svg',
                caption: 'Fast-path to slow-path request progression across cache tiers.',
            },
        ],
    },
]

export const browserJourneyVariants: JourneyVariant[] = [
    {
        id: 'cold-start',
        label: 'Cold Start (No Useful Cache)',
        description: 'Every major network phase runs from scratch.',
        steps: [
            {
                title: '1. URL Parsing',
                detail: 'Browser parses scheme, host, path, and port.',
            },
            {
                title: '2. DNS Lookup',
                detail: 'Resolver maps the host to an IP address.',
            },
            {
                title: '3. TCP and TLS Setup',
                detail: 'TCP and TLS complete before the request is sent.',
            },
            {
                title: '4. Initial HTML Request',
                detail: 'Browser sends a GET; server returns HTML and headers.',
            },
            {
                title: '5. Parse and Discover Assets',
                detail: 'Browser discovers CSS, JS, images, and fonts.',
                caveat: 'Critical CSS and sync scripts can block rendering.',
            },
            {
                title: '6. Render and Execute',
                detail: 'DOM/CSSOM become the render tree, then layout, paint, and composite run.',
            },
        ],
    },
    {
        id: 'dns-cached',
        label: 'DNS Cached',
        description: 'Name resolution is skipped or shortened.',
        steps: [
            {
                title: '1. URL Parsing',
                detail: 'Browser parses the URL and checks cache first.',
            },
            {
                title: '2. DNS Cache Hit',
                detail: 'Cached IP is reused directly.',
            },
            {
                title: '3. TCP and TLS Setup',
                detail: 'TCP/TLS still happen unless a warm socket already exists.',
            },
            {
                title: '4. HTML and Asset Requests',
                detail: 'Document and subresources load normally.',
            },
        ],
    },
    {
        id: 'http-cached',
        label: 'Fresh HTTP Cache',
        description: 'Cached responses may avoid the network entirely.',
        steps: [
            {
                title: '1. URL Parsing + Cache Check',
                detail: 'Browser checks cache metadata before networking.',
            },
            {
                title: '2. Fresh Entries Served Locally',
                detail: 'If fresh, the body is reused locally.',
            },
            {
                title: '3. Conditional Revalidation',
                detail: 'Stale resources may revalidate and get 304 Not Modified.',
                caveat: '304 still costs a round-trip, but no payload.',
            },
            {
                title: '4. Incremental Render',
                detail: 'Browser renders while only missing resources load.',
            },
        ],
    },
]
