#!/bin/bash
# check-tests-ran.sh - Blocking hook for Stop event
# Exit code 2 = BLOCK completion (Claude Code convention)
# Exit code 0 = Allow completion

set -euo pipefail

PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$PWD}"

# ============================================
# ESCAPE HATCHES - Allow bypassing test check
# ============================================

# Escape hatch 1: Environment variable
if [[ "${SKIP_TEST_CHECK:-}" = "1" ]]; then
  echo '{"decision": "allow", "reason": "Test check skipped (SKIP_TEST_CHECK=1)"}'
  exit 0
fi

# Escape hatch 2: No code files changed (includes both tracked and untracked files)
changed_files=$(git -C "$PROJECT_ROOT" status --porcelain 2>/dev/null | sed 's/^...//' | sed 's/.* -> //' | sed 's/^"//;s/"$//' || echo "")
code_files=$(echo "$changed_files" | grep -E '\.(ts|tsx|js|jsx|mjs|cjs|vue|svelte|py|go|rs|rb|java|kt|swift|c|cpp|h|hpp|cs|scala|php|lua)$' || echo "")

if [[ -z "$code_files" ]]; then
  # No code changes, allow exit
  echo '{"decision": "allow", "reason": "No code files changed"}'
  exit 0
fi

# Escape hatch 3: No test framework detected
SCRIPT_DIR="$(dirname "$0")"
framework_info=$("$SCRIPT_DIR/detect-test-framework.sh" 2>/dev/null || echo '{"detected": false}')
detected=$(echo "$framework_info" | grep -o '"detected":[^,}]*' | cut -d':' -f2 | tr -d ' ')

if [[ "$detected" != "true" ]]; then
  # No test framework, warn but allow
  echo '{"decision": "allow", "reason": "No test framework detected. Consider adding tests."}'
  exit 0
fi

# ============================================
# TEST CHECK - Verify tests were run
# ============================================

# Check for marker file (set when tests are run)
# Marker format: /tmp/claude-tests-ran-{date}-{project-hash}
project_hash=$(echo "$PROJECT_ROOT" | md5sum 2>/dev/null | cut -d' ' -f1 || echo "$PROJECT_ROOT" | md5 2>/dev/null || echo "default")
test_marker="${TMPDIR:-/tmp}/claude-tests-ran-$(date +%Y%m%d)-${project_hash:0:8}"

if [[ -f "$test_marker" ]]; then
  # Tests were run, clean up marker and allow
  rm -f "$test_marker"
  echo '{"decision": "allow", "reason": "Tests were run this session"}'
  exit 0
fi

# ============================================
# BLOCK - Tests were not run
# ============================================

# Get the test command for the message
test_cmd=$(echo "$framework_info" | grep -o '"command":"[^"]*"' | cut -d'"' -f4)

cat << EOF >&2
{
  "decision": "block",
  "reason": "Code was changed but tests were not run. Please run: $test_cmd"
}
EOF

exit 2
