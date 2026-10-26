#!/usr/bin/env bash
set -euo pipefail

RACINE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$RACINE"

NODE_VERSION="$(cat .nvmrc)"
export NODE_VERSION

commande="${1:-up}"

case "$commande" in
  up)
    docker compose up --build --force-recreate -d
    ;;
  build)
    docker compose build --force-recreate
    ;;
  down)
    docker compose down
    ;;
  *)
    echo "Usage : $0 [up|build|down]" >&2
    exit 1
    ;;
esac
