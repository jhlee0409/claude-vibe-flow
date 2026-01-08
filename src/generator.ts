import type { ProjectInfo } from "./analyzer";

export function generateClaudeMd(info: ProjectInfo): string {
  const sections = [
    generateHeader(info),
    generateTechStack(info),
    generateQuickReference(info),
    generateDirectoryStructure(info),
    generateCodeConventions(info),
    generateCommonPitfalls(),
    generateImplementationProtocol(),
  ];

  return sections.join("\n\n---\n\n");
}

function generateHeader(info: ProjectInfo): string {
  return `# CLAUDE.md - ${info.name}

## Project Overview

${info.description}`;
}

function generateTechStack(info: ProjectInfo): string {
  const { techStack } = info;
  const lines = ["## Tech Stack", ""];

  if (techStack.language.length > 0) {
    lines.push(`- **Language**: ${techStack.language.join(", ")}`);
  }

  if (techStack.framework.length > 0) {
    lines.push(`- **Framework**: ${techStack.framework.join(", ")}`);
  }

  if (techStack.testFramework) {
    lines.push(`- **Test**: ${techStack.testFramework}`);
  }

  if (techStack.packageManager) {
    lines.push(`- **Package Manager**: ${techStack.packageManager}`);
  }

  if (lines.length === 2) {
    lines.push("[TODO: Add tech stack]");
  }

  return lines.join("\n");
}

function generateQuickReference(info: ProjectInfo): string {
  const { scripts, techStack } = info;
  const lines = ["## Quick Reference", "", "```bash"];

  if (Object.keys(scripts).length > 0) {
    const pm = techStack.packageManager || "npm";
    const runCmd = pm === "yarn" ? "yarn" : pm === "pnpm" ? "pnpm" : pm === "bun" ? "bun" : "npm run";

    if (scripts.dev) lines.push(`${runCmd} dev          # Development server`);
    if (scripts.build) lines.push(`${runCmd} build        # Build`);
    if (scripts.test) lines.push(`${runCmd} test         # Run tests`);
    if (scripts.lint) lines.push(`${runCmd} lint         # Lint`);
    if (scripts.typecheck) lines.push(`${runCmd} typecheck    # Type check`);
  } else if (techStack.testFramework) {
    switch (techStack.testFramework) {
      case "pytest":
        lines.push("pytest                # Run tests");
        break;
      case "go test":
        lines.push("go test ./...         # Run tests");
        lines.push("go build              # Build");
        break;
      case "cargo test":
        lines.push("cargo test            # Run tests");
        lines.push("cargo build           # Build");
        break;
      default:
        lines.push("# [TODO: Add commands]");
    }
  } else {
    lines.push("# [TODO: Add commands]");
  }

  lines.push("```");
  return lines.join("\n");
}

function generateDirectoryStructure(info: ProjectInfo): string {
  const lines = ["## Directory Structure", "", "```"];

  if (info.directories.length > 0) {
    for (const dir of info.directories) {
      lines.push(`${dir}/`);
    }
  } else {
    lines.push("[Project directories will appear here]");
  }

  lines.push("```");
  return lines.join("\n");
}

function generateCodeConventions(info: ProjectInfo): string {
  const { techStack } = info;
  const lines = ["## Code Conventions", ""];

  for (const lang of techStack.language) {
    lines.push(`### ${lang}`, "");

    switch (lang) {
      case "TypeScript":
        lines.push(
          "- Strict mode enabled",
          "- No `any` type - use proper types or `unknown`",
          "- Prefer interfaces over type aliases for object shapes",
          ""
        );
        break;
      case "JavaScript":
        lines.push(
          "- Use modern ES6+ syntax",
          "- Prefer const over let",
          ""
        );
        break;
      case "Python":
        lines.push(
          "- Type hints required for function signatures",
          "- Follow PEP 8 style guide",
          "- Use `uv` for package management (not pip directly)",
          ""
        );
        break;
      case "Go":
        lines.push(
          "- Follow Effective Go guidelines",
          "- Always check errors explicitly",
          "- Use context.Context for cancellation",
          ""
        );
        break;
      case "Rust":
        lines.push(
          "- Use Result<T, E> for error handling",
          "- Prefer iterators over explicit loops",
          "- Run `cargo clippy` before commit",
          ""
        );
        break;
      default:
        lines.push("[TODO: Add conventions]", "");
    }
  }

  return lines.join("\n").trim();
}

function generateCommonPitfalls(): string {
  return `## Common Pitfalls

| Area | Avoid | Instead |
|------|-------|---------|
| Type Safety | \`as any\`, \`@ts-ignore\` | Proper type definitions |
| Error Handling | Empty catch blocks | Log or handle errors |
| Async | Sequential awaits | \`Promise.all\` for parallel |
| Testing | Testing implementation details | Test behavior/outcomes |

[Add project-specific pitfalls as discovered]`;
}

function generateImplementationProtocol(): string {
  return `## 🎯 Implementation Protocol

### Before Making Changes

1. **Analyze Impact**: Check affected files with \`grep\`/\`glob\`
2. **Verify Tests Exist**: Identify related test files
3. **Check Patterns**: Read similar code for conventions

### During Implementation

1. **Small Batches**: Max 3 files at a time
2. **Verify Each Change**: Run \`lsp_diagnostics\` after each file
3. **Test Frequently**: Run tests every 3 files

### Before Completing

\`\`\`
□ lsp_diagnostics shows 0 errors
□ All tests pass (npm test / pytest / go test)
□ New code follows existing patterns
□ No \`as any\` or \`@ts-ignore\` added
\`\`\`

### On Failure

\`\`\`
Error occurs → Stop immediately → Analyze root cause → Minimal fix → Re-verify
                      ↓
              Do NOT proceed to next task
\`\`\``;
}

export function generateNewProjectClaudeMd(projectName: string): string {
  return `# CLAUDE.md - ${projectName}

## Project Overview

[TODO: Describe what this project does]

---

## Tech Stack

[TODO: Add after initial setup]
- **Language**: 
- **Framework**: 
- **Test**: 

---

## Quick Reference

\`\`\`bash
# [TODO: Add commands after setup]
\`\`\`

---

## Directory Structure

\`\`\`
[Will be populated as project grows]
\`\`\`

---

## Code Conventions

[TODO: Define as patterns emerge]

---

## Common Pitfalls

| Area | Avoid | Instead |
|------|-------|---------|
| Type Safety | \`as any\`, \`@ts-ignore\` | Proper type definitions |
| Error Handling | Empty catch blocks | Log or handle errors |

---

## 🎯 Implementation Protocol

### Before Making Changes

1. **Analyze Impact**: Check affected files with \`grep\`/\`glob\`
2. **Verify Tests Exist**: Identify related test files
3. **Check Patterns**: Read similar code for conventions

### During Implementation

1. **Small Batches**: Max 3 files at a time
2. **Verify Each Change**: Run \`lsp_diagnostics\` after each file
3. **Test Frequently**: Run tests every 3 files

### Before Completing

\`\`\`
□ lsp_diagnostics shows 0 errors
□ All tests pass
□ New code follows existing patterns
\`\`\`

### On Failure

\`\`\`
Error occurs → Stop immediately → Analyze root cause → Minimal fix → Re-verify
\`\`\``;
}
