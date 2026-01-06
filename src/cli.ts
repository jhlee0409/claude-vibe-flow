#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const REPO = "jhlee0409/claude-vibe-flow";
const BRANCH = "main";
const TARBALL_URL = `https://github.com/${REPO}/archive/${BRANCH}.tar.gz`;

const MIN_NODE_VERSION = 20;
const RECOMMENDED_NODE_VERSION = 22;

const INSTALL_ITEMS = [".claude", ".mcp.json"] as const;

enum ErrorCode {
  SUCCESS = 0,
  NETWORK_ERROR = 10,
  FILE_SYSTEM_ERROR = 20,
  PERMISSION_ERROR = 21,
  DEPENDENCY_ERROR = 30,
  NODE_VERSION_ERROR = 31,
  UNKNOWN_ERROR = 99,
}

interface CliError extends Error {
  code: ErrorCode;
  suggestion: string;
  details?: Record<string, unknown>;
}

function isCliError(error: unknown): error is CliError {
  return (
    error instanceof Error &&
    "code" in error &&
    "suggestion" in error &&
    typeof (error as CliError).code === "number"
  );
}

function createError(
  code: ErrorCode,
  message: string,
  suggestion: string,
  details?: Record<string, unknown>
): CliError {
  const error = new Error(message) as CliError;
  error.code = code;
  error.suggestion = suggestion;
  error.details = details;
  return error;
}

function handleError(error: unknown, tempDir?: string): never {
  if (tempDir) {
    cleanupTempDir(tempDir);
  }

  if (isCliError(error)) {
    console.error(`\n❌ ${error.message}\n`);
    console.error(`💡 Suggestion: ${error.suggestion}`);
    if (error.details && process.env.DEBUG) {
      console.error("\n📋 Debug info:", JSON.stringify(error.details, null, 2));
    }
    process.exit(error.code);
  }

  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n❌ Unexpected error: ${message}`);
  console.error("💡 Suggestion: Run with DEBUG=1 for more info");
  process.exit(ErrorCode.UNKNOWN_ERROR);
}

type Command = "help" | "--help" | "-h" | "--version" | "-v" | undefined;

function main(): void {
  try {
    checkNodeVersion();

    console.log("🌊 Claude Vibe Flow\n");

    const command = process.argv[2] as Command;

    switch (command) {
      case "help":
      case "--help":
      case "-h":
        showHelp();
        break;
      case "--version":
      case "-v":
        showVersion();
        break;
      default:
        runInstall();
    }
  } catch (error) {
    handleError(error);
  }
}

function checkNodeVersion(): void {
  const currentVersion = parseInt(process.versions.node.split(".")[0], 10);

  if (currentVersion < MIN_NODE_VERSION) {
    throw createError(
      ErrorCode.NODE_VERSION_ERROR,
      `Node.js ${process.versions.node} is not supported`,
      `Upgrade to Node.js v${RECOMMENDED_NODE_VERSION}+ using nvm, brew, or https://nodejs.org/`,
      {
        currentVersion: process.versions.node,
        minimumRequired: `${MIN_NODE_VERSION}.0.0`,
        recommended: `${RECOMMENDED_NODE_VERSION}.0.0`,
      }
    );
  }

  if (currentVersion < RECOMMENDED_NODE_VERSION) {
    console.warn(
      `⚠️  Node.js ${process.versions.node} is supported but v${RECOMMENDED_NODE_VERSION}+ is recommended.\n`
    );
  }
}

