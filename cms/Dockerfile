# Base image
FROM guergeiro/pnpm:22-10 AS base

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy entire app source
COPY package.json pnpm-lock.yaml .

# Install dependencies
RUN pnpm install

COPY . .

# Build Payload + Next.js app
RUN pnpm run build

# Runtime stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only what's needed from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose Payload port
EXPOSE 3000

# Start the app using npm script
CMD ["pnpm", "start"]
