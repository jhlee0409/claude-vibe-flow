# Contributing to Vibe Flow

First off, thanks for taking the time to contribute! Flow with the vibe. 🌊

## Core Philosophy

1.  **Vibe Code Only**: We prioritize "Flow" over "Feature". Does this change make the developer feel more powerful?
2.  **MCP First**: If you are adding a capability, try to use an MCP server instead of a complex script.
3.  **No Context Dump**: Agents must use `Context7` or `Context Manager` to read files. Do not dump 100 files into the context window.

## How to Contribute

1.  **Fork the repo** and create your branch from `main`.
2.  **Add your Feature/Agent**.
    - Agents go in `agents/`.
    - Commands go in `commands/`.
3.  **Run Validation**.
    - `claude plugin validate ./`
4.  **Submit a Pull Request**.

## Developing Agents

- Use the `.md` format for agents.
- Always specify `tools:` explicitly.
- Check `analysis/claude_code_system_prompt.md` to understand the environment.
