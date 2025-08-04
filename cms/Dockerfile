# Base image
FROM node:22.12.0-slim AS base

# Builder stage
FROM base AS builder
WORKDIR /app

# Optional native dependency (only add if absolutely necessary)
RUN apt-get update && apt-get install -y libc6 

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy application code
COPY . .

# Build Payload app
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built app and dependencies from builder
COPY --from=builder /app/.next ./
COPY --from=builder /app/node_modules ./
COPY --from=builder /app/package.json ./

# Set non-root user only if it's explicitly created or available
# Otherwise default to root
# USER node

# Expose Payload default port
EXPOSE 3000
ENV PORT=3000

# Start the application
CMD ["npm", "run", "start"]
