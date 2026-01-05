---
name: check-mcp
description: Verifies if the standard MCP suite (Context7, GitHub, etc.) is installed and active.
tools: Bash
---

# Check MCP Status

## Usage

```
/claude-vibe-flow:check-mcp
```

## Function

1. **Check Capability**:
    - Try to call `context7` tool (if possible via tool detection or simply checking config).
    - Since agents might not be able to "list tools" directly in all runtimes, this command primarily instructs the user to run the setup script if they feel tools are missing.

2. **Output**:
    - Display the "Vibe Standard Stack" list.
    - Instruct the user to run `sh scripts/setup_vibe.sh` if they haven't.

## Workflow

1. **Assistant Message**:
    "🔎 Checking Vibe Standard Stack..."
    "To ensure I have optimal context, I recommend the following MCP servers:"

2. **List**:
    - **Context7**: For documentation.
    - **GitHub**: For issues.
    - **Sequential Thinking**: For complex problem decomposition.

3. **Actionable Advice**:
    "Run the following command in your terminal to auto-configure these:"

    ```bash
    sh scripts/setup_vibe.sh
    ```
