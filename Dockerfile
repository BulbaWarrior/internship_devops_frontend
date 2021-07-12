FROM node:latest
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ARG REACT_APP_BASE_URL=""
RUN npm run build

FROM nginx:latest
COPY --from=0 /app/docker/conf.d /etc/nginx/templates
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 3000
ENV REACT_APP_BASE_URL=http://localhost:5000
