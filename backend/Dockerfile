# Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Runtime (secure minimal image)
FROM gcr.io/distroless/nodejs20

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

CMD ["src/app.js"]