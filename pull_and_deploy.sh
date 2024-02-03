#!/usr/bin/env bash

cd ~/services/elementerra-index
git pull
npm run build
/home/admin/.local/bin/pm2 restart ~/services/elementerra-index/dist/main.js 
