FROM node:24-alpine AS build
WORKDIR /app

COPY src/VirtualNovel.Frontend/package.json src/VirtualNovel.Frontend/package-lock.json ./
RUN npm ci

COPY src/VirtualNovel.Frontend/ .
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.29-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY src/VirtualNovel.Frontend/nginx/default.conf.template /etc/nginx/templates/default.conf.template

ENV GATEWAY_URL=http://gateway:8080
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --retries=5 \
    CMD wget --quiet --spider http://localhost:8080/health || exit 1
