#!/bin/bash
# load-context.sh - Auto-loads project context on Claude Code session start
# This script is called by the SessionStart hook defined in hooks.json

set -euo pipefail

# Find the project's .claude-vibe-flow directory
# Look in current directory first, then parent directories
find_context_dir() {
  local dir="$PWD"
  while [[ "$dir" != "/" ]]; do
    if [[ -d "$dir/.claude-vibe-flow" ]]; then
      echo "$dir/.claude-vibe-flow"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  return 1
}

CONTEXT_DIR=$(find_context_dir 2>/dev/null || echo "")

# If no context directory found
if [[ -z "$CONTEXT_DIR" ]]; then
  cat << 'EOF'
{
  "continue": true,
  "suppressOutput": false,
  "systemMessage": "[Claude Vibe Flow] No .claude-vibe-flow directory found. Run /claude-vibe-flow:init to set up context management."
}
EOF
  exit 0
fi

SPEC_FILE="$CONTEXT_DIR/active_spec.md"

# If no active spec file
if [[ ! -f "$SPEC_FILE" ]]; then
  cat << 'EOF'
{
  "continue": true,
  "suppressOutput": false,
  "systemMessage": "[Claude Vibe Flow] Context directory exists but no active_spec.md found. Start a new task or run /claude-vibe-flow:sync-context."
}
EOF
  exit 0
fi

# Read the active spec (limit to first 2000 chars to avoid token explosion)
SPEC_CONTENT=$(head -c 2000 "$SPEC_FILE")

# Check if content was truncated
if [[ $(wc -c < "$SPEC_FILE") -gt 2000 ]]; then
  SPEC_CONTENT="$SPEC_CONTENT

[... truncated. Use /claude-vibe-flow:resume for full context]"
fi

# Build JSON response using jq if available, otherwise basic escaping
if command -v jq &>/dev/null; then
  MESSAGE="[Claude Vibe Flow] Restored context from previous session:

$SPEC_CONTENT"
  jq -n --arg msg "$MESSAGE" '{continue: true, suppressOutput: false, systemMessage: $msg}'
else
  # Fallback: basic escaping for systems without jq
  ESCAPED=$(echo -n "$SPEC_CONTENT" | sed 's/\\/\\\\/g; s/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
  cat << EOF
{
  "continue": true,
  "suppressOutput": false,
  "systemMessage": "[Claude Vibe Flow] Restored context from previous session:\\n\\n$ESCAPED"
}
EOF
fi
