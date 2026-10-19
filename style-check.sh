#!/usr/bin/env bash
# 样式硬编码检查：src/ 下的 CSS / TSX 不得出现 Hex 色值或 px 数值。
# style-baseline/theme.css 本身是 Token 定义源，不在检查范围内。
# 用法：bash style-check.sh   退出码 0=通过，1=有硬编码
cd "$(dirname "$0")" || exit 1
fail=0

strip_comments() { sed -E 's#/\*.*\*/##g' "$1"; }

report() { # $1=规则名 $2=正则 $3...=文件
  local name="$1" re="$2"; shift 2
  local f hits
  for f in "$@"; do
    [ -f "$f" ] || continue
    hits=$(strip_comments "$f" | grep -nE "$re" | grep -v '^[0-9]*:\s*//' || true)
    if [ -n "$hits" ]; then
      echo "✗ [$name] $f"; echo "$hits" | head -5 | sed 's/^/    /'; fail=1
    fi
  done
}

files=$(find src -type f \( -name '*.css' -o -name '*.tsx' -o -name '*.ts' \))
# Hex 色值（# 后 3/4/6/8 位十六进制，且不是 CSS id 选择器场景）
report "hex 色值" '#[0-9a-fA-F]{3,8}\b[^a-zA-Z-]' $files
# px 硬编码（SVG 属性 / viewBox 数字不带 px，不会命中）
report "px 数值" '[0-9]px' $files
# 内联样式只允许 var(--*)
report "内联 style 硬编码" 'style=\{\{[^}]*(#[0-9a-fA-F]{3,8}|[0-9]px)' $(find src -name '*.tsx')

if [ $fail -eq 0 ]; then echo "✓ style-check 通过：src/ 内无 Hex / px 硬编码"; else echo "✗ style-check 未通过，请改用 var(--color-*) / var(--space-*) 等基线变量"; fi
exit $fail
