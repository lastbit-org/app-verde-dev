FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV PORT=8080
RUN useradd --system --uid 1001 --create-home nest
USER nest
COPY --from=build --chown=nest:nest /app/package.json /app/package-lock.json ./
COPY --from=build --chown=nest:nest /app/node_modules ./node_modules
COPY --from=build --chown=nest:nest /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/main.js"]
