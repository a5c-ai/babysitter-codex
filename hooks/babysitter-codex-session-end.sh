#!/bin/bash
# SessionEnd — Codex entry shim for hooks/babysitter-proxied-session-end.sh.
set -uo pipefail
BSIT_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BSIT_SCRIPT_NAME="$(basename "${BASH_SOURCE[0]}")"
. "$BSIT_SCRIPT_DIR/babysitter-codex-hook-lib.sh"
bsit_invoke "babysitter-proxied-session-end.sh"
