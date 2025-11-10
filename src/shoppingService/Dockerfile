FROM node:20.17.0-slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=4004

EXPOSE 4004

CMD ["node", "server.js"]
