export type TestCase = {
  input: unknown
  expectedOutput: unknown
  explanation: string
}

export type SolutionApproach = {
  title: string
  explanation: string
}

export type JavaScriptProblem = {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: 'Array Manipulation' | 'String Handling' | 'Object Handling' | 'Function Challenge'
  description: string
  constraints: string[]
  hints: {
    hint1: string
    hint2: string
    hint3: string
  }
  testCases: TestCase[]
  fullSolution: {
    code: string
    explanation: string
  }
  otherApproaches: SolutionApproach[]
}

export const javascriptProblems: JavaScriptProblem[] = [
  {
    id: 'reverse-array',
    title: 'Reverse an Array',
    difficulty: 'Easy',
    category: 'Array Manipulation',
    description: 'Write a function that reverses an array in-place (modifies the original array) and also returns it. Do not use the built-in reverse() method.',
    constraints: [
      'Array can contain any type of values (numbers, strings, objects, etc.)',
      'Modify the array in-place and return the reversed array',
      'Cannot use Array.prototype.reverse()',
      'Single pass solution preferred'
    ],
    hints: {
      hint1: 'Think about using two pointers: one at the start and one at the end. Swap elements and move toward the center.',
      hint2: 'You\'ll need a temporary variable to swap elements. Use two indices (left and right) and move them toward each other.',
      hint3: 'Loop while left < right. In each iteration: swap arr[left] and arr[right], then increment left and decrement right. Continue until they meet.'
    },
    testCases: [
      {
        input: [1, 2, 3, 4, 5],
        expectedOutput: [5, 4, 3, 2, 1],
        explanation: 'Standard case: array of 5 numbers'
      },
      {
        input: ['hello', 'world'],
        expectedOutput: ['world', 'hello'],
        explanation: 'Strings in array; order is reversed'
      },
      {
        input: [1],
        expectedOutput: [1],
        explanation: 'Single element stays the same'
      },
      {
        input: [],
        expectedOutput: [],
        explanation: 'Empty array remains empty'
      }
    ],
    fullSolution: {
      code: `function reverseArray(arr) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    // Swap elements
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    
    // Move pointers toward center
    left++;
    right--;
  }
  
  return arr;
}`,
      explanation: 'Two-pointer approach: Start with pointers at both ends. Swap elements and move inward. Time: O(n), Space: O(1). This is the classic two-pointer technique used in many array problems.'
    },
    otherApproaches: [
      {
        title: 'Using a loop with splice/unshift',
        explanation: 'Build a new array by removing from end and adding to beginning. Less efficient: O(n²) because unshift shifts all elements.'
      },
      {
        title: 'Using reduce (functional)',
        explanation: 'Use reduce to build reversed array: arr.reduce((rev, item) => [item, ...rev], []). More elegant but creates new array.'
      }
    ]
  },
  {
    id: 'count-unique-chars',
    title: 'Count Unique Characters',
    difficulty: 'Easy',
    category: 'String Handling',
    description: 'Write a function that counts the number of unique characters in a string. Case-sensitive (\'A\' and \'a\' are different). Ignore spaces.',
    constraints: [
      'Count only unique characters',
      'Treat uppercase and lowercase as different characters',
      'Spaces should be ignored',
      'Input is a valid string'
    ],
    hints: {
      hint1: 'You need to track which characters you\'ve seen before. A Set or object can help track uniqueness.',
      hint2: 'Iterate through the string (skip spaces). For each character, check if you\'ve seen it. If not, increment counter and mark as seen.',
      hint3: 'Use a Set to store seen characters: new Set(). When you encounter a character that\'s not in the Set, add it and increment count.'
    },
    testCases: [
      {
        input: 'hello',
        expectedOutput: 4,
        explanation: 'h, e, l (counted once), o = 4 unique'
      },
      {
        input: 'aabbcc',
        expectedOutput: 3,
        explanation: 'a, b, c = 3 unique (each appears twice)'
      },
      {
        input: 'Hello World',
        expectedOutput: 8,
        explanation: 'H, e, l, o, W, r, d = 8 (space ignored, case-sensitive so H != h)'
      },
      {
        input: 'aaaa',
        expectedOutput: 1,
        explanation: 'Only one unique character: a'
      }
    ],
    fullSolution: {
      code: `function countUniqueChars(str) {
  const seen = new Set();
  
  for (const char of str) {
    // Skip spaces
    if (char === ' ') continue;
    
    // Add to set (sets don't store duplicates)
    seen.add(char);
  }
  
  return seen.size;
}`,
      explanation: 'Use a Set to store unique characters. Iterate through the string, skip spaces, and add each character to the Set. The Set automatically handles uniqueness. Time: O(n), Space: O(k) where k = unique characters.'
    },
    otherApproaches: [
      {
        title: 'Using an object/map to count occurrences',
        explanation: 'Track character frequencies in an object. Then count keys. Useful if you also need character counts.'
      },
      {
        title: 'Using filter + indexOf',
        explanation: 'Filter array where each char first appears: str.split(\' \').filter((c, i, arr) => arr.indexOf(c) === i).length. Less efficient and harder to read.'
      }
    ]
  },
  {
    id: 'merge-objects',
    title: 'Merge Two Objects',
    difficulty: 'Medium',
    category: 'Object Handling',
    description: 'Write a function that merges two objects. If keys overlap, the second object\'s values should take precedence. Return a new object without modifying the inputs.',
    constraints: [
      'Return a new object (do not mutate inputs)',
      'Handle nested objects (shallow merge only needed)',
      'Second object values override first object values for duplicate keys',
      'Objects can have any value types'
    ],
    hints: {
      hint1: 'You need to combine keys from both objects. Object.assign() or spread operator can help. Make sure you don\'t mutate the original objects.',
      hint2: 'Start with first object properties, then add/override with second object properties. The spread operator: {...obj1, ...obj2} does exactly this.',
      hint3: 'Use the spread operator: return {...obj1, ...obj2}. Or use Object.assign({}, obj1, obj2) to create a new object and merge into it. The second object properties override the first.'
    },
    testCases: [
      {
        input: [{ a: 1, b: 2 }, { c: 3 }],
        expectedOutput: { a: 1, b: 2, c: 3 },
        explanation: 'No overlaps; combine all keys'
      },
      {
        input: [{ a: 1, b: 2 }, { b: 99, c: 3 }],
        expectedOutput: { a: 1, b: 99, c: 3 },
        explanation: 'Key b overlaps; second object value (99) wins'
      },
      {
        input: [{ name: 'Alice', age: 25 }, { age: 26, city: 'NYC' }],
        expectedOutput: { name: 'Alice', age: 26, city: 'NYC' },
        explanation: 'age updated from second object; name and city preserved/added'
      },
      {
        input: [{}, { x: 1 }],
        expectedOutput: { x: 1 },
        explanation: 'First object is empty'
      }
    ],
    fullSolution: {
      code: `function mergeObjects(obj1, obj2) {
  return { ...obj1, ...obj2 };
}`,
      explanation: 'Spread operator creates a new object with all properties from obj1, then overlays obj2 properties on top (overriding any duplicates). Time: O(n + m), Space: O(n + m) for new object. Clean, modern JavaScript approach.'
    },
    otherApproaches: [
      {
        title: 'Using Object.assign()',
        explanation: 'Object.assign({}, obj1, obj2) - mutates the first argument, so pass {} as target. More explicit about merging behavior.'
      },
      {
        title: 'Manual loop with for...in',
        explanation: 'Loop through obj2 keys and set them on obj1. Less elegant but shows understanding of object iteration.'
      }
    ]
  },
  {
    id: 'filter-and-transform',
    title: 'Filter and Transform Array',
    difficulty: 'Medium',
    category: 'Array Manipulation',
    description: 'Given an array of numbers, filter out even numbers and transform the remaining (odd) numbers by doubling them. Return the result as a new array.',
    constraints: [
      'Filter out even numbers (keep only odd)',
      'Double each odd number that remains',
      'Return a new array, do not mutate the input',
      'Array contains valid integers only'
    ],
    hints: {
      hint1: 'You need to filter AND transform. Use array methods: filter() removes unwanted items, map() transforms the remaining ones. You can chain them.',
      hint2: 'Start with filter() to keep only odd numbers (number % 2 !== 0). Then chain map() to double each one (number * 2).',
      hint3: 'Chain methods: arr.filter(num => num % 2 !== 0).map(num => num * 2). Or use reduce() to do both in one pass. Both work!'
    },
    testCases: [
      {
        input: [1, 2, 3, 4, 5, 6],
        expectedOutput: [2, 6, 10],
        explanation: 'Odd numbers: 1, 3, 5. Doubled: 2, 6, 10'
      },
      {
        input: [2, 4, 6, 8],
        expectedOutput: [],
        explanation: 'All even; nothing passes filter'
      },
      {
        input: [1, 3, 5],
        expectedOutput: [2, 6, 10],
        explanation: 'All odd; all get doubled'
      },
      {
        input: [10, 11, 12, 13],
        expectedOutput: [22, 26],
        explanation: 'Odd: 11, 13. Doubled: 22, 26'
      }
    ],
    fullSolution: {
      code: `function filterAndTransform(arr) {
  return arr
    .filter(num => num % 2 !== 0)  // keep only odd numbers
    .map(num => num * 2);           // double them
}`,
      explanation: 'Chain filter() and map() for clarity and performance. Filter removes even numbers, map transforms remaining. Time: O(n), Space: O(n) for new array. This is idiomatic functional JavaScript.'
    },
    otherApproaches: [
      {
        title: 'Using reduce() in one pass',
        explanation: 'Single reduce() loop: arr.reduce((result, num) => { if (num % 2 !== 0) result.push(num * 2); return result; }, []). More efficient if array is huge but less readable.'
      },
      {
        title: 'Traditional for loop',
        explanation: 'Manual loop with push(). Works but less functional and more verbose. Old-school approach.'
      }
    ]
  }
]
