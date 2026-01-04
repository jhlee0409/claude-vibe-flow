---
name: research
description: Explicit research command for technical documentation lookup
tools: Read, Grep, Glob, WebSearch, WebFetch
---

# Research Skill

Explicit command for technical research and documentation lookup.

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
3. Search documentation for detected version
4. Deliver inline results with version context

### Latest Mode (--latest)

1. Skip version detection
2. Search for latest available documentation
3. Note that results may not match project version

### Version Mode (--version N)

1. Use specified version
2. Search documentation for that version
3. Warn if different from project version

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

This skill delegates to `research-agent` for execution.

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Package not in project | Use latest, notify user |
| Version not found | Suggest closest available version |
| No results | Expand search, suggest alternatives |
