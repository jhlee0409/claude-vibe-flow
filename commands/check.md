---
name: check
description: Show verification status
---

# /check Command

Display current project verification status.

## Usage

```
/check                     # Full status check
/check --quick             # Just diagnostics
/check --tests             # Focus on test status
```

## Output

```markdown
## Verification Status

### Diagnostics
| File | Errors | Warnings |
|------|--------|----------|
| src/auth.ts | 0 | 2 |
| src/api.ts | 0 | 0 |
**Total**: 0 errors, 2 warnings

### Tests
- Framework: vitest
- Last run: 2 minutes ago
- Status: PASS (42 tests)

### TODOs
| Status | Count |
|--------|-------|
| Completed | 3 |
| In Progress | 1 |
| Pending | 0 |

### Git Status
- Branch: feature/dark-mode
- Uncommitted changes: 4 files
- Ahead of origin: 2 commits

---
**Overall**: Ready to ship
```

## Checks Performed

### 1. Diagnostics
Runs `lsp_diagnostics` on:
- All files with uncommitted changes
- Files in current TODO scope

### 2. Test Status
- Detects test framework
- Checks if tests were run this session
- Reports last test result if available

### 3. TODO Status
- Reads current TODO list
- Reports completion status
- Flags blocking items

### 4. Git Status
- Current branch
- Uncommitted changes count
- Sync status with remote

## Quick Check Mode

`/check --quick` only runs diagnostics:

```markdown
## Quick Check

### Diagnostics
| File | Status |
|------|--------|
| src/auth.ts | PASS |
| src/api.ts | PASS |

**All clear!**
```

## Test Focus Mode

`/check --tests` focuses on test status:

```markdown
## Test Status

- Framework: vitest
- Command: npm test
- Last run: Not run this session

**Action needed**: Run `npm test` before shipping
```
