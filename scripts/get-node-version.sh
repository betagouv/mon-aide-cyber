#!/usr/bin/env bash
set -euo pipefail

RACINE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

VERSION="$(tr -d '[:space:]' < "$RACINE/.nvmrc")"
# On s'assure que ce qui est lu dans ce fichier respecte bien le format d'une version sémantique
if [[ $VERSION =~ ^(([0-9]{1,}\.){1,2})?[0-9]{1,}$ ]]; then
  echo "$VERSION"
else
  >&2 echo "Format de version Node.js invalide dans .nvmrc : « $VERSION »"
  exit 1
fi
