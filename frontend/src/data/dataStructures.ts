export type DataStructureCard = {
  slug: string
  title: string
  summary: string
  complexity: string
  diagramSrc: string
  code: string
}

export const dataStructureCards: DataStructureCard[] = [
  {
    slug: 'array-list',
    title: 'Array / List',
    summary:
      'Best when reads dominate and memory is contiguous. Inserts in the middle are costly because elements must shift.',
    complexity: 'Access O(1), append O(1) amortized, insert O(n), delete O(n)',
    diagramSrc: '/diagrams/array.svg',
    code: `class DynamicArray:
    def __init__(self):
        self.data = []

    def get(self, i):
        return self.data[i]

    def append(self, value):
        self.data.append(value)

    def insert(self, i, value):
        self.data.insert(i, value)`,
  },
  {
    slug: 'linked-list',
    title: 'Singly Linked List',
    summary:
      'Use when insertions near the head are frequent and random indexing is not required. Traversal remains linear.',
    complexity: 'Head insert O(1), delete O(1) with pointer, search O(n)',
    diagramSrc: '/diagrams/linked-list.svg',
    code: `class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None

    def push_front(self, value):
        self.head = Node(value, self.head)

    def find(self, target):
        cur = self.head
        while cur:
            if cur.value == target:
                return cur
            cur = cur.next
        return None`,
  },
  {
    slug: 'stack',
    title: 'Stack (LIFO)',
    summary:
      'Ideal for backtracking and depth-first traversals. Most recent item exits first, keeping push and pop constant time.',
    complexity: 'Push O(1), pop O(1), peek O(1), search O(n)',
    diagramSrc: '/diagrams/stack.svg',
    code: `class Stack:
    def __init__(self):
        self._items = []

    def push(self, value):
        self._items.append(value)

    def pop(self):
        return self._items.pop()

    def peek(self):
        return self._items[-1] if self._items else None`,
  },
  {
    slug: 'queue',
    title: 'Queue (FIFO)',
    summary:
      'Queues preserve arrival order, making them essential for breadth-first search, scheduling, and rate-smoothed pipelines.',
    complexity: 'Enqueue O(1), dequeue O(1), peek O(1), search O(n)',
    diagramSrc: '/diagrams/queue.svg',
    code: `from collections import deque

class Queue:
    def __init__(self):
        self._items = deque()

    def enqueue(self, value):
        self._items.append(value)

    def dequeue(self):
        return self._items.popleft()

    def peek(self):
        return self._items[0] if self._items else None`,
  },
  {
    slug: 'hash-map',
    title: 'Hash Map / Dict',
    summary:
      'The default structure for key-value access. Average-case lookups are constant time when hashing is well distributed.',
    complexity: 'Average get/set/delete O(1), worst-case O(n)',
    diagramSrc: '/diagrams/hash-map.svg',
    code: `class HashMap:
    def __init__(self):
        self.data = {}

    def set(self, key, value):
        self.data[key] = value

    def get(self, key, default=None):
        return self.data.get(key, default)

    def delete(self, key):
        if key in self.data:
            del self.data[key]`,
  },
  {
    slug: 'binary-tree',
    title: 'Binary Tree',
    summary:
      'Tree structure is recursive by nature and appears often in search, hierarchy modeling, and traversal questions.',
    complexity: 'Traversal O(n), balanced search O(log n), skewed search O(n)',
    diagramSrc: '/diagrams/binary-tree.svg',
    code: `class TreeNode:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def inorder(root):
    if not root:
        return []
    l = inorder(root.left)
    r = inorder(root.right)
    return l + [root.value] + r`,
  },
  {
  slug: 'min-heap',
  title: 'Min Heap',
  summary:
    'Use when you need fast access to the smallest value repeatedly, such as scheduling and streaming top-k windows.',
  complexity: 'Peek-min O(1), push O(log n), pop-min O(log n)',
  diagramSrc: '/diagrams/min-heap.svg',
  code: `import heapq

class MinHeap:
  def __init__(self):
    self._heap = []

  def push(self, value):
    heapq.heappush(self._heap, value)

  def pop(self):
    return heapq.heappop(self._heap)

  def peek(self):
    return self._heap[0] if self._heap else None`,
  },
  {
  slug: 'max-heap',
  title: 'Max Heap',
  summary:
    'Use when the largest value should be retrieved first. Python typically simulates this with negated values.',
  complexity: 'Peek-max O(1), push O(log n), pop-max O(log n)',
  diagramSrc: '/diagrams/max-heap.svg',
  code: `import heapq

class MaxHeap:
  def __init__(self):
    self._heap = []

  def push(self, value):
    heapq.heappush(self._heap, -value)

  def pop(self):
    return -heapq.heappop(self._heap)

  def peek(self):
    return -self._heap[0] if self._heap else None`,
  },
  {
  slug: 'min-stack',
  title: 'Min Stack',
  summary:
    'Stack variant that tracks the current minimum in O(1), a common interview pattern for augmented metadata.',
  complexity: 'Push O(1), pop O(1), get-min O(1)',
  diagramSrc: '/diagrams/min-stack.svg',
  code: `class MinStack:
  def __init__(self):
    self._values = []
    self._mins = []

  def push(self, value):
    self._values.append(value)
    if not self._mins or value <= self._mins[-1]:
      self._mins.append(value)

  def pop(self):
    value = self._values.pop()
    if value == self._mins[-1]:
      self._mins.pop()
    return value

  def get_min(self):
    return self._mins[-1] if self._mins else None`,
  },
  {
  slug: 'max-stack',
  title: 'Max Stack',
  summary:
    'Mirrors min-stack but tracks the running maximum for constant-time max queries while retaining stack semantics.',
  complexity: 'Push O(1), pop O(1), get-max O(1)',
  diagramSrc: '/diagrams/max-stack.svg',
  code: `class MaxStack:
  def __init__(self):
    self._values = []
    self._maxes = []

  def push(self, value):
    self._values.append(value)
    if not self._maxes or value >= self._maxes[-1]:
      self._maxes.append(value)

  def pop(self):
    value = self._values.pop()
    if value == self._maxes[-1]:
      self._maxes.pop()
    return value

  def get_max(self):
    return self._maxes[-1] if self._maxes else None`,
  },
  {
  slug: 'trie',
  title: 'Trie (Prefix Tree)',
  summary:
    'Stores strings by prefix path, useful for autocomplete and prefix lookups where repeated prefixes should be shared.',
  complexity: 'Insert O(L), search O(L), starts-with O(L)',
  diagramSrc: '/diagrams/trie.svg',
  code: `class TrieNode:
  def __init__(self):
    self.children = {}
    self.is_word = False

class Trie:
  def __init__(self):
    self.root = TrieNode()

  def insert(self, word):
    node = self.root
    for ch in word:
      node = node.children.setdefault(ch, TrieNode())
    node.is_word = True

  def search(self, word):
    node = self.root
    for ch in word:
      if ch not in node.children:
        return False
      node = node.children[ch]
    return node.is_word`,
  },
  {
  slug: 'graph-adjacency-list',
  title: 'Graph (Adjacency List)',
  summary:
    'Primary sparse-graph representation. Keeps neighbors per node and works well with BFS/DFS traversals.',
  complexity: 'Add edge O(1), BFS/DFS O(V + E)',
  diagramSrc: '/diagrams/graph-adjacency.svg',
  code: `from collections import deque

class Graph:
  def __init__(self):
    self.adj = {}

  def add_edge(self, u, v):
    self.adj.setdefault(u, []).append(v)
    self.adj.setdefault(v, []).append(u)

  def bfs(self, start):
    seen = {start}
    q = deque([start])
    order = []
    while q:
      node = q.popleft()
      order.append(node)
      for nxt in self.adj.get(node, []):
        if nxt not in seen:
          seen.add(nxt)
          q.append(nxt)
    return order`,
  },
  {
  slug: 'disjoint-set',
  title: 'Disjoint Set (Union-Find)',
  summary:
    'Tracks connected components dynamically. Core choice for cycle checks and minimum spanning tree workflows.',
  complexity: 'Find/union amortized near O(1) with path compression + rank',
  diagramSrc: '/diagrams/disjoint-set.svg',
  code: `class UnionFind:
  def __init__(self, n):
    self.parent = list(range(n))
    self.rank = [0] * n

  def find(self, x):
    if self.parent[x] != x:
      self.parent[x] = self.find(self.parent[x])
    return self.parent[x]

  def union(self, a, b):
    ra = self.find(a)
    rb = self.find(b)
    if ra == rb:
      return False
    if self.rank[ra] < self.rank[rb]:
      ra, rb = rb, ra
    self.parent[rb] = ra
    if self.rank[ra] == self.rank[rb]:
      self.rank[ra] += 1
    return True`,
  },
  {
  slug: 'dynamic-programming',
  title: 'Dynamic Programming',
  summary:
    'Optimization pattern for overlapping subproblems. Cache sub-results so exponential recursion becomes polynomial.',
  complexity: 'Depends on state design; often O(states * transitions)',
  diagramSrc: '/diagrams/dynamic-programming.svg',
  code: `def fib(n, memo=None):
  if memo is None:
    memo = {}
  if n in memo:
    return memo[n]
  if n <= 1:
    return n
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
  return memo[n]

def fib_bottom_up(n):
  if n <= 1:
    return n
  dp = [0] * (n + 1)
  dp[1] = 1
  for i in range(2, n + 1):
    dp[i] = dp[i - 1] + dp[i - 2]
  return dp[n]`,
  },
]
