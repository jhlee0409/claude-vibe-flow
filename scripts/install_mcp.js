/**
 * install_mcp.js
 *
 * A helper script to safely inject MCP configuration into Claude Code settings.
 * Designed to be called by setup_vibe.sh.
 *
 * Usage: node install_mcp.js <config_path>
 */

const fs = require('fs');
const path = require('path');

// Vibe Standard Stack (Final Domain-Agnostic Version)
const REQUIRED_MCPS = {
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp"]
  },
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"]
  },
  "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
  }
};

const configPath = process.argv[2];

if (!configPath) {
  console.error("❌ Error: No configuration file path provided.");
  process.exit(1);
}

try {
  // 1. Read existing config
  let config = {};
  if (fs.existsSync(configPath)) {
    console.log(`📖 Reading config from: ${configPath}`);
    const rawData = fs.readFileSync(configPath, 'utf8');
    try {
        config = JSON.parse(rawData);
    } catch (e) {
        console.error("❌ Error Parsing JSON. Backing up and starting fresh.");
        fs.copyFileSync(configPath, `${configPath}.corrupt.bak`);
        config = {};
    }
  } else {
    console.log(`✨ Creating new config file at: ${configPath}`);
  }

  // 2. Backup
  if (fs.existsSync(configPath)) {
    fs.copyFileSync(configPath, `${configPath}.backup`);
  }

  // 3. Inject MCPs
  if (!config.mcpServers) {
    config.mcpServers = {};
  }

  let addedCount = 0;
  for (const [key, value] of Object.entries(REQUIRED_MCPS)) {
    if (!config.mcpServers[key]) {
      config.mcpServers[key] = value;
      console.log(`✅ Added ${key} to configuration.`);
      addedCount++;
    } else {
      console.log(`ℹ️  ${key} already exists. Skipping.`);
    }
  }

  // 4. Trace & Write
  if (addedCount > 0) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`🎉 Successfully updated configuration with ${addedCount} new servers.`);
  } else {
    console.log("👍 Configuration is already up to date.");
  }

} catch (error) {
  console.error("❌ An unexpected error occurred:", error);
  process.exit(1);
}
