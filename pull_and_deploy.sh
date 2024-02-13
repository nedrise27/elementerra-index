#!/usr/bin/env bash

set -e pipefail

cd ~/services/elementerra-index
git pull
npm ci
npm run build
RELATIONAL_DATABASE_HOST='__RELATIONAL_DATABASE_HOST__' \
  RELATIONAL_DATABASE_PORT='5432' \
  RELATIONAL_DATABASE_USERNAME='__RELATIONAL_DATABASE_USERNAME__' \
  RELATIONAL_DATABASE_PASSWORD='__RELATIONAL_DATABASE_PASSWORD__' \
  RELATIONAL_DATABASE_NAME='__RELATIONAL_DATABASE_NAME__' \
  PAIN_TEXT_PASSWORD='__PAIN_TEXT_PASSWORD__' \
  HELIUS_API_KEY='__HELIUS_API_KEY__' \
  WEBSOCKET_API_URL='__WEBSOCKET_API_URL__' \
  /home/admin/.local/bin/pm2 \
  restart ~/services/elementerra-index/pm2.config.js \
  --update-env
