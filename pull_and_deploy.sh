#!/usr/bin/env bash

cd ~/services/elementerra-index
git pull
npm run build
RELATIONAL_DATABASE_HOST='__RELATIONAL_DATABASE_HOST__' \
  RELATIONAL_DATABASE_PORT='5432' \
  RELATIONAL_DATABASE_USERNAME='__RELATIONAL_DATABASE_USERNAME__' \
  RELATIONAL_DATABASE_PASSWORD='__RELATIONAL_DATABASE_PASSWORD__' \
  RELATIONAL_DATABASE_NAME='__RELATIONAL_DATABASE_NAME__' \
  /home/admin/.local/bin/pm2 \
  restart ~/services/elementerra-index/dist/main.js \
  --update-env
