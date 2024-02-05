#!/bin/bash -e

npm -f install
npx knex --knexfile ./src/infrastructure/entrepots/postgres/knexfile.ts migrate:latest
