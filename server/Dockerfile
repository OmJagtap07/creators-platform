# Use official Node.js 18 on Alpine Linux (small, secure, production-ready)
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files FIRST — enables Docker layer caching.
# If dependencies haven't changed, Docker reuses this cached layer
# and skips the slow npm ci step on subsequent builds.
COPY package*.json ./

# Install exact dependency versions from package-lock.json.
# npm ci is faster and deterministic — never updates the lock file.
RUN npm ci

# Copy the rest of the application source code.
# This comes AFTER npm ci so code changes don't invalidate
# the expensive dependency-installation layer.
COPY . .

# Document which port the app listens on
EXPOSE 5000

# Start the server using Node directly (not nodemon — that's dev-only)
CMD ["node", "server.js"]
