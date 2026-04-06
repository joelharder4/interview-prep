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
        summary: 'How names become IP addresses, and where caches can shortcut the path.',
        whyItMatters: 'Most latency troubleshooting starts here when first-byte times are slow.',
        keyConcepts: [
            'Recursive resolver vs authoritative nameserver roles',
            'Record types: A, AAAA, CNAME, TXT, NS',
            'TTL-driven cache freshness and invalidation windows',
            'Happy-path query chain: root -> TLD -> authoritative',
        ],
        caveats: [
            'DNS answers can be cached at browser, OS, and resolver layers with different TTL handling.',
            'CNAME chains add extra lookups and may increase time-to-connect.',
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
        whyItMatters: 'Choosing protocol behavior determines latency, packet loss impact, and delivery guarantees.',
        keyConcepts: [
            'TCP provides ordered, reliable byte streams with congestion control',
            'UDP avoids connection setup and retransmission overhead',
            'TCP 3-way handshake: SYN -> SYN-ACK -> ACK',
            'RTT cost before any application payload is sent',
        ],
        caveats: [
            'High latency networks amplify handshake cost before your first request starts.',
            'UDP is not always faster in practice if your app needs reliability at the app layer.',
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
        whyItMatters: 'Clean method semantics reduce bugs, retries, and broken integrations.',
        keyConcepts: [
            'Method semantics: safety and idempotency',
            'Status classes: 2xx success, 3xx redirects, 4xx client errors, 5xx server errors',
            'Headers for auth, negotiation, conditional requests, and caching',
            'Body shape and content types as contract boundaries',
        ],
        caveats: [
            'POST without idempotency safeguards can duplicate writes under retries.',
            'PUT vs PATCH misuse causes accidental data loss in partial updates.',
        ],
        diagrams: [],
    },
    {
        id: 'https',
        title: 'HTTPS and TLS Handshake',
        summary: 'How transport security is negotiated and why certificate validation matters.',
        whyItMatters: 'TLS failures often look like generic networking failures in production.',
        keyConcepts: [
            'ClientHello and ServerHello negotiation',
            'Certificate chain validation and trust anchors',
            'Session keys and encrypted application data channel',
            'Why mixed content breaks secure page guarantees',
        ],
        caveats: [
            'Expired or mismatched certificates fail before HTTP routing logic runs.',
            'Corporate proxies and local tooling can alter trust behavior unexpectedly.',
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
        summary: 'From URL entry to rendered page and secondary asset fan-out.',
        whyItMatters: 'This is the mental model behind performance, debugging, and networking interview questions.',
        keyConcepts: [
            'URL parse -> DNS -> TCP/TLS -> request -> response -> parse -> subresource fetch',
            'Render blocking behavior for CSS and synchronous scripts',
            'Parallel requests after initial HTML parse',
            'Connection reuse and persistent transport sessions',
        ],
        caveats: [
            'Some assets are inlined in HTML and may not trigger separate network requests.',
            'Server and browser caches can skip parts of the lifecycle entirely.',
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
        whyItMatters: 'Most real-world perf wins come from not sending a request at all.',
        keyConcepts: [
            'Cache-Control directives and freshness windows',
            'ETag / If-None-Match and Last-Modified / If-Modified-Since revalidation',
            '304 Not Modified flow and payload avoidance',
            'Layered caches: browser -> edge -> origin',
        ],
        caveats: [
            'Misconfigured cache headers create stale content and hard-to-reproduce bugs.',
            'Different assets need different cache TTL strategies (HTML vs versioned static files).',
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
        description: 'Every major network phase executes from scratch.',
        steps: [
            {
                title: '1. URL Parsing',
                detail: 'Browser extracts scheme, host, path, and default port rules.',
            },
            {
                title: '2. DNS Lookup',
                detail: 'Resolver queries hierarchy to map host to an IP address.',
            },
            {
                title: '3. TCP and TLS Setup',
                detail: 'Connection handshake and TLS negotiation complete before request body exchange.',
            },
            {
                title: '4. Initial HTML Request',
                detail: 'Browser sends GET for document; server returns HTML and headers.',
            },
            {
                title: '5. Parse and Discover Assets',
                detail: 'Browser finds CSS, JS, images, fonts and starts additional requests.',
                caveat: 'Critical CSS and sync scripts can block rendering.',
            },
            {
                title: '6. Render and Execute',
                detail: 'DOM/CSSOM combine into render tree, layout is computed, then paint/composite occurs.',
            },
        ],
    },
    {
        id: 'dns-cached',
        label: 'DNS Cached',
        description: 'Name resolution step is mostly skipped, reducing startup latency.',
        steps: [
            {
                title: '1. URL Parsing',
                detail: 'Browser parses URL and checks host cache first.',
            },
            {
                title: '2. DNS Cache Hit',
                detail: 'Cached IP is reused directly without external resolver chain.',
            },
            {
                title: '3. TCP and TLS Setup',
                detail: 'Connection setup still needed unless an existing keep-alive socket is reusable.',
            },
            {
                title: '4. HTML and Asset Requests',
                detail: 'Document and subresources are fetched as normal.',
            },
        ],
    },
    {
        id: 'http-cached',
        label: 'Fresh HTTP Cache',
        description: 'Document and static resources are reused locally where allowed.',
        steps: [
            {
                title: '1. URL Parsing + Cache Check',
                detail: 'Browser checks resource cache metadata before network.',
            },
            {
                title: '2. Fresh Entries Served Locally',
                detail: 'If max-age still valid, response body is reused with zero network transfer.',
            },
            {
                title: '3. Conditional Revalidation',
                detail: 'Stale resources may send validators and receive 304 Not Modified.',
                caveat: '304 still costs network round-trip, but avoids payload bytes.',
            },
            {
                title: '4. Incremental Render',
                detail: 'Browser can render quickly while only missing resources are fetched.',
            },
        ],
    },
]
