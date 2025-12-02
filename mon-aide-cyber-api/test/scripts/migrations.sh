#!/bin/bash -e

echo "Installation des dépendances"
npm ci

echo "Lancement des migrations"
npx knex --knexfile ./src/infrastructure/entrepots/postgres/knexfile.ts migrate:latest

echo "Migrations terminées"
