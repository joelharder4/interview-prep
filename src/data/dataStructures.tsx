import type { ReactNode } from 'react'

export type DataStructureCard = {
  slug: string
  title: string
  summary: string
  complexity: string
  diagram: ReactNode
  code: string
}

export const dataStructureCards: DataStructureCard[] = [
  {
    slug: 'array-list',
    title: 'Array / List',
    summary: 'Fast index reads, expensive middle inserts.',
    complexity: 'Access O(1), append O(1) amortized, insert O(n)',
    diagram: (
      <svg viewBox="0 0 260 120" aria-hidden="true">
        <rect x="14" y="34" width="44" height="52" rx="8" fill="#60a5fa" />
        <rect x="62" y="34" width="44" height="52" rx="8" fill="#3b82f6" />
        <rect x="110" y="34" width="44" height="52" rx="8" fill="#2563eb" />
        <rect x="158" y="34" width="44" height="52" rx="8" fill="#1d4ed8" />
        <rect x="206" y="34" width="44" height="52" rx="8" fill="#1e40af" />
        <text x="35" y="106" fontSize="11" textAnchor="middle">0</text>
        <text x="83" y="106" fontSize="11" textAnchor="middle">1</text>
        <text x="131" y="106" fontSize="11" textAnchor="middle">2</text>
        <text x="179" y="106" fontSize="11" textAnchor="middle">3</text>
        <text x="227" y="106" fontSize="11" textAnchor="middle">4</text>
      </svg>
    ),
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
    summary: 'Pointer walking, cheap head ops, no random access.',
    complexity: 'Head insert/delete O(1), search O(n)',
    diagram: (
      <svg viewBox="0 0 260 120" aria-hidden="true">
        <rect x="14" y="40" width="52" height="40" rx="8" fill="#34d399" />
        <rect x="92" y="40" width="52" height="40" rx="8" fill="#10b981" />
        <rect x="170" y="40" width="52" height="40" rx="8" fill="#059669" />
        <path d="M66 60H88" stroke="#0f766e" strokeWidth="6" strokeLinecap="round" />
        <path d="M144 60H166" stroke="#0f766e" strokeWidth="6" strokeLinecap="round" />
        <path d="M84 52L92 60L84 68" fill="#0f766e" />
        <path d="M162 52L170 60L162 68" fill="#0f766e" />
      </svg>
    ),
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
    summary: 'Use for backtracking, DFS, and expression parsing.',
    complexity: 'Push/pop/peek O(1)',
    diagram: (
      <svg viewBox="0 0 260 120" aria-hidden="true">
        <rect x="78" y="20" width="104" height="84" rx="10" fill="#fde68a" />
        <rect x="94" y="32" width="72" height="14" rx="5" fill="#f59e0b" />
        <rect x="94" y="50" width="72" height="14" rx="5" fill="#d97706" />
        <rect x="94" y="68" width="72" height="14" rx="5" fill="#b45309" />
        <text x="52" y="29" fontSize="11">top</text>
        <path d="M54 34L90 39" stroke="#92400e" strokeWidth="3" />
      </svg>
    ),
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
    summary: 'Great for BFS and buffering workloads.',
    complexity: 'Enqueue/dequeue O(1)',
    diagram: (
      <svg viewBox="0 0 260 120" aria-hidden="true">
        <rect x="18" y="42" width="224" height="36" rx="10" fill="#fca5a5" />
        <circle cx="48" cy="60" r="11" fill="#ef4444" />
        <circle cx="87" cy="60" r="11" fill="#dc2626" />
        <circle cx="126" cy="60" r="11" fill="#b91c1c" />
        <path d="M158 60H236" stroke="#7f1d1d" strokeWidth="5" strokeLinecap="round" />
        <path d="M226 52L240 60L226 68" fill="#7f1d1d" />
        <text x="24" y="30" fontSize="11">front</text>
        <text x="196" y="30" fontSize="11">rear</text>
      </svg>
    ),
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
    summary: 'Key-value lookup workhorse for almost everything.',
    complexity: 'Average get/set/delete O(1)',
    diagram: (
      <svg viewBox="0 0 260 120" aria-hidden="true">
        <rect x="18" y="18" width="92" height="84" rx="10" fill="#C4B5FD" />
        <rect x="142" y="18" width="100" height="84" rx="10" fill="#E9D5FF" />
        <rect x="28" y="30" width="72" height="16" rx="5" fill="#8B5CF6" />
        <rect x="28" y="52" width="72" height="16" rx="5" fill="#7C3AED" />
        <rect x="28" y="74" width="72" height="16" rx="5" fill="#6D28D9" />
        <text x="64" y="42" fontSize="10" textAnchor="middle" fill="#F5F3FF">user_id</text>
        <text x="64" y="64" fontSize="10" textAnchor="middle" fill="#F5F3FF">email</text>
        <text x="64" y="86" fontSize="10" textAnchor="middle" fill="#F5F3FF">role</text>

        <rect x="154" y="30" width="76" height="18" rx="5" fill="#A78BFA" />
        <rect x="154" y="52" width="76" height="18" rx="5" fill="#8B5CF6" />
        <rect x="154" y="74" width="76" height="18" rx="5" fill="#7C3AED" />
        <text x="192" y="42" fontSize="10" textAnchor="middle" fill="#F5F3FF">bucket 2</text>
        <text x="192" y="64" fontSize="10" textAnchor="middle" fill="#F5F3FF">bucket 5</text>
        <text x="192" y="86" fontSize="10" textAnchor="middle" fill="#F5F3FF">bucket 1</text>

        <path d="M100 38H146" stroke="#5B21B6" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 60H146" stroke="#5B21B6" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 82H146" stroke="#5B21B6" strokeWidth="3" strokeLinecap="round" />
        <path d="M144 34L146 38L144 42" fill="#5B21B6" />
        <path d="M144 56L146 60L144 64" fill="#5B21B6" />
        <path d="M144 78L146 82L144 86" fill="#5B21B6" />
      </svg>
    ),
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
    summary: 'Hierarchical data and recursion interview favorite.',
    complexity: 'Traverse O(n), balanced search O(log n)',
    diagram: (
      <svg viewBox="0 0 260 120" aria-hidden="true">
        <circle cx="130" cy="26" r="14" fill="#a7f3d0" />
        <circle cx="82" cy="66" r="14" fill="#6ee7b7" />
        <circle cx="178" cy="66" r="14" fill="#34d399" />
        <circle cx="56" cy="102" r="12" fill="#10b981" />
        <circle cx="108" cy="102" r="12" fill="#10b981" />
        <circle cx="152" cy="102" r="12" fill="#059669" />
        <circle cx="204" cy="102" r="12" fill="#059669" />
        <path d="M121 36L90 56" stroke="#047857" strokeWidth="4" />
        <path d="M139 36L170 56" stroke="#047857" strokeWidth="4" />
        <path d="M76 78L62 91" stroke="#047857" strokeWidth="4" />
        <path d="M88 78L102 91" stroke="#047857" strokeWidth="4" />
        <path d="M172 78L158 91" stroke="#047857" strokeWidth="4" />
        <path d="M184 78L198 91" stroke="#047857" strokeWidth="4" />
      </svg>
    ),
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
]
