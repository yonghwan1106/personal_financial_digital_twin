#!/bin/bash

# 모든 서브 페이지의 로고를 업데이트하는 스크립트

PAGES=(
  "src/app/accounts/page.tsx"
  "src/app/goals/page.tsx"
  "src/app/simulation/page.tsx"
  "src/app/chat/page.tsx"
  "src/app/settings/page.tsx"
  "src/app/location/page.tsx"
  "src/app/about/page.tsx"
)

for page in "${PAGES[@]}"; do
  if [ -f "$page" ]; then
    echo "Updating $page..."

    # Add import if not exists
    if ! grep -q "import Logo from '@/components/Logo';" "$page"; then
      # Find the last import line and add after it
      sed -i "/^import.*from/a import Logo from '@/components/Logo';" "$page"
    fi

    # Replace sidebar logo
    sed -i 's/<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg"><\/div>\s*<span className="text-lg font-bold text-gray-900">금융 디지털트윈<\/span>/<Logo variant="compact" \/>/g' "$page"

    echo "✓ Updated $page"
  else
    echo "✗ File not found: $page"
  fi
done

echo "Done!"
