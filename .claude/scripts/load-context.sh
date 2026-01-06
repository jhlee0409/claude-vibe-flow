#!/bin/bash
# load-context.sh - Auto-loads project context on Claude Code session start
# Called by SessionStart hook

set -euo pipefail

# Look for context in .claude-vibe-flow directory (user's project)
CONTEXT_DIR=""
PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$PWD}"

# Check for .claude-vibe-flow in project root
if [[ -d "$PROJECT_ROOT/.claude-vibe-flow" ]]; then
  CONTEXT_DIR="$PROJECT_ROOT/.claude-vibe-flow"
fi

# If no context directory found
if [[ -z "$CONTEXT_DIR" ]]; then
  cat << 'EOF'
{
  "continue": true,
  "suppressOutput": true
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
  "systemMessage": "[vibe-flow] Context directory found but no active_spec.md. Start working or run /plan."
}
EOF
  exit 0
fi

# Read the active spec (limit to first 2000 chars)
SPEC_CONTENT=$(head -c 2000 "$SPEC_FILE")

# Check if content was truncated
FULL_SIZE=$(wc -c < "$SPEC_FILE" | tr -d ' ')
if [[ "$FULL_SIZE" -gt 2000 ]]; then
  SPEC_CONTENT="$SPEC_CONTENT

[... truncated]"
fi

# Build JSON response
if command -v jq &>/dev/null; then
  MESSAGE="[vibe-flow] Restored context:

$SPEC_CONTENT"
  jq -n --arg msg "$MESSAGE" '{continue: true, suppressOutput: false, systemMessage: $msg}'
else
  # Fallback without jq
  ESCAPED=$(echo -n "$SPEC_CONTENT" | sed 's/\\/\\\\/g; s/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
  cat << EOF
{
  "continue": true,
  "suppressOutput": false,
  "systemMessage": "[vibe-flow] Restored context:\\n\\n$ESCAPED"
}
EOF
fi
