---
name: plan
description: Create a detailed implementation plan before coding, iterating until satisfactory
---

# Plan Mode

Start a planning session to create a detailed implementation plan before writing any code.

## Usage

```bash
/claude-vibe-flow:plan <feature-description>
```

## Workflow

1. **Understand Requirements**: Clarify the feature scope and constraints
2. **Analyze Codebase**: Identify relevant files and patterns
3. **Draft Plan**: Create step-by-step implementation plan
4. **Iterate**: Refine plan based on feedback
5. **Execute**: Once approved, implement the plan

## Example

```bash
/claude-vibe-flow:plan "Add user authentication with JWT tokens"
```

Output:
```markdown
## Implementation Plan: JWT Authentication

### Phase 1: Setup
- [ ] Install dependencies (jsonwebtoken, bcrypt)
- [ ] Create auth configuration

### Phase 2: Backend
- [ ] Create User model with password hashing
- [ ] Implement login/register endpoints
- [ ] Add JWT middleware

### Phase 3: Frontend
- [ ] Create login/register forms
- [ ] Implement token storage
- [ ] Add auth context

### Phase 4: Testing
- [ ] Unit tests for auth utilities
- [ ] Integration tests for endpoints
```

## Tips

- Use Claude Code's built-in Plan mode (Shift+Tab twice) for quick planning
- This command provides a more structured, persistent plan
- Plan is saved to `.claude-vibe-flow/active_spec.md` for context persistence

## When to Use

- Complex features spanning multiple files
- Architectural changes
- Features requiring research first
- Team collaboration (share the plan for review)
