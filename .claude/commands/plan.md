---
name: plan
description: Plan a new feature or idea
---

# /plan Command

Turn a vague idea into a concrete, implementable plan.

## Usage

```
/plan "I want to add user authentication"
/plan "What if we had dark mode?"
/plan "Design a shopping cart feature"
```

## Behavior

1. **Invoke planner agent** to structure the idea
2. **Save plan** to `.claude-vibe-flow/active_spec.md`
3. **Create TODO items** for implementation tracking

## Output

After running `/plan`, you'll get:
- A structured spec with Problem, Solution, MVP Scope
- TODO items ready for implementation
- Clear out-of-scope boundaries

## Next Steps

After planning:
- Start implementing directly (Claude handles it)
- Or run `/check` to see current status

## Examples

### Input
```
/plan "Add a simple search feature to the blog"
```

### Output
```markdown
## Feature: Blog Search

### Problem
Users can't find old posts easily.

### Solution
Add a search input that filters posts by title and content.

### MVP Scope
- [ ] Add search input component to header
- [ ] Implement client-side filtering
- [ ] Show "no results" state

### Out of Scope (v1)
- Full-text search backend
- Search analytics
- Fuzzy matching
```

## Notes

- MAX 5 minutes on planning
- MAX 2 clarifying questions
- Bias toward action over perfect planning
