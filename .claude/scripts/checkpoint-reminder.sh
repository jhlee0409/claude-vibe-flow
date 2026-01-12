#!/bin/bash
# checkpoint-reminder.sh - PreToolUse (Edit) Hook
# 대규모 변경 전 체크포인트 생성을 권장합니다.
#
# Exit Codes:
#   0 = 정보 제공 (차단 없음)

FILE_PATH="$1"

# 파일 경로가 없으면 무시
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# 파일이 존재하지 않으면 (새 파일) 무시
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# ============================================
# 체크포인트 필요 여부 판단
# ============================================

NEED_CHECKPOINT=false
REASON=""

# 1. 핵심 설정 파일 수정
if echo "$FILE_PATH" | grep -qE "(package\.json|tsconfig\.json|\.env|webpack|vite\.config)"; then
  NEED_CHECKPOINT=true
  REASON="핵심 설정 파일 수정"
fi

# 2. 코어 로직 파일 수정 (SSOT 위치)
if echo "$FILE_PATH" | grep -qE "src/core/.*\.(ts|tsx|js|jsx)$"; then
  NEED_CHECKPOINT=true
  REASON="코어 비즈니스 로직 수정"
fi

# 3. API 레이어 수정
if echo "$FILE_PATH" | grep -qE "src/api/.*\.(ts|tsx|js|jsx)$"; then
  NEED_CHECKPOINT=true
  REASON="API 레이어 수정"
fi

# 4. 타입 정의 수정
if echo "$FILE_PATH" | grep -qE "src/types/.*\.(ts|tsx)$"; then
  NEED_CHECKPOINT=true
  REASON="타입 정의 수정 (영향 범위 넓음)"
fi

# 5. 대용량 파일 수정 (100줄 이상)
if [ -f "$FILE_PATH" ]; then
  LINE_COUNT=$(wc -l < "$FILE_PATH" 2>/dev/null | tr -d ' ')
  if [ "$LINE_COUNT" -gt 100 ]; then
    NEED_CHECKPOINT=true
    REASON="대용량 파일 수정 (${LINE_COUNT}줄)"
  fi
fi

# ============================================
# 체크포인트 권장 메시지
# ============================================

if [ "$NEED_CHECKPOINT" = true ]; then
  # 마지막 체크포인트 확인
  LAST_STASH=$(git stash list 2>/dev/null | head -1)
  LAST_CHECKPOINT_BRANCH=$(git branch --list 'checkpoint/*' 2>/dev/null | head -1)

  # 최근 10분 내 체크포인트가 있으면 스킵
  RECENT_STASH=$(git stash list --date=relative 2>/dev/null | grep -E "minutes? ago" | head -1)

  if [ -z "$RECENT_STASH" ]; then
    echo "💾 Checkpoint recommended: $REASON"
    echo ""
    echo "  git stash push -u -m \"checkpoint: before $(basename "$FILE_PATH") edit\""
    echo "  or use /rewind (ESC ESC) to create checkpoint"
    echo ""
  fi
fi

exit 0
