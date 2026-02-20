# Client Testing Understanding (React + Next.js + Apollo)

This doc explains how your repo tests client-side React components today.

## 1) What tools are used

Your client tests are built with:

- **Vitest** as the test runner
- **React Testing Library** for rendering and user-like interaction
- **JSDOM** as a browser-like test environment
- **jest-dom** for readable assertions like `toBeInTheDocument()`
- **Apollo MockedProvider** to mock GraphQL requests without hitting the real API

Relevant files:

- [package.json](package.json)
- [vitest.config.ts](vitest.config.ts)
- [vitest.setup.ts](vitest.setup.ts)
- [src/components/graphql-playground.test.tsx](src/components/graphql-playground.test.tsx)

---

## 2) How test execution is configured

### NPM scripts

From [package.json](package.json):

- `npm test` runs all tests once (`vitest run`)
- `npm run test:watch` runs tests in watch mode (`vitest`)

### Vitest config

From [vitest.config.ts](vitest.config.ts):

- Includes both `.test.ts` and `.test.tsx`
- Sets alias `@ -> ./src` so imports match app code
- Loads global setup file `vitest.setup.ts`

### Global setup

From [vitest.setup.ts](vitest.setup.ts):

- Enables jest-dom matchers
- Runs `cleanup()` after each test to avoid DOM leakage between tests

---

## 3) How client component tests are structured

The main client test file is [src/components/graphql-playground.test.tsx](src/components/graphql-playground.test.tsx).

### Why `@vitest-environment jsdom` is used

At the top of the file, this comment forces browser-like environment for that file:

- `// @vitest-environment jsdom`

That is required because component tests need DOM APIs (`document`, `window`, form events).

### What is tested

Two behavior-focused tests exist:

1. **Initial query rendering**
   - Component shows loading state
   - Query result appears (`hello`, `messages`)

2. **Mutation flow**
   - User types a message
   - Clicks submit button
   - Mutation mock resolves
   - Refetched query mock returns updated list
   - UI shows newly added message

---

## 4) How Apollo GraphQL is mocked in tests

Tests wrap the component with `MockedProvider`.

Pattern:

1. Provide a `mocks` array
2. Each item contains:
   - `request` (`query`, optional `variables`)
   - `result` (`data` shape returned)
3. Render component inside `MockedProvider`
4. Assert what appears after each async operation

Why this is useful:

- No network dependency
- Fast deterministic tests
- You validate UI behavior against known GraphQL outcomes

---

## 5) How interactions are tested

In the mutation test, the flow is:

1. `fireEvent.change(...)` fills input
2. `fireEvent.click(...)` submits
3. `waitFor(...)` waits for async UI update
4. Assertion confirms updated message is visible

This tests your real user path, not internal implementation details.

---

## 6) What makes these tests reliable

Current reliability choices in your repo:

- Cleanup after each test prevents duplicate DOM nodes
- Explicit GraphQL request/response mocks avoid flaky calls
- Async checks (`findBy...`, `waitFor`) handle render timing correctly
- Assertions focus on user-visible text and behavior

---

## 7) Common pitfalls to watch for

1. **Mock mismatch**: if query/variables don’t exactly match, Apollo won’t resolve the mock.
2. **Missing cleanup**: tests can interfere with each other (you already fixed this).
3. **Wrong environment**: client tests fail if JSDOM isn’t active.
4. **Over-testing internals**: prefer visible behavior over implementation details.

---

## 8) Mental model for your client tests

Think of each test as:

1. Arrange mocked GraphQL responses
2. Render component in a browser-like environment
3. Simulate user behavior
4. Assert what the user sees

That gives you confidence your client-side React + GraphQL experience works, independent of real backend/network timing.
