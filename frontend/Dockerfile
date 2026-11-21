# Estágio 1: Build da aplicação Angular
FROM node:20-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

# Estágio 2: Servidor NGINX para hospedar os arquivos estáticos
FROM nginx:alpine
COPY --from=build /app/dist/smartquote-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
