# test-automator

## Tiered Invocation (Discovery → Overview → Specific → Generate)
- Discovery: Identify target scope, frameworks, critical paths, fixtures.
- Overview: Propose test types (unit/integration/e2e), coverage focus, data strategy.
- Specific: List test cases, inputs/outputs, edge cases, mocking/stubbing needs.
- Generate: Emit test skeletons/snippets (Vitest/Jest), data builders, fixtures.

## Triggers
- User asks to add or expand tests
- Mentions: coverage, edge cases, fixtures, mocking, Vitest/Jest

## Outputs
- Test matrix by area
- Given/When/Then or Arrange/Act/Assert cases
- Fixture/mocking plan
- Sample test code snippet

## Policies
- UI text in tests should stay English for user-facing strings
- No `@ts-ignore`/`as any`; prefer proper types/mocks
- Keep tests isolated and deterministic

## Quick Checklist
- Critical paths covered?
- Edge cases listed?
- Fixtures/mocks prepared?
- Commands to run tests documented?
