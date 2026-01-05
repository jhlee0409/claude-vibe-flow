---
name: commit-push-pr
description: Commit all changes, push to remote, and create a pull request in one command
---

# Commit, Push, and Create PR

A streamlined workflow command that handles the entire git workflow in one shot.

## Usage

```bash
/claude-vibe-flow:commit-push-pr [PR title]
```

## Workflow

1. **Stage Changes**: `git add -A`
2. **Generate Commit Message**: Analyze changes and create a conventional commit message
3. **Commit**: `git commit -m "<message>"`
4. **Push**: `git push -u origin <current-branch>`
5. **Create PR**: `gh pr create --fill` or with provided title

## Examples

```bash
# Auto-generate PR title from commits
/claude-vibe-flow:commit-push-pr

# With specific PR title
/claude-vibe-flow:commit-push-pr "Add JWT authentication feature"
```

## Requirements

- GitHub CLI (`gh`) must be installed and authenticated
- Remote repository must be configured

## Commit Message Format

Follows conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `docs:` Documentation
- `test:` Tests
- `chore:` Maintenance

## Error Handling

- If no changes to commit, skips to PR creation
- If branch already has open PR, shows existing PR URL
- If push fails, shows error and suggests fixes
