FROM node:18-alpine as base
WORKDIR /app

# Install git and bun
RUN apk add --no-cache git
RUN npm install -g bun

# Copy package files
COPY package.json ./

# Install dependencies with bun only
RUN bun install --no-cache

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "dev"]
