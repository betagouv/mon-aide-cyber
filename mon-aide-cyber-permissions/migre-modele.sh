#! /usr/bin sh

$(dirname $0)/openfga-cli-install.sh

fga model write mon-aide-cyber-permissions/permissions.fga
