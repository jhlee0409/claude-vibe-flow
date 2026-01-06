#!/bin/bash
# detect-test-framework.sh - Detects test framework and returns test command
# Returns JSON: {"framework": "...", "command": "...", "detected": true/false}

set -euo pipefail

PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$PWD}"

# Check for Node.js test frameworks
if [[ -f "$PROJECT_ROOT/package.json" ]]; then
  # Check for vitest
  if grep -q '"vitest"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
    echo '{"framework": "vitest", "command": "npm test", "detected": true}'
    exit 0
  fi
  
  # Check for jest
  if grep -q '"jest"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
    echo '{"framework": "jest", "command": "npm test", "detected": true}'
    exit 0
  fi
  
  # Check for mocha
  if grep -q '"mocha"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
    echo '{"framework": "mocha", "command": "npm test", "detected": true}'
    exit 0
  fi
  
  # Check for test script in package.json
  if grep -q '"test"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
    # Check if it's not the default "no test specified"
    if ! grep -q 'no test specified' "$PROJECT_ROOT/package.json" 2>/dev/null; then
      echo '{"framework": "npm-script", "command": "npm test", "detected": true}'
      exit 0
    fi
  fi
fi

# Check for Python test frameworks
if [[ -f "$PROJECT_ROOT/pyproject.toml" ]] || [[ -f "$PROJECT_ROOT/setup.py" ]] || [[ -f "$PROJECT_ROOT/requirements.txt" ]]; then
  # Check for pytest
  if [[ -f "$PROJECT_ROOT/pytest.ini" ]] || [[ -f "$PROJECT_ROOT/pyproject.toml" ]] && grep -q 'pytest' "$PROJECT_ROOT/pyproject.toml" 2>/dev/null; then
    echo '{"framework": "pytest", "command": "pytest", "detected": true}'
    exit 0
  fi
  
  # Check for pytest in requirements
  if [[ -f "$PROJECT_ROOT/requirements.txt" ]] && grep -q 'pytest' "$PROJECT_ROOT/requirements.txt" 2>/dev/null; then
    echo '{"framework": "pytest", "command": "pytest", "detected": true}'
    exit 0
  fi
  
  # Check for test directory
  if [[ -d "$PROJECT_ROOT/tests" ]] || [[ -d "$PROJECT_ROOT/test" ]]; then
    echo '{"framework": "pytest", "command": "pytest", "detected": true}'
    exit 0
  fi
fi

# Check for Go
if [[ -f "$PROJECT_ROOT/go.mod" ]]; then
  echo '{"framework": "go", "command": "go test ./...", "detected": true}'
  exit 0
fi

# Check for Rust
if [[ -f "$PROJECT_ROOT/Cargo.toml" ]]; then
  echo '{"framework": "cargo", "command": "cargo test", "detected": true}'
  exit 0
fi

# Check for Ruby
if [[ -f "$PROJECT_ROOT/Gemfile" ]]; then
  if grep -q 'rspec' "$PROJECT_ROOT/Gemfile" 2>/dev/null; then
    echo '{"framework": "rspec", "command": "bundle exec rspec", "detected": true}'
    exit 0
  fi
  if grep -q 'minitest' "$PROJECT_ROOT/Gemfile" 2>/dev/null; then
    echo '{"framework": "minitest", "command": "bundle exec rake test", "detected": true}'
    exit 0
  fi
fi

# Check for custom test command file
if [[ -f "$PROJECT_ROOT/.claude-vibe-flow/test-command.txt" ]]; then
  CMD=$(cat "$PROJECT_ROOT/.claude-vibe-flow/test-command.txt" | head -1)
  CMD_ESCAPED=$(echo "$CMD" | sed 's/\\/\\\\/g; s/"/\\"/g')
  echo "{\"framework\": \"custom\", \"command\": \"$CMD_ESCAPED\", \"detected\": true}"
  exit 0
fi

# No framework detected
echo '{"framework": "none", "command": "", "detected": false}'
exit 0
