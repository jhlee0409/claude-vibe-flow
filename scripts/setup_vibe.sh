#!/bin/bash

# setup_vibe.sh
# Checks environment health and installs Vibe Flow dependencies (MCPs).

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎵 Welcome to Vibe Flow Setup (The Vibe Doctor)${NC}"
echo "---------------------------------------------------"

# 1. Check Dependencies
echo -e "\n🔍 Checking Core Dependencies..."

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ git could not be found.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ git found.${NC}"
fi

if ! command -v rg &> /dev/null; then
    echo -e "${YELLOW}⚠️  ripgrep (rg) not found.${NC}"
    echo "   Vibe Flow runs faster with ripgrep."
    echo "   Install it via: brew install ripgrep"
else
    echo -e "${GREEN}✅ ripgrep found.${NC}"
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js could not be found.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Node.js found.${NC}"
fi

if ! command -v claude &> /dev/null; then
    echo -e "${YELLOW}⚠️  Claude Code CLI not found.${NC}"
    echo "   Vibe Flow is designed to run within Claude Code."
    echo "   Please install it: npm install -g @anthropic-ai/claude-code"
else
    echo -e "${GREEN}✅ Claude Code CLI found.${NC}"
fi

# 2. Locate Config
echo -e "\n🔍 Locating Claude Configuration..."
OS="$(uname)"
CONFIG_PATH=""

if [ "$OS" == "Darwin" ]; then
    # macOS
    CONFIG_PATH="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
elif [ "$OS" == "Linux" ]; then
    # Linux (Guessing standard location, might need adjustment)
    CONFIG_PATH="$HOME/.config/Claude/claude_desktop_config.json"
else
    echo -e "${YELLOW}⚠️  Unsupported OS for automatic config detection. Skipping auto-install.${NC}"
fi

# 3. Interactive Installation
if [ -n "$CONFIG_PATH" ]; then
    echo -e "Target Config: ${YELLOW}$CONFIG_PATH${NC}"

    echo -e "\n📦 Vibe Standard Stack (MCPs):"
    echo "   - Context7 (Docs)"
    echo "   - GitHub (Issues)"
    echo "   - Sequential Thinking (Reasoning)"

    read -p "❓ Do you want to install/update these MCP servers? [Y/n] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "\n🚀 Installing..."
        # Create directory if it doesn't exist
        DIR_NAME=$(dirname "$CONFIG_PATH")
        mkdir -p "$DIR_NAME"

        # Run Node helper
        node scripts/install_mcp.js "$CONFIG_PATH"

        echo -e "\n${GREEN}✅ Setup Complete! Please restart Claude Desktop/Code to apply changes.${NC}"
    else
        echo -e "\nInstalling skipped."
    fi
fi

echo -e "\n🎉 Vibe Flow is ready to roll."
