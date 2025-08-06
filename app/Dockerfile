FROM node:20-slim

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ENV PORT=3000

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE $PORT
CMD ["node", "src/index.js"]