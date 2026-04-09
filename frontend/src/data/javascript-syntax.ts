export type SyntaxTopic = {
  id: string
  title: string
  category: 'Fundamentals' | 'Functions & Async' | 'Data Structures' | 'OOP'
  explanation: string
  codeExample: string
  commonPitfall?: string
  jobRelevance?: string
}

export const syntaxTopics: SyntaxTopic[] = [
  // Fundamentals
  {
    id: 'const-let-var',
    title: 'const, let, var',
    category: 'Fundamentals',
    explanation: 'var is function-scoped and hoisted (avoid in modern code). let is block-scoped and temporal dead zone protects it. const is block-scoped and cannot be reassigned, but objects/arrays can be mutated.',
    codeExample: `var x = 1;        // function-scoped, hoisted
let y = 2;        // block-scoped, no hoisting
const z = { a: 1 }; // block-scoped, no reassignment but z.a = 2 is allowed`,
    commonPitfall: 'Reassigning const object/array properties (allowed); thinking const prevents mutation (it doesn\'t); var leaking in loops.',
    jobRelevance: 'Always use const by default, let for loop counters. Shows understanding of scope and immutability in modern JavaScript.'
  },
  {
    id: 'template-literals',
    title: 'Template Literals',
    category: 'Fundamentals',
    explanation: 'Strings wrapped in backticks that support embedded expressions with ${}. Enable multi-line strings and cleaner string interpolation.',
    codeExample: `const name = "Alice";
const greeting = \`Hello, \${name}!\`;
const multiline = \`Line 1
Line 2\`;`,
    commonPitfall: 'Forgetting the $ prefix in ${...}; treating template literals as magic (they\'re just string evaluation).',
    jobRelevance: 'Essential for readable code. Common in React JSX and error messages. Shows clean coding practices.'
  },
  {
    id: 'nullish-coalescing',
    title: 'Nullish Coalescing (??)',
    category: 'Fundamentals',
    explanation: 'Returns right operand if left is null or undefined (not false, 0, "", etc.). Safer than || for default values.',
    codeExample: `const x = null ?? "default"; // "default"
const y = 0 ?? "default";    // 0 (not "default")
const z = false ?? "default"; // false (not "default")`,
    commonPitfall: 'Confusing ?? with ||; using ?? without understanding falsy values like 0 and empty strings.',
    jobRelevance: 'Prevents bugs in production code. Shows awareness of type coercion and defensive programming.'
  },
  {
    id: 'optional-chaining',
    title: 'Optional Chaining (?.)',
    category: 'Fundamentals',
    explanation: 'Safely accesses nested properties. Returns undefined if intermediate property is null/undefined instead of throwing error.',
    codeExample: `const user = { name: "Bob", address: null };
const city = user.address?.city; // undefined (no error)
const zip = user.address?.zip?.code; // undefined (short-circuits)`,
    commonPitfall: 'Mixing ?. with [] notation; thinking ?. is the same as &&; not realizing it short-circuits.',
    jobRelevance: 'Critical for safe API response handling. Reduces if-checks and error handling boilerplate.'
  },
  {
    id: 'destructuring',
    title: 'Destructuring',
    category: 'Fundamentals',
    explanation: 'Extract properties/elements from objects/arrays into variables. Works with function parameters, assignments, and can use rest syntax.',
    codeExample: `// Object destructuring
const { name, age } = { name: "Charlie", age: 30, email: "..." };
const { name: personName } = { name: "Dave" }; // rename

// Array destructuring
const [first, second] = [1, 2, 3];
const [a, , c] = [1, 2, 3]; // skip middle

// Rest syntax
const { id, ...rest } = { id: 1, x: 2, y: 3 }; // rest = { x: 2, y: 3 }`,
    commonPitfall: 'Trying to destructure non-existent properties (get undefined); confusing object and array destructuring syntax.',
    jobRelevance: 'Essential React pattern (props, useState). Makes code more readable and reduces variable boilerplate.'
  },
  {
    id: 'spread-operator',
    title: 'Spread & Rest Operators (...)',
    category: 'Fundamentals',
    explanation: 'Spread expands iterables (arrays, objects, strings). Rest collects into variables. Same syntax, different context (declaration vs. usage).',
    codeExample: `// Spread in arrays/objects
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Rest in function parameters
const sum = (...nums) => nums.reduce((a, b) => a + b, 0);`,
    commonPitfall: 'Shallow copy pitfall: { ...obj, nested: { x: 1 } } still shares nested object reference; using rest in wrong position.',
    jobRelevance: 'Core React pattern (spreading props). Enables immutable updates and clean parameter handling.'
  },
  {
    id: 'typeof-instanceof',
    title: 'typeof & instanceof',
    category: 'Fundamentals',
    explanation: 'typeof returns string type of value (useful for primitives). instanceof checks prototype chain (useful for objects and class instances).',
    codeExample: `typeof 42; // "number"
typeof "hi"; // "string"
typeof {}; // "object" (arrays too!)
typeof undefined; // "undefined"

const arr = [1, 2];
arr instanceof Array; // true
arr instanceof Object; // true (prototype chain)`
  },

  // Functions & Async
  {
    id: 'arrow-vs-function',
    title: 'Arrow Functions vs. Named Functions',
    category: 'Functions & Async',
    explanation: 'Arrow functions have lexical this (inherit from parent scope). Named functions have dynamic this (depends on how called). Arrow functions cannot be constructors; named functions can use new.',
    codeExample: `// Arrow function: lexical this
const obj1 = {
  count: 0,
  increment: () => { this.count++; } // this = global/undefined
};

// Named function: dynamic this
const obj2 = {
  count: 0,
  increment: function() { this.count++; } // this = obj2
};

// Constructor only works with function
function Person(name) { this.name = name; }
const p = new Person("Eve"); // works
const Arrow = (name) => { this.name = name; };
const a = new Arrow("Frank"); // error!`,
    commonPitfall: 'Using arrow functions in object methods expecting this binding; forgetting arrow functions don\'t have arguments object.',
    jobRelevance: 'Critical for React (event handlers, callbacks). Understand this binding to fix scope bugs in production.'
  },
  {
    id: 'callbacks',
    title: 'Callbacks',
    category: 'Functions & Async',
    explanation: 'Functions passed as arguments to other functions. Called later to handle asynchronous events or operations. Foundation for Promise and async/await.',
    codeExample: `function fetchData(callback) {
  setTimeout(() => {
    callback({ data: "result" });
  }, 1000);
}

fetchData((result) => {
  console.log(result);
});

// Callback hell (deeply nested callbacks)
fetchData((data1) => {
  fetchData((data2) => {
    fetchData((data3) => {
      console.log(data1, data2, data3); // hard to read
    });
  });
});`,
    commonPitfall: 'Callback hell with deep nesting; forgetting callback receives the value, not a promise; lost error context.',
    jobRelevance: 'Foundation for async JavaScript. Understand callbacks to appreciate why Promises and async/await exist.'
  },
  {
    id: 'promises',
    title: 'Promises',
    category: 'Functions & Async',
    explanation: 'Represents eventual completion or failure of async operation. States: pending, fulfilled (resolved), rejected. Chain with .then(), .catch(), .finally().',
    codeExample: `const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 1000);
});

promise
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
  .finally(() => console.log("complete"));

// Promise.all waits for all
Promise.all([p1, p2, p3]).then((results) => {});
// Promise.race returns first settled
Promise.race([p1, p2]).then((result) => {});`,
    commonPitfall: 'Not returning promises in .then() (breaks chain); forgetting .catch() (unhandled rejection); callback hell still possible with .then() nesting.',
    jobRelevance: 'Essential for API calls. Understand promise handling for production async code. Many libraries depend on promises.'
  },
  {
    id: 'async-await',
    title: 'async/await',
    category: 'Functions & Async',
    explanation: 'Syntactic sugar over Promises. async functions always return promises. await pauses execution until promise settles. Makes async code look synchronous.',
    codeExample: `async function fetchUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) throw new Error("Not found");
    const user = await response.json();
    return user;
  } catch (error) {
    console.error(error);
  }
}

// await only works inside async function
const user = await fetchUser(1); // must be in async function

// Execute multiple in parallel
const [user, posts] = await Promise.all([
  fetchUser(1),
  fetchPosts(1)
]);`,
    commonPitfall: 'Using await outside async function; awaiting non-promises (unnecessary but harmless); not handling rejections with try/catch; sequential await when parallel is possible.',
    jobRelevance: 'Modern async standard. Use instead of .then() chains. Essential for readable API integration code.'
  },

  // Data Structures
  {
    id: 'arrays',
    title: 'Arrays & Array Methods',
    category: 'Data Structures',
    explanation: 'Ordered collection of elements. Key methods: map, filter, reduce, find, some, every, forEach, slice, splice, includes, indexOf, sort.',
    codeExample: `const arr = [1, 2, 3, 4];
arr.map((x) => x * 2); // [2, 4, 6, 8]
arr.filter((x) => x > 2); // [3, 4]
arr.reduce((sum, x) => sum + x, 0); // 10
arr.find((x) => x > 2); // 3
arr.some((x) => x > 3); // true
arr.every((x) => x > 0); // true`
  },
  {
    id: 'objects',
    title: 'Objects',
    category: 'Data Structures',
    explanation: 'Key-value pairs. Access with dot notation (obj.prop) or bracket notation (obj["prop"]). Keys are strings or Symbols; values are any type.',
    codeExample: `const obj = { name: "Grace", age: 25 };
obj.name; // "Grace"
obj["age"]; // 25
const key = "name";
obj[key]; // "Grace" (computed property)

// Shorthand
const name = "Henry", age = 30;
const user = { name, age }; // { name: "Henry", age: 30 }

// Methods
Object.keys(obj); // ["name", "age"]
Object.values(obj); // ["Grace", 25]
Object.entries(obj); // [["name", "Grace"], ["age", 25]]`
  },
  {
    id: 'map-set',
    title: 'Map & Set',
    category: 'Data Structures',
    explanation: 'Map stores key-value pairs (keys can be any type, not just strings). Set stores unique values. Both are iterables with methods like .has(), .add(), .delete().',
    codeExample: `// Map: like object but keys can be any type
const map = new Map();
map.set("key", "value");
map.set(1, "number key");
map.has("key"); // true
map.get("key"); // "value"
map.size; // 2

// Set: unique values
const set = new Set([1, 2, 2, 3]);
set; // Set { 1, 2, 3 }
set.has(2); // true
set.add(4); // adds 4
set.size; // 4

// Iteration
for (const [key, value] of map) console.log(key, value);
for (const value of set) console.log(value);`,
    commonPitfall: 'Map/Set iteration order is insertion order (not sorted); confusing Map with object (Map can have object keys, object cannot); forgetting .size vs. length.',
    jobRelevance: 'Map is useful for caching and memoization. Set is useful for deduplication. Shows data structure awareness.'
  },
  {
    id: 'filter-map-reduce',
    title: 'filter, map, reduce (Deep Dive)',
    category: 'Data Structures',
    explanation: 'filter returns elements matching condition. map transforms each element. reduce accumulates into single value. Prefer these over loops for clarity.',
    codeExample: `const users = [
  { name: "Iris", age: 22 },
  { name: "Jack", age: 35 },
  { name: "Karen", age: 28 }
];

// filter: return subset
users.filter((u) => u.age > 25); // Iris filtered out

// map: transform structure
users.map((u) => u.name); // ["Iris", "Jack", "Karen"]

// reduce: combine into one value
users.reduce((total, u) => total + u.age, 0); // 85

// Chaining (functional style)
users
  .filter((u) => u.age > 25)
  .map((u) => u.name)
  .join(", "); // "Jack, Karen"`,
    commonPitfall: 'reduce with no initializer when needed; forgetting reduce returns a single value (not array); chaining too many operations (readability).',
    jobRelevance: 'Functional programming foundation. Shows modern JavaScript style. Heavily used in React (mapping arrays to JSX).'
  },

  // OOP
  {
    id: 'classes',
    title: 'Classes',
    category: 'OOP',
    explanation: 'Syntactic sugar over prototypes. Constructor initializes instances. Methods defined on prototype. Supports inheritance with extends and super.',
    codeExample: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(\`\${this.name} makes sound\`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // call parent constructor
    this.breed = breed;
  }
  speak() {
    super.speak(); // call parent method
    console.log(\`Woof!\`);
  }
}

const dog = new Dog("Max", "Golden");
dog.speak(); // "Max makes sound" then "Woof!"`
  },
  {
    id: 'prototypes',
    title: 'Prototypes & Inheritance',
    category: 'OOP',
    explanation: 'Objects have prototype chain for method lookup. If method not on object, JavaScript checks prototype, then prototype\'s prototype, etc. Understanding prototypes clarifies how inheritance works.',
    codeExample: `function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  console.log(\`\${this.name} speaks\`);
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const dog = new Dog("Buddy", "Lab");
dog.speak(); // "Buddy speaks" (found on Animal.prototype)

// Check prototype chain
dog instanceof Dog; // true
dog instanceof Animal; // true`,
    commonPitfall: 'Not understanding prototype chain lookup; thinking __proto__ is the same as prototype (different things); mutation of shared prototype affecting all instances.',
    jobRelevance: 'Understand prototypes to debug inheritance issues. Essential for JavaScript fundamentals interviews. Classes hide this complexity.'
  },
  {
    id: 'error-handling',
    title: 'Error Handling (try/catch/finally)',
    category: 'OOP',
    explanation: 'try catches errors; catch handles them; finally runs regardless. throw creates custom errors. Error types: Error, TypeError, ReferenceError, SyntaxError, etc.',
    codeExample: `try {
  const result = throwingFunction();
  console.log(result);
} catch (error) {
  if (error instanceof TypeError) {
    console.error("Type mismatch:", error.message);
  } else {
    console.error("Unknown error:", error);
  }
} finally {
  console.log("Cleanup"); // always runs
}

// Custom error
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
throw new ValidationError("Invalid input");`
  },
  {
    id: 'closures',
    title: 'Closures',
    category: 'Functions & Async',
    explanation: 'Function that accesses variables from outer scope. Inner function "remembers" outer scope variables even after outer function returns. Enables data privacy and factory patterns.',
    codeExample: `function makeCounter() {
  let count = 0; // private variable
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = makeCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount(); // 2
// count variable is inaccessible from outside

// Data privacy pattern
function createSecret(secret) {
  return {
    reveal: () => secret
  };
}`,
    commonPitfall: 'Memory leaks from closures holding large references; confusing closure with scope; closures in loops (all reference same variable).',
    jobRelevance: 'Foundation for React hooks (useState, useEffect use closures). Essential for understanding module patterns and data privacy.'
  },
  {
    id: 'higher-order-functions',
    title: 'Higher-Order Functions',
    category: 'Functions & Async',
    explanation: 'Functions that take functions as arguments or return functions. Enable composition, currying, and functional programming patterns. React hooks are higher-order functions.',
    codeExample: `// HOF that takes a function
function withLogging(fn) {
  return (...args) => {
    console.log("Calling", fn.name);
    return fn(...args);
  };
}

// HOF that returns a function (currying)
function createMultiplier(factor) {
  return (number) => number * factor;
}
const double = createMultiplier(2);
double(5); // 10

// Function composition
const compose = (...fns) => (value) => 
  fns.reduceRight((acc, fn) => fn(acc), value);`
  }
]
