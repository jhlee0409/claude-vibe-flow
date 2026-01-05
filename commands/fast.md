---
name: fast
description: Activate FastVibe mode for rapid prototyping with minimal ceremony.
tools: Read, Write, Edit, Grep, Glob
---

# Fast Command - FastVibe Mode

## Usage

```
/claude-vibe-flow:fast "Add a counter component"
/claude-vibe-flow:fast
```

---

## MODE: FastVibe (ACTIVE)

> **Purpose**: Rapid prototyping and quick implementation with minimal ceremony.

### Behavior Changes (Follow These Relaxed Rules)

When FastVibe mode is active:

#### 1. Minimal Planning

```markdown
- Skip detailed requirement gathering
- Assume reasonable defaults
- Ask only 1-2 critical clarifying questions (max)
- Proceed with implementation immediately
```

#### 2. Streamlined Verification

```markdown
- Run lsp_diagnostics only at the END (not after every edit)
- Skip todowrite for simple tasks
- Focus on "does it work?" over "is it perfect?"
```

#### 3. Speed Optimizations

```markdown
- Prefer inline solutions over abstractions
- Use existing patterns without extensive analysis
- Implement the happy path first
- Defer edge case handling (document as TODOs in code)
```

---

## Behavior Comparison

| Aspect | Normal Mode | FastVibe Mode |
|--------|-------------|---------------|
| Planning | Thorough | Minimal |
| Questions | As needed | Max 1-2 critical |
| Verification | Continuous (every edit) | End only |
| Tests | Included | Deferred |
| Documentation | Full | Minimal |
| Edge cases | Handled | Documented as TODO |

---

## Relaxed Verification Checklist

```markdown
Before completing in FastVibe mode:

[ ] Code runs without crashes
[ ] Basic functionality works
[ ] lsp_diagnostics shows no ERRORS (warnings OK)
```

---

## Trade-offs to Acknowledge

```markdown
FastVibe trades thoroughness for speed:

GAINS:
+ Faster iteration
+ Quick feedback
+ Good for exploration

COSTS:
- May need refactoring later
- Edge cases not handled
- Tests deferred
- Less documentation
```

---

## When to Use FastVibe

| Scenario | Use FastVibe? |
|----------|---------------|
| Quick prototype | Yes |
| Proof of concept | Yes |
| Exploring an idea | Yes |
| Production code | No |
| Complex features | No (use /deep) |
| Security-sensitive | No |

## Constraints

- **DO** focus on core functionality
- **DO** document shortcuts taken (inline TODOs)
- **DO** note areas needing future attention
- **DON'T** skip error handling entirely
- **DON'T** use for production deployments
- **DON'T** ignore critical security issues

## Exiting FastVibe Mode

- Start a new session
- Or say "exit fast mode"
- Or use `/claude-vibe-flow:verify` to run full verification
- Or use `/claude-vibe-flow:deep` for thorough work

## Related Commands

- `/claude-vibe-flow:verify` - Run verification checks
- `/claude-vibe-flow:deep` - Switch to DeepWork mode
