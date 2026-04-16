FROM node:18-slim
RUN npm install -g serve
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["serve", "-p", "8080", "."]
