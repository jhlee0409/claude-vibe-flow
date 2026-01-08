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

**Reference**: See CLAUDE.md "제안사항 실행 프로토콜" for full protocol details.

---

## Checklist

### 1. Diagnostics (REQUIRED)

Run `lsp_diagnostics` on ALL changed files:

```bash
git status --porcelain | sed 's/^...//' | sed 's/.* -> //' | sed 's/^"//;s/"$//' | xargs -I {} echo "Check: {}"
```

For each file, run `lsp_diagnostics`. Block if ANY errors exist.

---

### 2. Tests (RECOMMENDED)

If project has test framework:
- Run tests using `bash .claude/scripts/run-tests.sh`
- Report results but don't block commit

---

### 3. Security Verification (REQUIRED for auth/data changes)

**OpenSSF Security Guide 기반**

#### 3.1 Secret Detection (BLOCKING)

Scan for hardcoded secrets in changed files:

```bash
# Check for common secret patterns
git diff --cached --name-only | xargs grep -l -E "(password|secret|api_key|apikey|token|credential|private_key)" 2>/dev/null || true
```

**Block if found:**
- Hardcoded passwords: `password = "..."`, `pwd: "..."`
- API keys: `api_key`, `apiKey`, `API_KEY` with literal values
- Tokens: `token = "..."`, `bearer ...`
- Private keys: `-----BEGIN.*PRIVATE KEY-----`

**Exceptions (don't block):**
- Environment variable references: `process.env.API_KEY`
- Config file templates with placeholders: `${API_KEY}`
- Test fixtures with obvious fake values: `"test-password"`, `"fake-token"`

#### 3.2 Dependency Vulnerability Check (WARNING)

If `package.json` or `package-lock.json` changed:

```bash
npm audit --audit-level=high 2>/dev/null || echo "npm audit not available"
```

| Severity | Action |
|----------|--------|
| Critical | BLOCK - must fix before commit |
| High | WARN - strongly recommend fixing |
| Medium/Low | INFO - note in output |

#### 3.3 Security Anti-Patterns (WARNING)

Check for risky patterns in changed files:

| Pattern | Risk | Check |
|---------|------|-------|
| `eval()` | Code injection | `grep -n "eval("` |
| `innerHTML =` | XSS | `grep -n "innerHTML"` |
| SQL string concat | SQL injection | `grep -n "SELECT.*\+\|INSERT.*\+"` |
| `dangerouslySetInnerHTML` | XSS (React) | `grep -n "dangerouslySetInnerHTML"` |
| `// @ts-ignore` | Type safety bypass | `grep -n "@ts-ignore"` |
| `as any` | Type safety bypass | `grep -n "as any"` |

---

### 4. TODOs (REQUIRED)

Run `todoread`:
- All items should be `completed` or `cancelled`
- If `in_progress` or `pending` items exist, ask user to resolve

---

### 5. Formatting (OPTIONAL)

If project has formatter configured:
- Check `package.json` for prettier/eslint
- Run formatter on changed files

---

## Output Format

```markdown
## Pre-Commit Verification

| Check | Status |
|-------|--------|
| Diagnostics | ✅ PASS / ❌ FAIL (N errors) |
| Tests | ✅ PASS / ⚠️ NOT RUN / ❌ FAIL |
| Security - Secrets | ✅ CLEAR / ❌ BLOCKED (found N) |
| Security - Deps | ✅ CLEAR / ⚠️ N vulnerabilities |
| Security - Patterns | ✅ CLEAR / ⚠️ N warnings |
| TODOs | ✅ PASS / ⚠️ N pending |
| Format | ✅ PASS / ⏭️ SKIPPED |

**Result**: ✅ Ready to commit / ❌ BLOCKED: [reason]
```

---

## Blocking Conditions (HARD STOP)

DO NOT proceed with commit if ANY:
- `lsp_diagnostics` shows errors (warnings OK)
- Hardcoded secrets detected
- Critical dependency vulnerabilities
- Critical TODOs are `in_progress`

---

## Warning Conditions (Proceed with Caution)

Warn but allow commit:
- Tests not run (user's choice)
- Tests failing (warn, allow if user confirms)
- High-severity dependency vulnerabilities
- Security anti-patterns detected (eval, innerHTML, etc.)

---

## Escape Hatch

If user explicitly says "commit anyway" or "force commit":
- Warn about ALL skipped checks
- List specific risks being accepted
- Proceed with commit

**Exception**: Secret detection CANNOT be bypassed unless user explicitly confirms the "secret" is a false positive (e.g., test fixture).
