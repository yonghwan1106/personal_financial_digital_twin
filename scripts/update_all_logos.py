#!/usr/bin/env python3
"""
Update all page logos to use the new Logo component
"""

import re
import glob

# Files to update
files = [
    'src/app/about/page.tsx',
    'src/app/accounts/page.tsx',
    'src/app/chat/page.tsx',
    'src/app/goals/page.tsx',
    'src/app/location/page.tsx',
    'src/app/settings/page.tsx',
    'src/app/simulation/page.tsx',
]

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Skip if already has Logo import
        if "import Logo from '@/components/Logo'" in content:
            print(f"✓ {filepath} already updated")
            continue

        # Add Logo import after other imports
        import_pattern = r"(import .*? from 'lucide-react';)"
        content = re.sub(
            import_pattern,
            r"\1\nimport Logo from '@/components/Logo';",
            content
        )

        # Replace sidebar logos
        # Pattern 1: Simple logo in Link
        pattern1 = r'<Link href="/dashboard" className="flex items-center gap-2 mb-8">\s*<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg"><\/div>\s*<span className="text-lg font-bold text-gray-900">금융 디지털트윈<\/span>\s*<\/Link>'
        content = re.sub(
            pattern1,
            '<div className="mb-8">\n            <Logo variant="compact" />\n          </div>',
            content
        )

        # Pattern 2: Logo without Link
        pattern2 = r'<div className="flex items-center gap-2 mb-8">\s*<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg"><\/div>\s*<span className="text-lg font-bold text-gray-900">금융 디지털트윈<\/span>\s*<\/div>'
        content = re.sub(
            pattern2,
            '<div className="mb-8">\n            <Logo variant="compact" />\n          </div>',
            content
        )

        # Pattern 3: Logo in mobile header
        pattern3 = r'<div className="flex items-center gap-2">\s*<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg"><\/div>\s*<span className="text-lg font-bold text-gray-900">금융 디지털트윈<\/span>\s*<\/div>'
        content = re.sub(
            pattern3,
            '<Logo variant="compact" />',
            content
        )

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"✓ Updated {filepath}")

    except Exception as e:
        print(f"✗ Error updating {filepath}: {e}")

print("\nDone!")
