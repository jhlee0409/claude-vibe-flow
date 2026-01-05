---
name: fix-bug
description: Direct pipe to the Issue Fixer agent. Use for bug reports, error logs, and debugging. Skips the planning phase and focuses on Root Cause Analysis.
tools: Bash, Read, Edit
---

# 🐞 Fix Bug Command

## Usage

```
/claude-vibe-flow:fix-bug "Error message or bug description"
```

## Workflow

1.  **Context Loading**
    - The `issue-fixer` agent is immediately summoned.
    - If you provided an Issue ID (e.g., `#123`), the agent will use **GitHub MCP** to fetch details.

2.  **Analysis Phase**
    - The agent performs Root Cause Analysis (RCA).
    - It may ask for error logs or reproduction steps if not provided.

3.  **Fix Phase**
    - The agent proposes a minimal patch.
    - Verification tests are run (or created).

## Examples

- `/claude-vibe-flow:fix-bug "Login fails with 500 error"`
- `/claude-vibe-flow:fix-bug "Fix issue #42"`
- `/claude-vibe-flow:fix-bug "Memory leak in video player"`
