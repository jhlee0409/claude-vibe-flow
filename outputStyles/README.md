# Output Styles

Optional quality styles that can be activated per-project to enhance code quality checks.

## Available Styles

| Style | Purpose | Best For |
|-------|---------|----------|
| `production-ready` | Deployment quality checks | Production services |
| `frontend-quality` | SEO, a11y, performance | Web applications |
| `security-hardened` | Comprehensive security | APIs, auth systems |

## Usage

Reference styles in your project's `CLAUDE.md`:

```markdown
## Output Styles
- production-ready
- frontend-quality
```

## Style Behavior

When a style is active:
1. `vibe-implementer` applies style patterns during coding
2. `code-reviewer` includes style checks in reviews
3. `architect` considers style constraints in decisions

## Creating Custom Styles

Create a new `.md` file in `outputStyles/` following the format:

```markdown
# Style Name

> Brief description of when to use this style

## Checklist
- [ ] Item 1
- [ ] Item 2

## Integration Points
| Agent | Behavior |
|-------|----------|
| agent-name | What it does |
```
