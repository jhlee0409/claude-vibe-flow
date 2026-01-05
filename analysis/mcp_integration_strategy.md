# MCP Integration Strategy for Claude Vibe Flow

## 1. Philosophy: Claude Code Native
We are doubling down on **Claude Code** as our runtime environment. Claude Code is inherently built on the **Model Context Protocol (MCP)**.
Instead of treating MCP as an "external" thing, we should treat it as the **native API** of our environment.

## 2. Learning from Oh My OpenCode (The "Forced" MCP approach)
"Oh My OpenCode" mandates specific tools/servers to guarantee agent capabilities.
-   **Pros**: Deterministic behavior. Agents *know* they have `ast-grep` or `postgres-client`.
-   **Cons**: High barrier to entry. User must verify setup.

## 3. The Vibe Flow Strategy: "Progressive Enhancement"
We will avoid "Hard Blocking" users who don't have extra MCP servers, but we will "Strongly Recommend" them.

### A. The Core Suite (Built-in)
Claude Code already provides:
-   `bash` (Terminal)
-   `fs` (Filesystem)
-   `glob` (Search)
-   `grep` (Search)
-   `edit` (Modification)

**Strategy**: Vibe Flow agents must be optimized to use these *natively* and *perfectly*.
-   *Example*: `context-manager` currently uses `ls` and `read`. We can optimize it to use `glob` and `grep` which are faster and token-efficient.

### B. The Extended Suite (Recommended External MCP)
We will define a "Standard Vibe Stack" that agents will prefer.

1.  **Documentation & Config**: **[Context7](https://github.com/upstash/context7)**
    -   *Why*: Prevents hallucinated configs.
    -   *Enforcement*: `research-agent` and `architect` must use `context7` tool if available for library research.
2.  **Issue Tracking**: **[@modelcontextprotocol/server-github](https://github.com/modelcontextprotocol/servers/tree/main/src/github)**
    -   *Why*: Direct access to issues/PRs.
    -   *Enforcement*: `issue-fixer` checks this before asking user for context.
3.  **Database**: **[@modelcontextprotocol/server-postgres](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)**
    -   *Why*: Schema awareness.

### C. Handling "Enforcement" (Soft vs Hard)
We will use a **"Capability-Based Routing"** pattern.

#### Pattern: The "Best Tool or Bust" Check
In our agent definitions (PROMPTS), we will add strict instructions:

> "Check if the `context7` tool is available.
> - **IF YES**: You MUST use it to find the latest documentation. Do NOT hallucinate.
> - **IF NO**: Warn the user: '⚠️ Context7 not found. I will rely on my internal knowledge, which may be outdated.'"

This effectively "forces" the user to install it if they want reliable results, aligning with the "Claude Code Native" philosophy.

## 4. Implementation Steps

1.  **Refactor Agents to be MCP-Aware**:
    -   Update `context-manager` to explicitly prefer `grep` tool calls over running `grep` in `bash` (if distinct tools exist, usually Claude Code uses bash tools, but we can structure prompts to use them efficiently).
    -   *Correction*: Claude Code exposes these as *tools*. Our prompts must encourage tool usage over blind text generation.

2.  **Create `.vibe-flow/mcp_manifest.json` (Optional)**:
    -   A file describing recommended servers.
    -   `init` or `check-setup` can read this and guide the installation.

3.  **Strict Mode (The "Forced" Part)**:
    -   For **Codebase Analysis**, we *cannot* compromise.
    -   We explicitly rely on `ripgrep` (usually installed in `claude-code` env).
    -   We **Require** `git`.

## 5. Recommendation for "Claude Code Specific"
To fully specialize:
-   **Remove Generic Instructions**: Stop telling agents "You are an AI assistant". Tell them "You are a tool-using agent in Claude Code".
-   **Tool-First Prompting**: "Do not verify by asking. Verify by running `npm test`."
-   **Output Format**: Optimize output for Claude Code's terminal renderer (markdown is good, but concise is better).

---

## Decision
**We will NOT genericize. We will specialize.**
-   **Agents** will assume they are in Claude Code.
-   **Context Manager** will leverage `grep` and `glob` patterns aggressively.
-   **New Command**: `/check-mcp` to validate the environment.
