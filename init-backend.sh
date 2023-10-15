#!/bin/sh

# docker-compose -f "./backend/docker-compose.yaml" down -v;
# docker-compose -f "./backend/docker-compose.yaml" up --build -d;

cd backend;
npm install;
npx sequelize-cli db:migrate:undo:all;
npx sequelize-cli db:migrate;
npx sequelize-cli db:seed:all;
npm run start:watch;