#!/usr/bin/env bash
# 在「終端機」App 中執行此腳本（會要求輸入 Mac 登入密碼以完成 Homebrew 安裝）
set -euo pipefail
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo ""
echo "若為 Apple Silicon，請將 brew 加入 PATH（可貼到 ~/.bashrc 末尾）："
echo '  eval "$(/opt/homebrew/bin/brew shellenv)"'
