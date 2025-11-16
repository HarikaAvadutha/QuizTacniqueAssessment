FROM node:18-alpine as builder

WORKDIR /app/client

COPY client/package*.json ./

RUN npm ci

COPY client .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/client/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
