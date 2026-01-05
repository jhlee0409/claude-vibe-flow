#!/usr/bin/env node

/**
 * vibe-flow CLI
 * Wrapper around the setup script for npx execution.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🌊 Vibe Flow CLI');

// Path to the shell script in the package
const scriptPath = path.join(__dirname, '..', 'scripts', 'setup_vibe.sh');

if (!fs.existsSync(scriptPath)) {
  console.error('❌ Error: Could not find setup script at:', scriptPath);
  process.exit(1);
}

// Spawn the shell script
const child = spawn('bash', [scriptPath], {
  stdio: 'inherit' // Pipe output directly to parent
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Setup exited with code ${code}`);
    process.exit(code);
  }
  // Success is handled by the script itself
});
