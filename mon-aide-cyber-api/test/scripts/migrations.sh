#!/bin/bash -e

npm install
npx knex --knexfile ./src/infrastructure/entrepots/postgres/knexfile.ts migrate:latest
