---
name: verify-before-commit
version: 1.0.0
description: |
  This skill should be used when the user asks to "commit", "push", "ship", 
  "create PR", "merge", or when user indicates they want to save/publish changes.
  Verifies all quality gates pass before allowing git operations.
allowed-tools: Bash, Read, lsp_diagnostics, todoread
---

# Pre-Commit Verification Skill

Before committing code, verify all quality gates pass.

## Checklist

### 1. Diagnostics (REQUIRED)

Run `lsp_diagnostics` on ALL changed files:

```bash
git status --porcelain | sed 's/^...//' | sed 's/.* -> //' | sed 's/^"//;s/"$//' | xargs -I {} echo "Check: {}"
```

For each file, run `lsp_diagnostics`. Block if ANY errors exist.

### 2. Tests (REQUIRED)

Verify tests were run this session:
- Check marker file exists: `${TMPDIR:-/tmp}/claude-tests-ran-*`
- If not, run tests now using test-enforcer skill

### 3. TODOs (REQUIRED)

Run `todoread`:
- All items should be `completed` or `cancelled`
- If `in_progress` or `pending` items exist, ask user to resolve

### 4. Formatting (OPTIONAL)

If project has formatter configured:
- Check `package.json` for prettier/eslint
- Run formatter on changed files

## Output Format

```markdown
## Pre-Commit Verification

| Check | Status |
|-------|--------|
| Diagnostics | PASS / FAIL (N errors) |
| Tests | PASS / NOT RUN / FAIL |
| TODOs | PASS / N pending |
| Format | PASS / SKIPPED |

**Result**: Ready to commit / BLOCKED: [reason]
```

## Blocking Conditions

DO NOT proceed with commit if ANY:
- `lsp_diagnostics` shows errors (warnings OK)
- Tests have not been run
- Tests are failing
- Critical TODOs are `in_progress`

## Escape Hatch

If user explicitly says "commit anyway" or "force commit":
- Warn about skipped checks
- Proceed with commit
- Note: Stop hook may still block if tests weren't run
