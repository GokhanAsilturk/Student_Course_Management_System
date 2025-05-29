# Multi-stage build for React Client
FROM node:18-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

FROM base AS development
RUN npm install
COPY . .
EXPOSE 3000
ENV REACT_APP_API_URL=http://localhost:5000/api
CMD ["sh", "-c", "PORT=3000 npm start"]

# Build stage
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
