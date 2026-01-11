#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import readline from "readline";
import { analyzeProject } from "./analyzer";
import { generateClaudeMd, generateNewProjectClaudeMd, generateCvfCoreMd } from "./generator";

const REPO = "jhlee0409/claude-vibe-flow";
const BRANCH = "main";
const TARBALL_URL = `https://github.com/${REPO}/archive/${BRANCH}.tar.gz`;

const MIN_NODE_VERSION = 20;
const RECOMMENDED_NODE_VERSION = 22;

// [MODIFIED] Install items are handled individually now
const FRAMEWORK_DIRS = ["agents", "commands", "skills", "scripts"];
const JSON_CONFIGS = ["hooks.json", ".mcp.json"];

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

type Command = "help" | "--help" | "-h" | "--version" | "-v" | "--upgrade" | undefined;

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
  console.log(`Usage: npx claude-vibe-flow [command]

Installs or updates Claude Vibe Flow in your project.

Commands:
  (default)       Install or update framework files
  --upgrade       Force update framework files (same as default)
  --help, -h      Show this help message
  --version, -v   Show version number

Features:
  - Smart Merge: Updates agents/skills but preserves your CLAUDE.md
  - Core Rules: Installs .claude/CVF_CORE.md for better AI context
  - 10 Agents: orchestrator, planner, applier, reviewer, etc.
  - 5 Commands: /cvf:plan, /cvf:ship, etc.

Environment:
  DEBUG=1         Show detailed error information
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
  } catch {
    void 0;
  }
}

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function askProjectType(): Promise<"existing" | "new"> {
  console.log("📋 Project Setup\n");
  console.log("   1. Existing project (analyze codebase)");
  console.log("   2. New project (start fresh)\n");

  const answer = await askQuestion("   Choose (1 or 2): ");

  if (answer === "2" || answer === "new" || answer === "n") {
    return "new";
  }
  return "existing";
}

// [NEW] Smart Merge for JSON Configs
function mergeJsonConfig(srcPath: string, destPath: string): void {
  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`   ✅ ${path.basename(destPath)} (created)`);
    return;
  }

  try {
    const srcContent = JSON.parse(fs.readFileSync(srcPath, "utf-8"));
    const destContent = JSON.parse(fs.readFileSync(destPath, "utf-8"));
    let merged = false;

    // Merge Arrays (Union)
    for (const key in srcContent) {
      if (Array.isArray(srcContent[key]) && Array.isArray(destContent[key])) {
        const existing = new Set(destContent[key].map((i: any) => JSON.stringify(i)));
        for (const item of srcContent[key]) {
          const str = JSON.stringify(item);
          if (!existing.has(str)) {
            destContent[key].push(item);
            merged = true;
          }
        }
      } 
      // Merge Objects (Shallow merge, preserve user keys)
      else if (typeof srcContent[key] === "object" && srcContent[key] !== null && !Array.isArray(srcContent[key])) {
        if (!destContent[key]) {
          destContent[key] = srcContent[key];
          merged = true;
        } else {
          for (const subKey in srcContent[key]) {
            if (!destContent[key][subKey]) {
              destContent[key][subKey] = srcContent[key][subKey];
              merged = true;
            }
          }
        }
      }
    }

    if (merged) {
      fs.writeFileSync(destPath, JSON.stringify(destContent, null, 2), "utf-8");
      console.log(`   🔄 ${path.basename(destPath)} (merged)`);
    } else {
      console.log(`   ✨ ${path.basename(destPath)} (up to date)`);
    }
  } catch (error) {
    console.warn(`   ⚠️  Failed to merge ${path.basename(destPath)}, skipping.`);
  }
}

// [NEW] Recursive Directory Install
function installDirectory(srcDir: string, destDir: string): void {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const items = fs.readdirSync(srcDir);
  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      installDirectory(srcPath, destPath);
    } else {
      // Always overwrite framework files (agents, commands, etc.)
      fs.copyFileSync(srcPath, destPath);
      // console.log(`   ✅ ${path.relative(process.cwd(), destPath)}`);
    }
  }
}

function generateClaudeMdFile(cwd: string, projectType: "existing" | "new"): void {
  const claudeMdPath = path.join(cwd, "CLAUDE.md");

  // [MODIFIED] Never overwrite CLAUDE.md if it exists
  if (fs.existsSync(claudeMdPath)) {
    console.log("   ✨ CLAUDE.md (exists, preserved)");
    return;
  }

  let content: string;

  if (projectType === "existing") {
    console.log("   🔍 Analyzing codebase...");
    const projectInfo = analyzeProject(cwd);
    content = generateClaudeMd(projectInfo);
    console.log(`   ✅ CLAUDE.md (generated from ${projectInfo.techStack.language.join(", ")} project)`);
  } else {
    const projectName = path.basename(cwd);
    content = generateNewProjectClaudeMd(projectName);
    console.log("   ✅ CLAUDE.md (template for new project)");
  }

  try {
    fs.writeFileSync(claudeMdPath, content, "utf-8");
  } catch (error) {
    throw createError(
      ErrorCode.FILE_SYSTEM_ERROR,
      "Failed to write CLAUDE.md",
      `Check write permissions: ls -la ${cwd}`,
      { path: claudeMdPath, error: String(error) }
    );
  }
}

// [NEW] Generate CVF_CORE.md
function generateCoreFile(cwd: string): void {
  const corePath = path.join(cwd, ".claude", "CVF_CORE.md");
  const pkg = require("../package.json");
  const content = generateCvfCoreMd(pkg.version);
  
  // Ensure .claude exists
  if (!fs.existsSync(path.dirname(corePath))) {
    fs.mkdirSync(path.dirname(corePath), { recursive: true });
  }

  fs.writeFileSync(corePath, content, "utf-8");
  console.log("   ✅ .claude/CVF_CORE.md (updated)");
}

// [NEW] Generate Version File
function generateVersionFile(cwd: string): void {
  const versionPath = path.join(cwd, ".claude", ".cvf-version");
  const pkg = require("../package.json");
  const content = JSON.stringify({
    version: pkg.version,
    installedAt: new Date().toISOString()
  }, null, 2);

  fs.writeFileSync(versionPath, content, "utf-8");
}

async function runInstall(): Promise<void> {
  console.log("📦 Installing Claude Vibe Flow...\n");

  checkDependencies();

  const cwd = process.cwd();
  // Only ask project type if CLAUDE.md doesn't exist
  let projectType: "existing" | "new" = "existing";
  if (!fs.existsSync(path.join(cwd, "CLAUDE.md"))) {
    projectType = await askProjectType();
  }

  console.log("");

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

  console.log("📁 Updating framework files...\n");

  // 1. Install Framework Directories (.claude/agents, etc.)
  const claudeDir = path.join(cwd, ".claude");
  if (!fs.existsSync(claudeDir)) fs.mkdirSync(claudeDir);

  for (const dir of FRAMEWORK_DIRS) {
    const src = path.join(extractedDir, ".claude", dir);
    const dest = path.join(claudeDir, dir);
    if (fs.existsSync(src)) {
      installDirectory(src, dest);
      console.log(`   ✅ .claude/${dir}/ (updated)`);
    }
  }

  // 2. Generate Core Rules
  generateCoreFile(cwd);

  // 3. Smart Merge JSON Configs
  for (const config of JSON_CONFIGS) {
    // hooks.json is in .claude/, .mcp.json is in root
    const isMcp = config === ".mcp.json";
    const src = path.join(extractedDir, isMcp ? "" : ".claude", config);
    const dest = path.join(cwd, isMcp ? "" : ".claude", config);
    
    if (fs.existsSync(src)) {
      mergeJsonConfig(src, dest);
    }
  }

  // 4. Handle CLAUDE.md (User Context)
  generateClaudeMdFile(cwd, projectType);

  // 5. Version Tracking
  generateVersionFile(cwd);

  cleanupTempDir(tempDir);

  console.log(`
✨ Done! Framework updated to v${require("../package.json").version}

Next steps:
  1. Run Claude Code:  claude
  2. Start planning:   /cvf:plan "Your feature idea"
  3. Ship when ready:  /cvf:ship

MCP servers and hooks are configured.
`);
}

async function main(): Promise<void> {
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
      case "--upgrade":
        await runInstall();
        break;
      default:
        await runInstall();
    }
  } catch (error) {
    handleError(error);
  }
}

main().catch((error) => handleError(error));
