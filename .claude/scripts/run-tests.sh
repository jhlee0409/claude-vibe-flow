#!/bin/bash
# run-tests.sh - Runs tests and creates marker file on success
# This is the recommended way to run tests in claude-vibe-flow
# Automatically creates marker file so Stop hook doesn't block

set -euo pipefail

PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$PWD}"
SCRIPT_DIR="$(dirname "$0")"

# ============================================
# DETECT TEST FRAMEWORK
# ============================================

framework_info=$("$SCRIPT_DIR/detect-test-framework.sh" 2>/dev/null || echo '{"detected": false}')
detected=$(echo "$framework_info" | grep -o '"detected":[^,}]*' | cut -d':' -f2 | tr -d ' ')
test_cmd=$(echo "$framework_info" | grep -o '"command":"[^"]*"' | cut -d'"' -f4)
framework=$(echo "$framework_info" | grep -o '"framework":"[^"]*"' | cut -d'"' -f4)

if [[ "$detected" != "true" ]]; then
  echo "[vibe-flow] No test framework detected."
  echo "To add a custom test command, create: .claude-vibe-flow/test-command.txt"
  exit 0
fi

echo "[vibe-flow] Detected: $framework"
echo "[vibe-flow] Running: $test_cmd"
echo ""

# ============================================
# RUN TESTS
# ============================================

cd "$PROJECT_ROOT"

set +e
eval "$test_cmd"
test_exit_code=$?
set -e

echo ""

# ============================================
# CREATE MARKER ON SUCCESS
# ============================================

if [[ $test_exit_code -eq 0 ]]; then
  # Generate project hash (compatible with macOS and Linux)
  project_hash=$(echo "$PROJECT_ROOT" | md5sum 2>/dev/null | cut -d' ' -f1 || echo "$PROJECT_ROOT" | md5 2>/dev/null || echo "default")
  test_marker="${TMPDIR:-/tmp}/claude-tests-ran-$(date +%Y%m%d)-${project_hash:0:8}"
  
  touch "$test_marker"
  
  echo "[vibe-flow] ✓ Tests passed. Marker created."
  echo "[vibe-flow] You can now exit the session without being blocked."
  exit 0
else
  echo "[vibe-flow] ✗ Tests failed (exit code: $test_exit_code)"
  echo "[vibe-flow] Fix the failing tests before completing your session."
  exit $test_exit_code
fi
