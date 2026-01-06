---
name: cvf:review
description: Request a code review
---

# /cvf:review Command

Get a code review on your recent changes.

## Usage

```
/cvf:review                    # Review all uncommitted changes
/cvf:review src/auth.ts        # Review specific file
/cvf:review --staged           # Review only staged changes
```

## Behavior

1. **Identify changed files** using git diff
2. **Invoke cvf-reviewer agent** for analysis
3. **Output structured feedback** with actionable items

## Review Scope

| Command | Scope |
|---------|-------|
| `/cvf:review` | All files with uncommitted changes |
| `/cvf:review <file>` | Specific file only |
| `/cvf:review --staged` | Only `git add`ed files |

## Output Format

```markdown
## Code Review

### Critical (Must Fix)
- **src/auth.ts:45** SQL injection risk: User input not sanitized
  - Suggested fix: Use parameterized query

### Important (Should Fix)
- **src/api.ts:23** Missing error handling for network failure

### Suggestions (Consider)
- Consider extracting the validation logic to a separate function

### Looks Good
- Clean separation of concerns in the service layer

---
**Overall**: REQUEST CHANGES (1 critical issue)
```

## What Gets Reviewed

- Correctness and logic errors
- Security vulnerabilities
- Performance issues
- Code simplicity
- Style consistency (if no linter)

## What's Skipped

- Auto-generated files
- Lock files
- Build output
- Test files (unless asked)
