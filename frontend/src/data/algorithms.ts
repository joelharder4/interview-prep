export type AlgorithmCategory =
    | 'Graph'
    | 'Tree'
    | 'Array & Sorting'
    | 'Dynamic Programming'
    | 'Geometry'

export type Complexity = {
    time: string
    space: string
}

type ArrayFrame = {
    kind: 'array'
    note: string
    values: number[]
    activeIndices?: number[]
    removedIndices?: number[]
    doneIndices?: number[]
    windowLabel?: string
    arrayGroups?: Array<{
        label: string
        start: number
        end: number
        tone?: 'cool' | 'warm' | 'neutral'
    }>
}

type GraphFrame = {
    kind: 'graph'
    note: string
    nodes: string[]
    edges: Array<[string, string]>
    weightedEdges?: Array<[string, string, number]>
    visited: string[]
    frontier: string[]
    current?: string
    startNode?: string
    goalNode?: string
    routeHint?: string
}

type TreeFrame = {
    kind: 'tree'
    note: string
    levels: string[][]
    traversal: string[]
    current?: string
}

type PointsFrame = {
    kind: 'points'
    note: string
    points: Array<{ label: string; x: number; y: number }>
    hull: string[]
    current?: string
}

export type AlgorithmFrame = ArrayFrame | GraphFrame | TreeFrame | PointsFrame

export type AlgorithmCard = {
    slug: string
    title: string
    category: AlgorithmCategory
    summary: string
    bestFor: string
    complexity: Complexity
    code: string
    frames: AlgorithmFrame[]
}

const graphNodes = ['A', 'B', 'C', 'D', 'E', 'F']
const graphEdges: Array<[string, string]> = [
    ['A', 'B'],
    ['A', 'C'],
    ['B', 'D'],
    ['C', 'E'],
    ['D', 'F'],
]

const dijkstraNodes = ['A', 'B', 'C', 'D', 'E', 'F']
const dijkstraEdges: Array<[string, string]> = [
    ['A', 'B'],
    ['A', 'C'],
    ['B', 'C'],
    ['B', 'D'],
    ['C', 'D'],
    ['C', 'E'],
    ['D', 'E'],
    ['D', 'F'],
    ['E', 'F'],
    ['B', 'F'],
]

const dijkstraWeightedEdges: Array<[string, string, number]> = [
    ['A', 'B', 2],
    ['A', 'C', 5],
    ['B', 'C', 1],
    ['B', 'D', 4],
    ['C', 'D', 1],
    ['C', 'E', 7],
    ['D', 'E', 1],
    ['D', 'F', 6],
    ['E', 'F', 1],
    ['B', 'F', 12],
]

const treeLevels = [['8'], ['4', '12'], ['2', '6', '10', '14']]

const hullPoints = [
    { label: 'A', x: 34, y: 88 },
    { label: 'B', x: 56, y: 42 },
    { label: 'C', x: 104, y: 28 },
    { label: 'D', x: 148, y: 36 },
    { label: 'E', x: 210, y: 78 },
    { label: 'F', x: 180, y: 102 },
    { label: 'G', x: 88, y: 104 },
    { label: 'H', x: 128, y: 68 },
]

