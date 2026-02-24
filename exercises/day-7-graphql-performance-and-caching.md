# Day 7: GraphQL Performance and Caching (Project-Based)

## Topics
- Apollo Client caching in Next.js
- Optimizing queries and mutations
- Server-side resolver efficiency

## Exercises
1. Explore how Apollo Client caches GET_DASHBOARD_DATA in your playground. Change a message and observe cache updates. Document the behavior.
2. Add a new field to your Message type (e.g., "isImportant") and update your playground to support toggling this field. Ensure the UI and cache update correctly after mutation.
3. Review your query and mutation resolvers in queries.ts and mutations.ts. Identify any inefficiencies (e.g., unnecessary array copies, slow operations) and optimize them. Test before/after using your playground UI.
