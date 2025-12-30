FROM node:18-alpine

WORKDIR /app/Backend

COPY Backend/package*.json ./

RUN npm install

COPY Backend/ .

EXPOSE 3005

CMD ["npm", "start"]
