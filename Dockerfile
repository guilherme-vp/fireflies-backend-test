# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.10.0

# Build image
FROM node:${NODE_VERSION}-alpine as build

# Set default workdir
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev


# Release image
FROM node:${NODE_VERSION}-alpine as release

WORKDIR /usr/src/app

# Use production node environment by default.
ENV NODE_ENV production

# Run the application as a non-root user.
USER node

# Copy the built node_module packages from the previous build
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules

# Copy the rest of the source files into the image.
COPY --chown=node:node . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application by invoking the node process directly via NPM.
# Guarantees all signals sent to the process are not being wrapped in a shell interpreter
CMD ["npm", "start"]
