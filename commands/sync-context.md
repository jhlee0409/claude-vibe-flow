---
name: sync-context
description: Refresh the codebase context map. Runs the context-manager agent to analyze the current file structure and update .vibe-flow/system_map.md.
tools: Bash
---

# Sync Context

## Usage

```
/claude-vibe-flow:sync-context [path]
```

-   `path` (optional): Specific directory or file to re-scan. If omitted, scans the entire project.

## Workflow

1. **Invoke Agent**: Call `context-manager`.
2. **Pass Arguments**:
    - If `path` is provided, pass `{"target_path": "path"}`.
    - If not, pass `{"target_path": "."}`.
3. **Feedback**:
    - After the agent finishes, output: "✅ System Map Updated."

## Example

User: `/claude-vibe-flow:sync-context`
Assistant: (Calls context-manager) -> "Scanning project root..." -> (Updates system_map.md) -> "✅ System Map Updated."

User: `/claude-vibe-flow:sync-context agents/`
Assistant: (Calls context-manager) -> "Scanning agents/ directory..." -> (Updates system_map.md) -> "✅ System Map Updated."
