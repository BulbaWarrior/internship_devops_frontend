FROM node:latest
WORKDIR /app
COPY . .
ARG REACT_APP_BASE_URL=http://localhost:5000
run npm install
run npm run build

FROM nginx:latest
COPY --from=0 /app/build /usr/share/nginx/html

EXPOSE 80


