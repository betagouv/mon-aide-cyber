#!/usr/bin/env sh

OPENFGA_CLI_VERSION="0.2.6"
ASSET="fga_${OPENFGA_CLI_VERSION}_linux_amd64.tar.gz"
REPERTOIRE_INSTALLATION_CIBLE="/app/bin/fga-cli"

curl \
  --location \
  --remote-name "https://github.com/openfga/cli/releases/download/v${OPENFGA_CLI_VERSION}/${ASSET}"

mkdir -p "${REPERTOIRE_INSTALLATION_CIBLE}"

tar --directory "${REPERTOIRE_INSTALLATION_CIBLE}" -xzvf "${ASSET}" > /dev/null

ln --symbolic "${REPERTOIRE_INSTALLATION_CIBLE}/fga" "/app/bin/fga"
