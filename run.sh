#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export VANTA_ENV_FILE="/home/nik/Projects/kanopi/vanta-mcp-server/.oauth.json"
export VANTA_MCP_ENABLED_TOOLS="all"

printf 'VANTA_ENV_FILE=%s\n' "$VANTA_ENV_FILE" >&2
printf 'VANTA_MCP_ENABLED_TOOLS=%s\n' "$VANTA_MCP_ENABLED_TOOLS" >&2
printf 'Transport=stdio\n' >&2
printf 'Port=none (the server does not listen on TCP; use MCP over stdin/stdout)\n' >&2

if [[ ! -x "$ROOT_DIR/build/index.js" ]]; then
  printf 'Missing build/index.js. Build the project before using this wrapper.\n' >&2
  exit 1
fi

exec /usr/bin/node "$ROOT_DIR/build/index.js"

# Claude Desktop
#  "mcpServers": {
#    "vanta": {
#      "command": "/home/nik/Projects/kanopi/vanta-mcp-server/run.sh",
#      "args": []
#    }
#  }