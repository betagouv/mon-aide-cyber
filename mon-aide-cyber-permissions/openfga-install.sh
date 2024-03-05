#! /usr/bin/env bash

OPENFGA_VERSION="1.5.0"
ASSET="openfga_${OPENFGA_VERSION}_linux_amd64.tar.gz"
REPERTOIRE_INSTALLATION_CIBLE="/app/bin/openfga.d"

curl \
  --location \
  --remote-name "https://github.com/openfga/openfga/releases/download/v${OPENFGA_VERSION}/${ASSET}"

mkdir -p "${REPERTOIRE_INSTALLATION_CIBLE}"

tar --directory "${REPERTOIRE_INSTALLATION_CIBLE}" -xzvf "${ASSET}" > /dev/null

ln --symbolic "${REPERTOIRE_INSTALLATION_CIBLE}/openfga" "/app/bin/openfga"
