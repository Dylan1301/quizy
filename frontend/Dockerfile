FROM node:18 AS build

# Set the working directory to /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM build AS start-dev
WORKDIR /app
# Run the app in port 4173
RUN npm run preview

FROM nginx AS start-prod
WORKDIR /app
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT [ "nginx" ]
CMD [ "-g", "daemon off;" ]