export const algorithms: AlgorithmCard[] = [
    {
        slug: 'bfs',
        title: 'Breadth-First Search (BFS)',
        category: 'Graph',
        summary: 'Level-order graph traversal using a queue.',
        bestFor: 'Best unweighted shortest-path traversal from a source node.',
        complexity: {
            time: 'O(V + E)',
            space: 'O(V)',
        },
        code: `from collections import deque

def bfs(graph, start):
    queue = deque([start])
    seen = {start}
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                queue.append(nxt)

    return order`,
        frames: [
            { kind: 'graph', note: 'Start at A. Queue seeded with source.', nodes: graphNodes, edges: graphEdges, visited: ['A'], frontier: ['A'], current: 'A' },
            { kind: 'graph', note: 'Visit A, enqueue B and C.', nodes: graphNodes, edges: graphEdges, visited: ['A', 'B', 'C'], frontier: ['B', 'C'], current: 'A' },
            { kind: 'graph', note: 'Visit B, enqueue D.', nodes: graphNodes, edges: graphEdges, visited: ['A', 'B', 'C', 'D'], frontier: ['C', 'D'], current: 'B' },
            { kind: 'graph', note: 'Visit C, enqueue E.', nodes: graphNodes, edges: graphEdges, visited: ['A', 'B', 'C', 'D', 'E'], frontier: ['D', 'E'], current: 'C' },
            { kind: 'graph', note: 'Visit D, enqueue F.', nodes: graphNodes, edges: graphEdges, visited: ['A', 'B', 'C', 'D', 'E', 'F'], frontier: ['E', 'F'], current: 'D' },
            { kind: 'graph', note: 'Visit E, then dequeue F as the final node.', nodes: graphNodes, edges: graphEdges, visited: ['A', 'B', 'C', 'D', 'E', 'F'], frontier: [], current: 'F' },
            { kind: 'graph', note: 'Traversal complete in shortest-hop order.', nodes: graphNodes, edges: graphEdges, visited: ['A', 'B', 'C', 'D', 'E', 'F'], frontier: [] },
        ],
    },
    {
        slug: 'dfs',
        title: 'Depth-First Search (DFS)',
        category: 'Graph',
        summary: 'Deep traversal using recursion or an explicit stack.',
        bestFor: 'Best when you need path existence checks, cycle detection, or topological-style exploration.',
        complexity: {
            time: 'O(V + E)',
            space: 'O(V)',
        },
        code: `def dfs(graph, start):
    order = []
    seen = set()

    def visit(node):
        seen.add(node)
        order.append(node)
        for nxt in graph[node]:
            if nxt not in seen:
                visit(nxt)

    visit(start)
    return order`,
        frames: [
            { kind: 'graph', note: 'Start at A.', nodes: graphNodes, edges: graphEdges, visited: ['A'], frontier: ['A'], current: 'A' },
            { kind: 'graph', note: 'Go deep A -> B -> D.', nodes: graphNodes, edges: graphEdges, visited: ['A', 'B', 'D'], frontier: ['A', 'B', 'D'], current: 'D' },
            { kind: 'graph', note: 'Continue D -> F.', nodes: graphNodes, edges: graphEdges, visited: ['A', 'B', 'D', 'F'], frontier: ['A', 'B', 'D', 'F'], current: 'F' },
            { kind: 'graph', note: 'Backtrack and explore remaining branch through C.', nodes: graphNodes, edges: graphEdges, visited: ['A', 'B', 'D', 'F', 'C'], frontier: ['A', 'C'], current: 'C' },
            { kind: 'graph', note: 'Visit E from C branch.', nodes: graphNodes, edges: graphEdges, visited: ['A', 'B', 'D', 'F', 'C', 'E'], frontier: ['A', 'C', 'E'], current: 'E' },
            { kind: 'graph', note: 'Backtrack to root after exhausting neighbors.', nodes: graphNodes, edges: graphEdges, visited: ['A', 'B', 'D', 'F', 'C', 'E'], frontier: [], current: 'A' },
            { kind: 'graph', note: 'Depth-first walk complete.', nodes: graphNodes, edges: graphEdges, visited: ['A', 'B', 'D', 'F', 'C', 'E'], frontier: [] },
        ],
    },
    {
        slug: 'dijkstra-shortest-path',
        title: "Dijkstra's Shortest Path",
        category: 'Graph',
        summary: 'Greedy shortest-path algorithm for non-negative weighted graphs.',
        bestFor: 'Best source-to-goal shortest path when all edge weights are non-negative.',
        complexity: {
            time: 'O((V + E) log V) with priority queue',
            space: 'O(V)',
        },
        code: `import heapq

def dijkstra(graph, start, goal):
    dist = {node: float('inf') for node in graph}
    prev = {node: None for node in graph}
    dist[start] = 0
    pq = [(0, start)]

    while pq:
        cur_dist, node = heapq.heappop(pq)
        if cur_dist > dist[node]:
            continue
        if node == goal:
            break

        for nxt, weight in graph[node]:
            cand = cur_dist + weight
            if cand < dist[nxt]:
                dist[nxt] = cand
                prev[nxt] = node
                heapq.heappush(pq, (cand, nxt))

    if dist[goal] == float('inf'):
        return float('inf'), []

    path = []
    node = goal
    while node is not None:
        path.append(node)
        node = prev[node]
    path.reverse()
    return dist[goal], path`,
        frames: [
            {
                kind: 'graph',
                note: 'Start at A and target F. Initialize distances with dist(A)=0.',
                nodes: dijkstraNodes,
                edges: dijkstraEdges,
                weightedEdges: dijkstraWeightedEdges,
                visited: ['A'],
                frontier: ['A'],
                current: 'A',
                startNode: 'A',
                goalNode: 'F',
                routeHint: 'goal: F, best-known cost = inf',
            },
            {
                kind: 'graph',
                note: 'Relax from A -> B (2), C (5).',
                nodes: dijkstraNodes,
                edges: dijkstraEdges,
                weightedEdges: dijkstraWeightedEdges,
                visited: ['A', 'B', 'C'],
                frontier: ['B', 'C'],
                current: 'A',
                startNode: 'A',
                goalNode: 'F',
                routeHint: 'candidate: A -> B (2), A -> C (5)',
            },
            {
                kind: 'graph',
                note: 'Pop B (2), improve C to 3 and set D to 6; direct B->F is 14.',
                nodes: dijkstraNodes,
                edges: dijkstraEdges,
                weightedEdges: dijkstraWeightedEdges,
                visited: ['A', 'B', 'C', 'D', 'F'],
                frontier: ['C', 'D', 'F'],
                current: 'B',
                startNode: 'A',
                goalNode: 'F',
                routeHint: 'best-known to F: 14 via A -> B -> F',
            },
            {
                kind: 'graph',
                note: 'Pop C (3), improve D to 4 and set E to 10.',
                nodes: dijkstraNodes,
                edges: dijkstraEdges,
                weightedEdges: dijkstraWeightedEdges,
                visited: ['A', 'B', 'C', 'D', 'E', 'F'],
                frontier: ['D', 'E', 'F'],
                current: 'C',
                startNode: 'A',
                goalNode: 'F',
                routeHint: 'candidate path: A -> B -> C -> D (4)',
            },
            {
                kind: 'graph',
                note: 'Pop D (4), improve E to 5 and F to 10 through D.',
                nodes: dijkstraNodes,
                edges: dijkstraEdges,
                weightedEdges: dijkstraWeightedEdges,
                visited: ['A', 'B', 'C', 'D', 'E', 'F'],
                frontier: ['E', 'F'],
                current: 'D',
                startNode: 'A',
                goalNode: 'F',
                routeHint: 'best-known to F: 10 via A -> B -> C -> D -> F',
            },
            {
                kind: 'graph',
                note: 'Pop E (5), improve F to 6 through E.',
                nodes: dijkstraNodes,
                edges: dijkstraEdges,
                weightedEdges: dijkstraWeightedEdges,
                visited: ['A', 'B', 'C', 'D', 'E', 'F'],
                frontier: ['F'],
                current: 'E',
                startNode: 'A',
                goalNode: 'F',
                routeHint: 'best-known to F: 6 via A -> B -> C -> D -> E -> F',
            },
            {
                kind: 'graph',
                note: 'Pop goal F (6). This is optimal due Dijkstra ordering.',
                nodes: dijkstraNodes,
                edges: dijkstraEdges,
                weightedEdges: dijkstraWeightedEdges,
                visited: ['A', 'B', 'C', 'D', 'E', 'F'],
                frontier: [],
                current: 'F',
                startNode: 'A',
                goalNode: 'F',
                routeHint: 'shortest path = A -> B -> C -> D -> E -> F (cost 6)',
            },
            {
                kind: 'graph',
                note: 'Shortest path solved for start A and goal F.',
                nodes: dijkstraNodes,
                edges: dijkstraEdges,
                weightedEdges: dijkstraWeightedEdges,
                visited: ['A', 'B', 'C', 'D', 'E', 'F'],
                frontier: [],
                startNode: 'A',
                goalNode: 'F',
                routeHint: 'final: A -> B -> C -> D -> E -> F (6) beats alternatives',
            },
        ],
    },
    {
        slug: 'inorder-traversal',
        title: 'In-Order Traversal',
        category: 'Tree',
        summary: 'Left -> Root -> Right traversal pattern.',
        bestFor: 'Best for BSTs when you want values in sorted order.',
        complexity: {
            time: 'O(n)',
            space: 'O(h)',
        },
        code: `def inorder(node, out):
    if not node:
        return
    inorder(node.left, out)
    out.append(node.value)
    inorder(node.right, out)`,
        frames: [
            { kind: 'tree', note: 'Start at root 8 and recurse left.', levels: treeLevels, traversal: [], current: '8' },
            { kind: 'tree', note: 'Move to node 4.', levels: treeLevels, traversal: [], current: '4' },
            { kind: 'tree', note: 'Move to leftmost node 2.', levels: treeLevels, traversal: [], current: '2' },
            { kind: 'tree', note: 'Visit 2 first.', levels: treeLevels, traversal: ['2'], current: '2' },
            { kind: 'tree', note: 'Backtrack and visit 4.', levels: treeLevels, traversal: ['2', '4'], current: '4' },
            { kind: 'tree', note: 'Traverse to right child 6.', levels: treeLevels, traversal: ['2', '4'], current: '6' },
            { kind: 'tree', note: 'Visit 6.', levels: treeLevels, traversal: ['2', '4', '6'], current: '6' },
            { kind: 'tree', note: 'Return and visit root 8.', levels: treeLevels, traversal: ['2', '4', '6', '8'], current: '8' },
            { kind: 'tree', note: 'Traverse into right subtree at 12, then left child 10.', levels: treeLevels, traversal: ['2', '4', '6', '8'], current: '10' },
            { kind: 'tree', note: 'Visit 10.', levels: treeLevels, traversal: ['2', '4', '6', '8', '10'], current: '10' },
            { kind: 'tree', note: 'Backtrack and visit 12.', levels: treeLevels, traversal: ['2', '4', '6', '8', '10', '12'], current: '12' },
            { kind: 'tree', note: 'Traverse right child 14 and visit.', levels: treeLevels, traversal: ['2', '4', '6', '8', '10', '12', '14'], current: '14' },
            { kind: 'tree', note: 'In-order traversal complete.', levels: treeLevels, traversal: ['2', '4', '6', '8', '10', '12', '14'] },
        ],
    },
    {
        slug: 'preorder-traversal',
        title: 'Pre-Order Traversal',
        category: 'Tree',
        summary: 'Root -> Left -> Right traversal pattern.',
        bestFor: 'Best for serialization and cloning where parent must be processed before children.',
        complexity: {
            time: 'O(n)',
            space: 'O(h)',
        },
        code: `def preorder(node, out):
    if not node:
        return
    out.append(node.value)
    preorder(node.left, out)
    preorder(node.right, out)`,
        frames: [
            { kind: 'tree', note: 'Visit root 8 immediately.', levels: treeLevels, traversal: ['8'], current: '8' },
            { kind: 'tree', note: 'Move left and visit 4.', levels: treeLevels, traversal: ['8', '4'], current: '4' },
            { kind: 'tree', note: 'Visit 2.', levels: treeLevels, traversal: ['8', '4', '2'], current: '2' },
            { kind: 'tree', note: 'Backtrack to 4, then visit right child 6.', levels: treeLevels, traversal: ['8', '4', '2', '6'], current: '6' },
            { kind: 'tree', note: 'Traverse to right subtree and visit 12.', levels: treeLevels, traversal: ['8', '4', '2', '6', '12'], current: '12' },
            { kind: 'tree', note: 'Visit left child 10.', levels: treeLevels, traversal: ['8', '4', '2', '6', '12', '10'], current: '10' },
            { kind: 'tree', note: 'Visit right child 14.', levels: treeLevels, traversal: ['8', '4', '2', '6', '12', '10', '14'], current: '14' },
            { kind: 'tree', note: 'Pre-order traversal complete.', levels: treeLevels, traversal: ['8', '4', '2', '6', '12', '10', '14'] },
        ],
    },
    {
        slug: 'postorder-traversal',
        title: 'Post-Order Traversal',
        category: 'Tree',
        summary: 'Left -> Right -> Root traversal pattern.',
        bestFor: 'Best for safe tree deletion and bottom-up computations.',
        complexity: {
            time: 'O(n)',
            space: 'O(h)',
        },
        code: `def postorder(node, out):
    if not node:
        return
    postorder(node.left, out)
    postorder(node.right, out)
    out.append(node.value)`,
        frames: [
            { kind: 'tree', note: 'Start at root 8.', levels: treeLevels, traversal: [], current: '8' },
            { kind: 'tree', note: 'Recurse down left branch toward 2.', levels: treeLevels, traversal: [], current: '2' },
            { kind: 'tree', note: 'Visit 2 after both children are exhausted.', levels: treeLevels, traversal: ['2'], current: '2' },
            { kind: 'tree', note: 'Move to sibling leaf 6.', levels: treeLevels, traversal: ['2'], current: '6' },
            { kind: 'tree', note: 'Visit 6.', levels: treeLevels, traversal: ['2', '6'], current: '6' },
            { kind: 'tree', note: 'Now visit parent 4.', levels: treeLevels, traversal: ['2', '6', '4'], current: '4' },
            { kind: 'tree', note: 'Traverse right subtree leaf 10 first.', levels: treeLevels, traversal: ['2', '6', '4'], current: '10' },
            { kind: 'tree', note: 'Visit 10.', levels: treeLevels, traversal: ['2', '6', '4', '10'], current: '10' },
            { kind: 'tree', note: 'Then traverse and visit leaf 14.', levels: treeLevels, traversal: ['2', '6', '4', '10', '14'], current: '14' },
            { kind: 'tree', note: 'Visit parent 12.', levels: treeLevels, traversal: ['2', '6', '4', '10', '14', '12'], current: '12' },
            { kind: 'tree', note: 'Finally visit root 8.', levels: treeLevels, traversal: ['2', '6', '4', '10', '14', '12', '8'], current: '8' },
            { kind: 'tree', note: 'Post-order traversal complete.', levels: treeLevels, traversal: ['2', '6', '4', '10', '14', '12', '8'] },
        ],
    },
    {
        slug: 'binary-search',
        title: 'Binary Search',
        category: 'Array & Sorting',
        summary: 'Searches sorted arrays by repeatedly halving the range.',
        bestFor: 'Best exact-match search on sorted random-access data.',
        complexity: {
            time: 'O(log n)',
            space: 'O(1)',
        },
        code: `def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
        frames: [
            { kind: 'array', note: 'Target = 23, full range considered.', values: [3, 7, 11, 16, 23, 31, 44], activeIndices: [0, 1, 2, 3, 4, 5, 6], windowLabel: 'lo=0 hi=6 mid=3' },
            { kind: 'array', note: '16 < 23, discard left half.', values: [3, 7, 11, 16, 23, 31, 44], activeIndices: [4, 5, 6], removedIndices: [0, 1, 2, 3], windowLabel: 'lo=4 hi=6 mid=5' },
            { kind: 'array', note: '31 > 23, move hi left.', values: [3, 7, 11, 16, 23, 31, 44], activeIndices: [4], removedIndices: [0, 1, 2, 3, 5, 6], windowLabel: 'lo=4 hi=4 mid=4' },
            { kind: 'array', note: 'Found target at index 4.', values: [3, 7, 11, 16, 23, 31, 44], activeIndices: [4], removedIndices: [0, 1, 2, 3, 5, 6], doneIndices: [4], windowLabel: 'return 4' },
        ],
    },
    {
        slug: 'quicksort',
        title: 'Quick Sort',
        category: 'Array & Sorting',
        summary: 'Partition-based divide-and-conquer sort.',
        bestFor: 'Best in practice for in-memory arrays when average speed and cache locality matter.',
        complexity: {
            time: 'Average O(n log n), worst O(n^2)',
            space: 'O(log n) recursive stack',
        },
        code: `def quicksort(nums, lo, hi):
    if lo >= hi:
        return
    p = partition(nums, lo, hi)
    quicksort(nums, lo, p - 1)
    quicksort(nums, p + 1, hi)

def partition(nums, lo, hi):
    pivot = nums[hi]
    i = lo
    for j in range(lo, hi):
        if nums[j] <= pivot:
            nums[i], nums[j] = nums[j], nums[i]
            i += 1
    nums[i], nums[hi] = nums[hi], nums[i]
    return i`,
        frames: [
            { kind: 'array', note: 'Choose pivot 6 and scan from left.', values: [9, 2, 7, 1, 6], activeIndices: [0, 1, 2, 3, 4], windowLabel: 'partition [0..4], pivot=6' },
            { kind: 'array', note: '2 is <= pivot, swap into low partition.', values: [2, 9, 7, 1, 6], activeIndices: [1], windowLabel: 'i=1 j=1' },
            { kind: 'array', note: '1 is <= pivot, move it left.', values: [2, 1, 7, 9, 6], activeIndices: [3], windowLabel: 'i=2 j=3' },
            { kind: 'array', note: 'Place pivot at split point (index 2).', values: [2, 1, 6, 9, 7], activeIndices: [2], doneIndices: [2], windowLabel: 'pivot fixed at 2' },
            { kind: 'array', note: 'Recurse left partition [2,1], pivot 1 settles.', values: [1, 2, 6, 9, 7], activeIndices: [0, 1], doneIndices: [0, 1, 2], windowLabel: 'left side sorted' },
            { kind: 'array', note: 'Recurse right partition [9,7], pivot 7 settles.', values: [1, 2, 6, 7, 9], activeIndices: [3, 4], doneIndices: [0, 1, 2, 3, 4], windowLabel: 'right side sorted' },
            { kind: 'array', note: 'All partitions resolved.', values: [1, 2, 6, 7, 9], doneIndices: [0, 1, 2, 3, 4], windowLabel: 'complete' },
        ],
    },
    {
        slug: 'merge-sort',
        title: 'Merge Sort',
        category: 'Array & Sorting',
        summary: 'Stable divide-and-conquer sort with guaranteed n log n.',
        bestFor: 'Best stable O(n log n) choice, especially for linked lists or external sorting.',
        complexity: {
            time: 'O(n log n)',
            space: 'O(n)',
        },
        code: `def merge_sort(nums):
    if len(nums) <= 1:
        return nums

    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])

    out = []
    i = 0
    j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i])
            i += 1
        else:
            out.append(right[j])
            j += 1

    out.extend(left[i:])
    out.extend(right[j:])
    return out`,
        frames: [
            { kind: 'array', note: 'Start with full array, split at midpoint.', values: [8, 3, 5, 4, 7, 6, 1, 2], activeIndices: [0, 1, 2, 3, 4, 5, 6, 7], windowLabel: 'split [0..7] -> [0..3] [4..7]', arrayGroups: [{ label: 'L', start: 0, end: 3, tone: 'cool' }, { label: 'R', start: 4, end: 7, tone: 'warm' }] },
            { kind: 'array', note: 'Split again until single elements.', values: [8, 3, 5, 4, 7, 6, 1, 2], activeIndices: [0, 1, 2, 3], windowLabel: 'left half split to singles', arrayGroups: [{ label: 'L1', start: 0, end: 1, tone: 'cool' }, { label: 'L2', start: 2, end: 3, tone: 'cool' }] },
            { kind: 'array', note: 'Merge [8] and [3] -> [3,8].', values: [3, 8, 5, 4, 7, 6, 1, 2], activeIndices: [0, 1], windowLabel: 'merge left pair #1', arrayGroups: [{ label: 'merge', start: 0, end: 1, tone: 'neutral' }] },
            { kind: 'array', note: 'Merge [5] and [4] -> [4,5].', values: [3, 8, 4, 5, 7, 6, 1, 2], activeIndices: [2, 3], windowLabel: 'merge left pair #2', arrayGroups: [{ label: 'merge', start: 2, end: 3, tone: 'neutral' }] },
            { kind: 'array', note: 'Merge right pairs [7,6] and [1,2].', values: [3, 8, 4, 5, 6, 7, 1, 2], activeIndices: [4, 5, 6, 7], windowLabel: 'right local merges', arrayGroups: [{ label: 'R1', start: 4, end: 5, tone: 'warm' }, { label: 'R2', start: 6, end: 7, tone: 'warm' }] },
            { kind: 'array', note: 'Left half fully merged -> [3,4,5,8].', values: [3, 4, 5, 8, 6, 7, 1, 2], activeIndices: [0, 1, 2, 3], windowLabel: 'left half sorted', arrayGroups: [{ label: 'sorted L', start: 0, end: 3, tone: 'cool' }] },
            { kind: 'array', note: 'Right half fully merged -> [1,2,6,7].', values: [3, 4, 5, 8, 1, 2, 6, 7], activeIndices: [4, 5, 6, 7], windowLabel: 'right half sorted', arrayGroups: [{ label: 'sorted R', start: 4, end: 7, tone: 'warm' }] },
            { kind: 'array', note: 'Final stable merge of both halves.', values: [1, 2, 3, 4, 5, 6, 7, 8], doneIndices: [0, 1, 2, 3, 4, 5, 6, 7], windowLabel: 'complete', arrayGroups: [{ label: 'final', start: 0, end: 7, tone: 'neutral' }] },
        ],
    },
    {
        slug: 'heap-sort',
        title: 'Heap Sort',
        category: 'Array & Sorting',
        summary: 'In-place sort using a binary heap.',
        bestFor: 'Best when you need O(1) extra memory with guaranteed O(n log n) time.',
        complexity: {
            time: 'O(n log n)',
            space: 'O(1)',
        },
        code: `def heap_sort(nums):
    n = len(nums)

    for i in range(n // 2 - 1, -1, -1):
        sift_down(nums, n, i)

    for end in range(n - 1, 0, -1):
        nums[0], nums[end] = nums[end], nums[0]
        sift_down(nums, end, 0)

def sift_down(nums, size, i):
    while True:
        left = 2 * i + 1
        right = 2 * i + 2
        largest = i

        if left < size and nums[left] > nums[largest]:
            largest = left
        if right < size and nums[right] > nums[largest]:
            largest = right
        if largest == i:
            return

        nums[i], nums[largest] = nums[largest], nums[i]
        i = largest`,
        frames: [
            { kind: 'array', note: 'Initial array before heapify.', values: [4, 10, 3, 5, 1], activeIndices: [0, 1, 2, 3, 4], windowLabel: 'build max-heap' },
            { kind: 'array', note: 'Heapify at index 1 (10 already dominates children).', values: [4, 10, 3, 5, 1], activeIndices: [1, 3, 4], windowLabel: 'sift-down i=1' },
            { kind: 'array', note: 'Heapify root: swap 4 and 10.', values: [10, 4, 3, 5, 1], activeIndices: [0, 1], windowLabel: 'sift-down i=0' },
            { kind: 'array', note: 'Continue sift-down: swap 4 and 5.', values: [10, 5, 3, 4, 1], activeIndices: [1, 3], windowLabel: 'max-heap built' },
            { kind: 'array', note: 'Extract max: swap root with end index 4.', values: [1, 5, 3, 4, 10], activeIndices: [0, 4], doneIndices: [4], windowLabel: 'extract #1' },
            { kind: 'array', note: 'Restore heap: swap 1 and 5.', values: [5, 1, 3, 4, 10], activeIndices: [0, 1], doneIndices: [4], windowLabel: 'sift-down size=4' },
            { kind: 'array', note: 'Continue sift-down: swap 1 and 4.', values: [5, 4, 3, 1, 10], activeIndices: [1, 3], doneIndices: [4], windowLabel: 'heap restored' },
            { kind: 'array', note: 'Extract max again to index 3.', values: [1, 4, 3, 5, 10], activeIndices: [0, 3], doneIndices: [3, 4], windowLabel: 'extract #2' },
            { kind: 'array', note: 'Restore heap of size 3 (swap 1 and 4).', values: [4, 1, 3, 5, 10], activeIndices: [0, 1], doneIndices: [3, 4], windowLabel: 'sift-down size=3' },
            { kind: 'array', note: 'Extract max to index 2.', values: [3, 1, 4, 5, 10], activeIndices: [0, 2], doneIndices: [2, 3, 4], windowLabel: 'extract #3' },
            { kind: 'array', note: 'Extract last heap element to index 1.', values: [1, 3, 4, 5, 10], doneIndices: [0, 1, 2, 3, 4], windowLabel: 'extract #4 / complete' },
        ],
    },
    {
        slug: 'kadane',
        title: "Kadane's Algorithm",
        category: 'Dynamic Programming',
        summary: 'Linear-time maximum subarray algorithm.',
        bestFor: 'Best for max contiguous subarray sum; brute force O(n^2) is never competitive here.',
        complexity: {
            time: 'O(n)',
            space: 'O(1)',
        },
        code: `def kadane(nums):
    best = nums[0]
    current = nums[0]

    for value in nums[1:]:
        current = max(value, current + value)
        best = max(best, current)

    return best`,
        frames: [
            { kind: 'array', note: 'Start with first element.', values: [4, -1, 2, 1, -5, 4], activeIndices: [0], windowLabel: 'current=4 best=4' },
            { kind: 'array', note: 'Extend while sum improves.', values: [4, -1, 2, 1, -5, 4], activeIndices: [1, 2, 3], doneIndices: [0], windowLabel: 'current=6 best=6' },
            { kind: 'array', note: 'Drop when sequence hurts too much.', values: [4, -1, 2, 1, -5, 4], activeIndices: [4], doneIndices: [0, 1, 2, 3], windowLabel: 'current=1 best=6' },
            { kind: 'array', note: 'Final answer remains 6 (4,-1,2,1).', values: [4, -1, 2, 1, -5, 4], doneIndices: [0, 1, 2, 3, 4, 5], windowLabel: 'max sum = 6' },
        ],
    },
    {
        slug: 'knapsack-01',
        title: '0/1 Knapsack DP',
        category: 'Dynamic Programming',
        summary: 'Builds optimal value by capacity and item index.',
        bestFor: 'Best exact optimizer when each item is either fully picked or skipped.',
        complexity: {
            time: 'O(n * capacity)',
            space: 'O(capacity)',
        },
        code: `def knapsack(values, weights, capacity):
    dp = [0] * (capacity + 1)

    for i in range(len(values)):
        v = values[i]
        w = weights[i]
        for c in range(capacity, w - 1, -1):
            dp[c] = max(dp[c], dp[c - w] + v)

    return dp[capacity]`,
        frames: [
            { kind: 'array', note: 'Capacity states start at zero.', values: [0, 0, 0, 0, 0, 0], activeIndices: [0, 1, 2, 3, 4, 5], windowLabel: 'dp[0..5]' },
            { kind: 'array', note: 'After item (v=6, w=2).', values: [0, 0, 6, 6, 6, 6], activeIndices: [2, 3, 4, 5], windowLabel: 'item #1' },
            { kind: 'array', note: 'After item (v=10, w=3).', values: [0, 0, 6, 10, 10, 16], activeIndices: [3, 4, 5], windowLabel: 'item #2' },
            { kind: 'array', note: 'After item (v=12, w=4): best at cap=5 is 16.', values: [0, 0, 6, 10, 12, 16], activeIndices: [4, 5], windowLabel: 'item #3' },
        ],
    },
    {
        slug: 'quickhull',
        title: 'Quickhull',
        category: 'Geometry',
        summary: 'Divide-and-conquer convex hull construction using farthest-point partitioning.',
        bestFor: 'Best when average-case hull construction is needed with quick partition-style intuition.',
        complexity: {
            time: 'Average O(n log n), worst O(n^2)',
            space: 'O(n)',
        },
        code: `def side(a, b, p):
    return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])

