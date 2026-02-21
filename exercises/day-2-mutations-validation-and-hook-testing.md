# Day 2 (2 hours): Mutations, Validation, and Hook-Focused Testing

## Outcome

Strengthen mutation design by adding validation and testing behavior at both UI and hook levels.

## Timebox

- 20 min: Review current mutation path (`useMutation`, resolver, refetch)
- 70 min: Implement validation + UI feedback
- 30 min: Add tests

## Exercise

1. Add server-side validation in `addMessage`:
   - Reject empty/whitespace-only input.
   - Reject message length > 120.
2. Return a clear GraphQL error message for invalid input.
3. In UI, show friendly validation error text.
4. Add one integration test for invalid mutation input.
5. Add one client test ensuring error text appears.
6. (Optional) Add `useAddMessage.test.ts` if you split into custom hook.

## Success criteria

- Invalid messages no longer get added.
- User sees useful error output.
- Tests confirm both server and client behavior.

## Reflection prompts

- Which validation belongs on server vs client?
- What did you assert in integration vs unit tests?
