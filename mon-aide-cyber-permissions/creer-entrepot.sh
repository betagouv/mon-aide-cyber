#!/usr/bin/env sh

bash $(dirname $0)/openfga-cli-install.sh

export FGA_API_URL=http://localhost:8080

fga store create --name "permissions"
