#!/bin/bash
# Session Start — resolves the pinned SDK, then runs the hook handler.
set -euo pipefail
PLUGIN_ROOT="${PLUGIN_ROOT:-${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}}"
SDK_VERSION=$(node -e "try{console.log(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).sdkVersion||'latest')}catch{console.log('latest')}" "${PLUGIN_ROOT}/versions.json")
SESSION_ID=$(node -e "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => { try { process.stdout.write(JSON.parse(input).session_id || '') } catch {} })")

if [ -z "$SESSION_ID" ]; then
  printf '{}\n'
  exit 0
fi

export AGENT_SESSION_ID="$SESSION_ID"

if command -v babysitter >/dev/null 2>&1 && [ "$(babysitter --version 2>/dev/null)" = "$SDK_VERSION" ]; then
  CLI=(babysitter)
else
  CLI=(npm exec --yes --package "@a5c-ai/babysitter-sdk@$SDK_VERSION" -- babysitter)
fi

"${CLI[@]}" hook:run --harness unified --hook-type session-start --json
