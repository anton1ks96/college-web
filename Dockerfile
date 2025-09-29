FROM node:22-alpine

WORKDIR /app

COPY college-rag-web/package*.json ./

RUN npm ci

COPY college-rag-web/ .

RUN npm run build

RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]