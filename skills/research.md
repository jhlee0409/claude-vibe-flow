---
name: research
description: Explicit research command for technical documentation lookup with parallel multi-source search. MUST BE USED when user needs external documentation, library APIs, or version-specific technical information.
category: skill
keyTrigger: "Documentation lookup needed → Parallel multi-source search"
tools: Read, Grep, Glob, WebSearch, WebFetch, task
---

# Research Skill

Explicit command for technical research and documentation lookup.

## Triggers

### When to Invoke
- User asks "how do I use [library]?" or "what's the API for [package]?"
- Need to look up external documentation for unfamiliar libraries
- Version-specific behavior questions (e.g., "React 18 vs 19 differences")
- Best practices or patterns for specific frameworks

### Avoid When
- Answer is already in the codebase (use Grep/Read instead)
- Question is about project-specific code, not library APIs
- Simple syntax questions that don't need documentation lookup

## Usage

```bash
/research [query]
/research --latest [query]
/research --version [N] [query]
```

## Options

| Option | Description | Example |
|--------|-------------|---------|
| (none) | Research using detected project version | `/research React hooks` |
| `--latest` | Research using latest version | `/research --latest Next.js app router` |
| `--version N` | Research using specific version | `/research --version 17 React lifecycle` |
| `--deep` | Extended parallel search with more sources | `/research --deep GraphQL best practices` |

> **Note**: All modes use parallel multi-source search by default. The `--deep` option adds additional sources like Stack Overflow, Dev.to, and community blogs.

## Examples

```bash
# Basic usage (auto-detects project version)
/research React Server Components
/research Django ORM relationships
/research Express middleware patterns

# Latest version (ignores project version)
/research --latest TypeScript 5.0 features
/research --latest Python 3.12 new syntax

# Specific version
/research --version 18 React concurrent features
/research --version 4 Vue composition API
```

## Behavior

### Default Mode (No Options)

1. Detect project dependencies via package files
2. Find queried package in dependencies
3. **PARALLEL SEARCH**: Fire multiple sources simultaneously
4. Deliver inline results with version context

### Latest Mode (--latest)

1. Skip version detection
2. **PARALLEL SEARCH**: Query all sources for latest docs
3. Note that results may not match project version

### Version Mode (--version N)

1. Use specified version
2. **PARALLEL SEARCH**: Query version-specific documentation
3. Warn if different from project version

### Parallel Execution (ALL MODES)

```
┌─────────────────────────────────────────────────────┐
│ PARALLEL SEARCH SOURCES (fired simultaneously)      │
├─────────────────────────────────────────────────────┤
│ 1. Cache check (.claude-vibe-flow/research_cache/)  │
│ 2. Context7 MCP (if available)                      │
│ 3. WebSearch (official docs)                        │
│ 4. GitHub examples (via librarian agent)            │
└─────────────────────────────────────────────────────┘
                         ↓
         First valid result used immediately
         Additional results merged for completeness
```

**Performance**: 2-3x faster than sequential search

## Output Format

```markdown
## Research: [Query]

**Package**: [name]@[version]
**Source**: Project dependency | Latest | Specified

[Research results with code examples]

---
Sources:
- [Source 1](url)
- [Source 2](url)
```

## Delegation

## Delegation

This skill delegates to `research-agent` for execution.
Reliable execution depends on the **Context7 MCP** (part of Vibe Standard Stack).

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Package not in project | Use latest, notify user |
| Version not found | Suggest closest available version |
| No results | Expand search, suggest alternatives |
