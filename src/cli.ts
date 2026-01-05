#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const REPO = "jhlee0409/claude-vibe-flow";
const BRANCH = "main";
const TARBALL_URL = `https://github.com/${REPO}/archive/${BRANCH}.tar.gz`;

const INSTALL_ITEMS = [
  ".claude-plugin",
  ".mcp.json",
  "agents",
  "commands",
  "hooks",
  "skills",
  "outputStyles",
] as const;

type Command = "help" | "--help" | "-h" | "--version" | "-v" | undefined;

function main(): void {
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
}

function showHelp(): void {
  console.log(`Usage: npx claude-vibe-flow

Installs Claude Vibe Flow into your project:
  - .mcp.json (MCP servers auto-configured)
  - agents/ (17 specialized AI agents)
  - commands/ (slash commands)
  - hooks/ (verification loop hooks)
  - skills/, outputStyles/

Examples:
  npx claude-vibe-flow          # Install to current directory
  npx claude-vibe-flow --help   # Show this help
`);
}

function showVersion(): void {
  const pkg = require("../package.json");
  console.log(`v${pkg.version}`);
}

function checkDependencies(): void {
  try {
    execSync("which curl", { stdio: "ignore" });
    execSync("which tar", { stdio: "ignore" });
  } catch {
    console.error("❌ Error: curl and tar are required but not found.");
    process.exit(1);
  }
}

function cleanupTempDir(tempDir: string): void {
  try {
    execSync(`rm -rf ${tempDir}`);
  } catch {}
}

function runInstall(): void {
  console.log("📦 Installing Claude Vibe Flow...\n");

  checkDependencies();

  const cwd = process.cwd();
  const tempDir = `/tmp/claude-vibe-flow-${Date.now()}`;

  try {
    fs.mkdirSync(tempDir, { recursive: true });

    console.log("📥 Downloading from GitHub...");
    execSync(`curl -fsSL ${TARBALL_URL} | tar -xz -C ${tempDir}`, {
      stdio: ["inherit", "inherit", "inherit"],
    });

    const extractedDir = `${tempDir}/claude-vibe-flow-${BRANCH}`;

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
          execSync(`cp -r "${src}" "${dest}"`);
          console.log(`   ✅ ${item}`);
          installed++;
        }
      }
    }

    cleanupTempDir(tempDir);

    console.log(`
✨ Done! (${installed} installed, ${skipped} skipped)

Next steps:
  1. Run Claude Code:  claude
  2. Initialize:       /claude-vibe-flow:init
  3. Start building:   /claude-vibe-flow:new-feature "Your feature"

MCP servers (Context7, GitHub, Sequential Thinking) will auto-start.
`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Installation failed:", message);
    cleanupTempDir(tempDir);
    process.exit(1);
  }
}

main();
