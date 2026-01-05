---
name: verify
description: Run comprehensive verification on recent changes. Checks diagnostics, tests, and todo completion.
tools: Bash, Read
---

# Verify Command - Verification Mode

## Usage

```
/claude-vibe-flow:verify
/claude-vibe-flow:verify path/to/file.ts
```

---

## MODE: Verification (ACTIVE)

> **Purpose**: Enforce thorough verification to ensure code quality and completeness.

### Immediate Actions (DO THIS NOW)

Upon receiving this command, execute these checks:

#### 1. Diagnostics Check

```markdown
1. Identify recently modified files (or use specified file)
2. Run `lsp_diagnostics` on each file
3. Report ALL errors and warnings
4. If errors found → list them with file:line for fixing
```

#### 2. TODO Verification

```markdown
1. Run `todoread` to check pending items
2. Report status:
   - Total items
   - Completed items
   - Pending items (list each)
3. Remind to complete or cancel pending items
```

#### 3. Test Verification (if applicable)

```markdown
1. Detect test framework by checking:
   - package.json with "test" script → npm test
   - pytest.ini or tests/ directory → pytest
   - Cargo.toml → cargo test
   - go.mod → go test ./...
2. Run test suite
3. Report pass/fail status
```

---

## Output Format

### Success Report

```markdown
## Verification Report

### Diagnostics
| File | Errors | Warnings |
|------|--------|----------|
| src/index.ts | 0 | 2 |
| src/utils.ts | 0 | 0 |

Status: No errors (2 warnings - acceptable)

### TODO Status
- Total: 5 items
- Completed: 5
- Pending: 0

Status: All todos complete

### Tests
Command: npm test
Result: 42 tests passed

Status: All tests passing

---

## Overall: VERIFIED - Ready to proceed
```

### Failure Report

```markdown
## Verification Report

### Diagnostics
| File | Errors | Warnings |
|------|--------|----------|
| src/index.ts | 2 | 1 |

Errors found:
1. src/index.ts:15 - Type 'string' is not assignable to type 'number'
2. src/index.ts:23 - Property 'foo' does not exist on type 'Bar'

### TODO Status
- Pending: 2 items
  - [ ] Add error handling
  - [ ] Write unit tests

---

## Overall: NEEDS ATTENTION

Next Steps:
1. Fix 2 type errors in src/index.ts
2. Complete 2 pending todos
3. Re-run /claude-vibe-flow:verify
```

---

## Verification Checklist (Full)

```markdown
Before completing ANY implementation task:

[ ] All todos from todowrite are completed
[ ] lsp_diagnostics run on all modified files
[ ] Zero errors in diagnostics output
[ ] Tests executed (if applicable)
[ ] Tests passing (if applicable)
[ ] Active context updated (if using .claude-vibe-flow/)
```

---

## Related Commands

- `/claude-vibe-flow:deep` - Activate DeepWork mode
- `/claude-vibe-flow:fast` - Activate FastVibe mode
