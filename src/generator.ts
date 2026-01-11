import type { ProjectInfo } from "./analyzer";

// [NEW] Framework Core Rules (XML Structure for High Performance)
export function generateCvfCoreMd(version: string): string {
  return `<!-- .claude/CVF_CORE.md -->
<!-- 
  🌊 CLAUDE VIBE FLOW CORE RULES
  Version: ${version}
  This file is auto-generated. DO NOT EDIT. 
  Your custom rules should go in CLAUDE.md.
-->

<system_role>
You are an expert AI software engineer using the Claude Vibe Flow framework.
Your goal is to deliver high-quality, production-ready code by orchestrating specialized agents.
</system_role>

<agent_routing_table>
| User Intent | Trigger Keywords | Agent to Invoke |
|-------------|------------------|-----------------|
| Build Product | "build me", "create app", "make a..." | cvf-orchestrator |
| Plan Feature | "plan", "how to", "design" | cvf-planner |
| Fix Bug | "error", "fix", "broken", "debug" | cvf-debugger |
| Apply Change | "apply this", "go ahead", "do it" | cvf-applier (MANDATORY for code changes) |
| Review Code | "review", "check this" | cvf-reviewer |
| Architecture | "structure", "pattern", "system design" | cvf-architect |
| Security | "auth", "secure", "vulnerability" | cvf-security |
| Performance | "slow", "optimize", "speed up" | cvf-performance |
| UI/UX | "style", "design", "layout", "css" | cvf-ui-ux |
| Research | "library", "docs", "best practice" | cvf-researcher |
</agent_routing_table>

<coding_standards>
  <ui_text_rule>
    MUST be in English. (Buttons, Toasts, Labels, Errors, Placeholders).
    Korean is allowed ONLY in comments and documentation.
  </ui_text_rule>
  <type_safety>
    NEVER use \`as any\`, \`@ts-ignore\`, or \`@ts-expect-error\`.
    Fix the root cause or refactor.
  </type_safety>
  <verification>
    ALWAYS run \`lsp_diagnostics\` on changed files.
    Verify with tests if available.
  </verification>
  <security>
    No hardcoded secrets. Use environment variables.
    Validate inputs. Encode outputs.
  </security>
</coding_standards>

<workflow_protocol>
  <step name="Checkpoint">
    Use /rewind (double ESC) or git stash before risky changes.
  </step>
  <step name="Implementation">
    Use cvf-applier for all logic changes > 10 lines or involving multiple files.
    Protocol: Checkpoint -> Analyze -> Assess -> Plan -> Implement -> Verify.
  </step>
  <step name="Verification">
    1. lsp_diagnostics (Zero errors)
    2. Typecheck / Lint
    3. Tests (Pass)
  </step>
</workflow_protocol>

<memory_management>
  If \`.claude/LESSONS.md\` exists, read it to avoid repeating past mistakes.
  Update it when you learn something new about this project.
</memory_management>
`;
}

export function generateClaudeMd(info: ProjectInfo): string {
  const sections = [
    generateHeader(info),
    generateTechStack(info),
    generateQuickReference(info),
    generateDirectoryStructure(info),
    generateUserConventions(),
    generateLinkToCore(),
  ];

  return sections.join("\n\n---\n\n");
}

function generateHeader(info: ProjectInfo): string {
  return `# CLAUDE.md - ${info.name}

> **Note**: This is your project context. Add your team's rules here.
> Core framework rules are loaded from \`.claude/CVF_CORE.md\`.

## Project Overview

${info.description}`;
}

function generateLinkToCore(): string {
  return `## 🌊 Framework Rules

Core rules (Agents, Workflow, Standards) are defined in:
- **[.claude/CVF_CORE.md](.claude/CVF_CORE.md)**

To update the framework:
\`\`\`bash
npx claude-vibe-flow --upgrade
\`\`\``;
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

function generateUserConventions(): string {
  return `## User Conventions

[Add your team's specific coding conventions here]
- e.g. "Use snake_case for database columns"
- e.g. "Always write tests for utils"`;
}

export function generateNewProjectClaudeMd(projectName: string): string {
  return `# CLAUDE.md - ${projectName}

> **Note**: This is your project context. Add your team's rules here.
> Core framework rules are loaded from \`.claude/CVF_CORE.md\`.

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

## User Conventions

[Add your team's specific coding conventions here]
`;
}
