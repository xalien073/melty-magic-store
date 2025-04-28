# Use a multi-stage build for efficiency
# Base image
FROM node:20-alpine3.18 AS base
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
RUN npm install

# Build stage
FROM base AS builder
COPY . . 
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Set environment variables
ENV AZURE_STORAGE_CONNECTION_STRING='DefaultEndpointsProtocol=https;AccountName=vipernest;AccountKey=abNSYyuD+ioegb4JhOu7FMj1kMpsDdDgDUtTRbG9cFAUX5BucnoiqDIQaTnT8W15g/pwdf1NzZbB+AStm/xiSg==;EndpointSuffix=core.windows.net' \
    TABLE_ACCOUNT_KEY=abNSYyuD+ioegb4JhOu7FMj1kMpsDdDgDUtTRbG9cFAUX5BucnoiqDIQaTnT8W15g/pwdf1NzZbB+AStm/xiSg== \
    EVENT_HUB_CONNECTION_STRING=Endpoint=sb://azure-ascendants.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=sAt69fGvqjzAKKNEvJBQPlKWbg4cHQXQS+AEhD9FeXU= \
    GOOGLE_CLIENT_ID=968187118592-h7q6505jf06n58gaiqn9v1j3k73jjanl.apps.googleusercontent.com \
    GOOGLE_CLIENT_SECRET=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 \
    NEXTAUTH_SECRET=3D7zhHez41cYLOcscK01orK0o38qcgQrgUPYGreAdTI=


# Copy necessary files from the build stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port and set the default command
EXPOSE 3000
CMD ["npm", "start"]
# Changed endings from CRLF to LF!