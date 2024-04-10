FROM node:18 AS build

# Set the working directory to /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18 AS start-dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Run the app in port 4173
EXPOSE 80
CMD [ "npx", "vite", "--host", "0.0.0.0"]

FROM nginx AS start-prod
WORKDIR /app
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT [ "nginx" ]
CMD [ "-g", "daemon off;" ]
