#!/usr/bin/env node

/**
 * vibe-flow CLI
 * 
 * Commands:
 *   npx vibe-flow        - Install MCP servers only (lightweight)
 *   npx vibe-flow init   - Full installation (agents + commands + MCP)
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const REPO = 'jhlee0409/claude-vibe-flow';
const BRANCH = 'main';
const TARBALL_URL = `https://github.com/${REPO}/archive/${BRANCH}.tar.gz`;

// Directories to copy for full installation
const FULL_INSTALL_DIRS = [
  '.claude-plugin',
  '.mcp.json',
  'agents',
  'commands',
  'skills',
  'outputStyles'
];

console.log('🌊 Vibe Flow CLI\n');

const command = process.argv[2];

if (command === 'init') {
  runFullInstall();
} else if (command === 'help' || command === '--help' || command === '-h') {
  showHelp();
} else {
  runMcpOnly();
}

function showHelp() {
  console.log(`Usage: npx vibe-flow [command]

Commands:
  init      Full installation (agents + commands + MCP)
  (none)    MCP servers only (lightweight)
  help      Show this help message

Examples:
  npx vibe-flow init    # Add full Vibe Coding to existing project
  npx vibe-flow         # Install MCP servers only
`);
}

function runMcpOnly() {
  console.log('📦 Installing MCP servers only...\n');
  
  const scriptPath = path.join(__dirname, '..', 'scripts', 'setup_vibe.sh');
  
  if (!fs.existsSync(scriptPath)) {
    console.error('❌ Error: Could not find setup script at:', scriptPath);
    process.exit(1);
  }
  
  const child = spawn('bash', [scriptPath], {
    stdio: 'inherit'
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Setup exited with code ${code}`);
      process.exit(code);
    }
  });
}

function runFullInstall() {
  console.log('🚀 Full Vibe Flow Installation\n');
  console.log('Downloading from GitHub...');
  
  // Check if curl and tar are available
  try {
    execSync('which curl', { stdio: 'ignore' });
    execSync('which tar', { stdio: 'ignore' });
  } catch (e) {
    console.error('❌ Error: curl and tar are required but not found.');
    process.exit(1);
  }
  
  const cwd = process.cwd();
  const tempDir = `/tmp/vibe-flow-${Date.now()}`;
  
  try {
    // Create temp directory
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Download and extract tarball
    console.log('📥 Downloading...');
    execSync(`curl -fsSL ${TARBALL_URL} | tar -xz -C ${tempDir}`, {
      stdio: ['inherit', 'inherit', 'inherit']
    });
    
    const extractedDir = `${tempDir}/claude-vibe-flow-${BRANCH}`;
    
    // Copy required directories
    console.log('📁 Copying files...\n');
    
    for (const item of FULL_INSTALL_DIRS) {
      const src = path.join(extractedDir, item);
      const dest = path.join(cwd, item);
      
      if (fs.existsSync(src)) {
        // Check if destination exists
        if (fs.existsSync(dest)) {
          console.log(`  ⚠️  ${item} (already exists, skipping)`);
        } else {
          execSync(`cp -r "${src}" "${dest}"`);
          console.log(`  ✅ ${item}`);
        }
      }
    }
    
    // Cleanup
    execSync(`rm -rf ${tempDir}`);
    
    console.log(`
✨ Vibe Flow installed successfully!

Next steps:
  1. Start Claude Code:  claude
  2. Initialize:         /claude-vibe-flow:init
  3. Start coding:       /claude-vibe-flow:new-feature "Your feature"
`);
    
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    // Cleanup on error
    try {
      execSync(`rm -rf ${tempDir}`);
    } catch (e) {}
    process.exit(1);
  }
}
