---
name: resume
description: Manually load the active context from .claude-vibe-flow/active_spec.md. Use this if the SessionStart hook didn't run or you need to refresh context mid-session.
tools: Read, Bash
---

# Resume Context

## Usage

```
/claude-vibe-flow:resume
```

## Workflow

1. **Locate Context Directory**: Find `.claude-vibe-flow/` in the current project.
2. **Read Active Spec**: Load `.claude-vibe-flow/active_spec.md` if it exists.
3. **Display Context**: Show the user a summary of the restored context.
4. **Handle Missing**: If no active_spec.md exists, inform the user and suggest next steps.

## Behavior

### If active_spec.md exists:
```
[Claude Vibe Flow] Context restored from .claude-vibe-flow/active_spec.md

## Current Task
[Summary of what was being worked on]

## Recent Progress
[Key items from the spec]

Ready to continue. What would you like to do next?
```

### If active_spec.md does not exist:
```
[Claude Vibe Flow] No active context found.

Options:
- Run /claude-vibe-flow:init to initialize context management
- Run /claude-vibe-flow:new-feature to start a new task
- Describe what you were working on and I'll help you continue
```

## Notes

- The SessionStart hook (`scripts/load-context.sh`) automatically runs this on session start.
- Use this command manually if:
  - You switched projects mid-session
  - The automatic hook didn't load context
  - You want to refresh/reload context