def distance(a, b, p):
    return abs(side(a, b, p))

def build_hull(points, a, b, hull):
    far = None
    max_dist = 0

    for p in points:
        d = distance(a, b, p)
        if side(a, b, p) > 0 and d > max_dist:
            max_dist = d
            far = p

    if far is None:
        hull.append(b)
        return

    left_of_af = [p for p in points if side(a, far, p) > 0]
    left_of_fb = [p for p in points if side(far, b, p) > 0]
    build_hull(left_of_af, a, far, hull)
    build_hull(left_of_fb, far, b, hull)

def quickhull(points):
    left = min(points)
    right = max(points)
    upper = [p for p in points if side(left, right, p) > 0]
    lower = [p for p in points if side(right, left, p) > 0]

    hull = [left]
    build_hull(upper, left, right, hull)
    build_hull(lower, right, left, hull)
    return hull`,
        frames: [
            { kind: 'points', note: 'Start with extreme points A and E.', points: hullPoints, hull: ['A', 'E'], current: 'E' },
            { kind: 'points', note: 'Find farthest point from line A-E on upper side: C.', points: hullPoints, hull: ['A', 'C', 'E'], current: 'C' },
            { kind: 'points', note: 'Recurse on A-C and C-E: add B and D.', points: hullPoints, hull: ['A', 'B', 'C', 'D', 'E'], current: 'D' },
            { kind: 'points', note: 'Process lower side of E-A: add F and G.', points: hullPoints, hull: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], current: 'G' },
            { kind: 'points', note: 'Quickhull boundary complete.', points: hullPoints, hull: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
        ],
    },
]
