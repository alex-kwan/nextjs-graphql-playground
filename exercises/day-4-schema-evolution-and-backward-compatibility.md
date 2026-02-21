# Day 4 (2 hours): Schema Evolution + Backward Compatibility

## Outcome

Practice safe GraphQL schema changes using expand/migrate/contract principles.

## Timebox

- 20 min: Review migration strategy from learning docs
- 70 min: Implement additive schema evolution
- 30 min: Add compatibility tests and notes

## Exercise

1. Add a richer message type (example: `Message { id, text, createdAt }`) without removing old field yet.
2. Add a new query field (`messagesV2`) that returns the richer type.
3. Update client to consume `messagesV2` while keeping old schema support.
4. Add tests for both old and new query fields during migration window.
5. Document deprecation plan in a short note file in `learning/`.

## Success criteria

- Old client query path still works.
- New query path works and is rendered in UI.
- Tests prove migration compatibility.

## Reflection prompts

- Which changes were additive vs breaking?
- How would you know it is safe to remove old fields?
