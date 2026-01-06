---
name: test-enforcer
version: 1.0.0
description: |
  This skill should be used when the user asks to "run tests", "check tests", 
  "verify implementation", or after completing ANY code changes (Edit/Write tools).
  Triggers on: "implement", "add", "create", "build", "write code", "fix", "done", 
  "finished", "complete", or before git operations.
allowed-tools: Bash, Read
---

# Test Enforcement Skill

After completing code implementation, you MUST run tests.

## Recommended Method

Use the run-tests.sh wrapper script which automatically creates the marker file on success:

```bash
bash .claude/scripts/run-tests.sh
```

This is the safest way to run tests - it handles framework detection, test execution, and marker creation automatically.

## Manual Method (Alternative)

If you need more control, follow these steps:

### Step 1: Detect Test Framework

| Check | Framework | Command |
|-------|-----------|---------|
| `package.json` has vitest | Vitest | `npm test` |
| `package.json` has jest | Jest | `npm test` |
| `pyproject.toml` or `pytest.ini` | Pytest | `pytest` |
| `go.mod` exists | Go | `go test ./...` |
| `Cargo.toml` exists | Cargo | `cargo test` |
| `.claude-vibe-flow/test-command.txt` | Custom | (read from file) |

### Step 2: Run Tests

Execute the detected test command using Bash tool.

### Step 3: Create Marker (CRITICAL)

After tests PASS, you MUST create the marker file:

```bash
project_hash=$(echo "$PWD" | md5sum 2>/dev/null | cut -d' ' -f1 || echo "$PWD" | md5 2>/dev/null || echo "default")
touch "${TMPDIR:-/tmp}/claude-tests-ran-$(date +%Y%m%d)-${project_hash:0:8}"
```

This marker prevents the Stop hook from blocking session exit.

## Report Format

If tests pass:
```
Tests passed. Ready to proceed.
```

If tests fail:
```
Tests failed:
- [file:line] Error description

Fix required before proceeding.
```

If no test framework:
```
No test framework detected. Consider adding tests for: [changed files]
```

## When to Trigger

- After EVERY `Edit` or `Write` tool use on code files
- When user says "done", "finished", "complete"
- Before any git operations (commit, push, PR)
