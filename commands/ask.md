---
name: ask
description: Quick Q&A about the codebase or external libraries. Does not modify any code. Uses Research Agent and Context Manager.
tools: Read, Search
---

# ❓ Ask Command

## Usage

```
/claude-vibe-flow:ask "Your question"
```

## Workflow

1.  **Routing**
    - If the question is about **external libs**: Triggers `research-agent` (uses Context7).
    - If the question is about **internal code**: Triggers `context-manager`.

2.  **Answer**
    - Provides a concise answer with code pointers or documentation links.
    - No `active_spec.md` update, no coding. Just answers.

## Examples

- `/claude-vibe-flow:ask "How do I use the new AuthProvider?"`
- `/claude-vibe-flow:ask "What is the latest version of React we are using?"`
- `/claude-vibe-flow:ask "Where is the payment validation logic located?"`
