# Base image
FROM node:22.12.0-slim AS base

# Builder stage
FROM base AS builder
WORKDIR /app

# Install libc6 (optional, but kept for your use case)
RUN apt-get update && apt-get install -y libc6 

# Copy entire app source
COPY . .

# Install dependencies (next is in dependencies, so --omit=dev is now safe)
RUN npm install --omit=dev

# Build Payload + Next.js app
RUN npm run build

# Runtime stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only what's needed from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.mjs

# Expose Payload port
EXPOSE 3000

# Start the app using npm script
CMD ["npm", "start"]
