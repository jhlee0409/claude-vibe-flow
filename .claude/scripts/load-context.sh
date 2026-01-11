#!/bin/bash

# Output content directly to stdout. 
# Claude Code captures this output and adds it to the context.

# 1. Framework Core Rules
if [ -f ".claude/CVF_CORE.md" ]; then
  echo "=== 🌊 Claude Vibe Flow Core Rules ==="
  cat .claude/CVF_CORE.md
  echo ""
fi

# 2. Persistent Memory
if [ -f ".claude/LESSONS.md" ]; then
  echo "=== 🧠 Lessons Learned (Memory) ==="
  cat .claude/LESSONS.md
  echo ""
fi

# 3. Active Spec (Summary)
if [ -f ".claude/active_spec.md" ]; then
  echo "=== 📋 Active Specification (Summary) ==="
  head -n 20 .claude/active_spec.md
  echo ""
fi
