#!/bin/bash
# ui-english-check.sh - PostToolUse (Edit) Hook
# 컴포넌트 파일에서 한글 UI 텍스트를 감지하여 경고합니다.
# CVF 규칙: UI 텍스트는 영어만 사용
#
# Exit Codes:
#   0 = 정보 제공 (차단 없음)

FILE_PATH="$1"

# 파일 경로가 없으면 무시
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# 파일이 존재하지 않으면 무시
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# ============================================
# 컴포넌트 파일만 검사
# ============================================

# components 디렉토리가 아니면 무시
if ! echo "$FILE_PATH" | grep -qE "(components|pages|views)/.*\.(tsx|jsx)$"; then
  exit 0
fi

# ============================================
# 한글 UI 텍스트 감지
# ============================================

# JSX 문자열에서 한글 찾기 (주석 제외)
# 패턴: "한글", '한글', `한글`, >한글<
KOREAN_PATTERNS=$(grep -n -E "([\"\'\`][^\"\']*[가-힣]+[^\"\']*[\"\'\`]|>[^<]*[가-힣]+[^<]*<)" "$FILE_PATH" 2>/dev/null | grep -v "^\s*//" | head -5)

if [ -n "$KOREAN_PATTERNS" ]; then
  echo "⚠️  Korean UI text detected in: $(basename "$FILE_PATH")"
  echo ""
  echo "CVF Rule: UI text must be in English only"
  echo ""
  echo "Found:"
  echo "$KOREAN_PATTERNS" | while read -r line; do
    echo "  $line"
  done
  echo ""
  echo "Examples of correct UI text:"
  echo "  ❌ \"저장\" → ✅ \"Save\""
  echo "  ❌ \"취소\" → ✅ \"Cancel\""
  echo "  ❌ \"오류가 발생했습니다\" → ✅ \"An error occurred\""
  echo ""
fi

exit 0
