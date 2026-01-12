#!/bin/bash
# git-guard.sh - PreToolUse (Bash) Hook
# git commit/push 명령 전에 검증 게이트를 실행합니다.
#
# Exit Codes:
#   0 = 허용 (Allow)
#   2 = 차단 (Block)
#
# 환경 변수:
#   ALLOW_UNSAFE=1  검증 우회 (권장하지 않음)

COMMAND="$1"

# git 명령이 아니면 무시
if ! echo "$COMMAND" | grep -qE "^git "; then
  exit 0
fi

# ============================================
# 1. Branch Guard: main/master 직접 커밋 차단
# ============================================
if echo "$COMMAND" | grep -qE "^git (commit|push)"; then
  CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)

  if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    echo "⚠️  Protected branch detected: $CURRENT_BRANCH"
    echo ""
    echo "Direct commits to $CURRENT_BRANCH are discouraged."
    echo "Recommended: Create a feature branch first"
    echo ""
    echo "  git checkout -b feature/your-feature-name"
    echo "  git checkout -b checkpoint/$(date +%Y%m%d-%H%M)"
    echo ""
    # 경고만, 차단하지 않음 (사용자 판단에 맡김)
  fi
fi

# ============================================
# 2. Pre-commit Gate: commit 전 검증
# ============================================
if echo "$COMMAND" | grep -qE "^git commit"; then

  # ALLOW_UNSAFE=1 이면 우회
  if [ "$ALLOW_UNSAFE" = "1" ]; then
    echo "⚠️  ALLOW_UNSAFE=1: Skipping verification gates"
    exit 0
  fi

  echo "🔍 Running pre-commit verification..."
  echo ""

  FAILED=0

  # 2.1 TypeScript 타입 체크
  if [ -f "package.json" ] && grep -q "typecheck" package.json 2>/dev/null; then
    echo "📋 Running typecheck..."
    if ! npm run typecheck --silent 2>/dev/null; then
      echo "❌ Typecheck failed"
      FAILED=1
    else
      echo "✅ Typecheck passed"
    fi
  fi

  # 2.2 테스트 실행
  if [ -f "package.json" ] && grep -q '"test"' package.json 2>/dev/null; then
    echo "🧪 Running tests..."
    if ! npm test --silent 2>/dev/null; then
      echo "❌ Tests failed"
      FAILED=1
    else
      echo "✅ Tests passed"
    fi
  fi

  # 2.3 린트 체크
  if [ -f "package.json" ] && grep -q '"lint"' package.json 2>/dev/null; then
    echo "🔎 Running lint..."
    if ! npm run lint --silent 2>/dev/null; then
      echo "❌ Lint failed"
      FAILED=1
    else
      echo "✅ Lint passed"
    fi
  fi

  # 2.4 TODO 체크
  TODO_COUNT=$(grep -rn "// TODO:" src/ 2>/dev/null | wc -l | tr -d ' ')
  FIXME_COUNT=$(grep -rn "// FIXME:" src/ 2>/dev/null | wc -l | tr -d ' ')

  if [ "$TODO_COUNT" -gt 0 ] || [ "$FIXME_COUNT" -gt 0 ]; then
    echo "⚠️  Open items: TODO($TODO_COUNT), FIXME($FIXME_COUNT)"
  fi

  echo ""

  # 검증 실패 시 차단
  if [ "$FAILED" -eq 1 ]; then
    echo "❌ Pre-commit verification failed"
    echo ""
    echo "Fix the issues above, or use ALLOW_UNSAFE=1 to bypass (not recommended)"
    echo "  ALLOW_UNSAFE=1 git commit -m \"your message\""
    exit 2  # BLOCK
  fi

  echo "✅ All verification gates passed"
fi

# ============================================
# 3. Force Push 경고
# ============================================
if echo "$COMMAND" | grep -qE "git push.*(--force|-f)"; then
  CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)

  if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    echo "🚨 DANGER: Force push to $CURRENT_BRANCH detected!"
    echo ""
    echo "This is a destructive operation that can cause data loss."
    echo "Are you absolutely sure? Consider using a feature branch instead."
    exit 2  # BLOCK force push to main
  else
    echo "⚠️  Force push detected on branch: $CURRENT_BRANCH"
    echo "Proceeding with caution..."
  fi
fi

exit 0