function showHelp(): void {
  console.log(`Usage: npx claude-vibe-flow

Installs Claude Vibe Flow into your project:
  .claude/
  ├── agents/     (9 specialized agents)
  ├── commands/   (5 workflow commands)
  ├── skills/     (verify-before-commit)
  ├── scripts/    (test runner, framework detection)
  └── hooks.json  (SessionStart hook)
  .mcp.json       (MCP servers config)

Features:
  - 9 agents: orchestrator, planner, reviewer, debugger, architect,
              security, performance, researcher, ui-ux
  - 5 commands: /cvf:plan, /cvf:review, /cvf:ship, /cvf:check, /cvf:workflow
  - Pre-commit verification (diagnostics, tests, TODOs)
  - Vibe coding support (natural language to shipped product)

Options:
  --help, -h      Show this help message
  --version, -v   Show version number

Environment:
  DEBUG=1         Show detailed error information

Examples:
  npx claude-vibe-flow          # Install to current directory
  npx claude-vibe-flow --help   # Show this help
  DEBUG=1 npx claude-vibe-flow  # Install with debug output
`);
}

function showVersion(): void {
  const pkg = require("../package.json");
  console.log(`v${pkg.version}`);
}

function checkDependencies(): void {
  const deps = [
    {
      name: "curl",
      installHint: "brew install curl (macOS) or apt install curl (Linux)",
    },
    {
      name: "tar",
      installHint: "tar should be pre-installed. Try: apt install tar (Linux)",
    },
  ];

  for (const dep of deps) {
    try {
      execSync(`which ${dep.name}`, { stdio: "ignore" });
    } catch {
      throw createError(
        ErrorCode.DEPENDENCY_ERROR,
        `Required command '${dep.name}' is not found`,
        dep.installHint,
        { command: dep.name, platform: process.platform }
      );
    }
  }
}

function cleanupTempDir(tempDir: string): void {
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (_cleanupError) {
    void _cleanupError;
  }
}

function runInstall(): void {
  console.log("📦 Installing Claude Vibe Flow...\n");

  checkDependencies();

  const cwd = process.cwd();
  const tempDir = `/tmp/claude-vibe-flow-${Date.now()}`;

  try {
    fs.mkdirSync(tempDir, { recursive: true });
  } catch (error) {
    throw createError(
      ErrorCode.FILE_SYSTEM_ERROR,
      "Failed to create temporary directory",
      `Check disk space and permissions for /tmp`,
      { tempDir, error: String(error) }
    );
  }

  try {
    console.log("📥 Downloading from GitHub...");
    execSync(`curl -fsSL ${TARBALL_URL} | tar -xz -C ${tempDir}`, {
      stdio: ["inherit", "inherit", "pipe"],
    });
  } catch (error) {
    throw createError(
      ErrorCode.NETWORK_ERROR,
      "Failed to download from GitHub",
      "Check your internet connection. If behind a proxy, configure HTTP_PROXY.",
      { url: TARBALL_URL, error: String(error) }
    );
  }

  const extractedDir = `${tempDir}/claude-vibe-flow-${BRANCH}`;

  if (!fs.existsSync(extractedDir)) {
    throw createError(
      ErrorCode.FILE_SYSTEM_ERROR,
      "Downloaded archive has unexpected structure",
      "Try again later or report this issue on GitHub.",
      { expectedDir: extractedDir }
    );
  }

  console.log("📁 Copying files...\n");

  let installed = 0;
  let skipped = 0;

  for (const item of INSTALL_ITEMS) {
    const src = path.join(extractedDir, item);
    const dest = path.join(cwd, item);

    if (fs.existsSync(src)) {
      if (fs.existsSync(dest)) {
        console.log(`   ⚠️  ${item} (exists, skipped)`);
        skipped++;
      } else {
        try {
          fs.cpSync(src, dest, { recursive: true });
          console.log(`   ✅ ${item}`);
          installed++;
        } catch (error) {
          throw createError(
            ErrorCode.PERMISSION_ERROR,
            `Failed to copy ${item} to project`,
            `Check write permissions: ls -la ${cwd}`,
            { src, dest, error: String(error) }
          );
        }
      }
    }
  }

  cleanupTempDir(tempDir);

  console.log(`
✨ Done! (${installed} installed, ${skipped} skipped)

Next steps:
  1. Run Claude Code:  claude
  2. Start planning:   /plan "Your feature idea"
  3. Ship when ready:  /ship

MCP servers (Context7, GitHub) will auto-start.
`);
}

main();
