FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:0680209d8d26f10bb16f559101aca540bbe5240e3b7180d246cc7957133e9131

WORKDIR /usr/src/app
COPY ./dist ./dist
COPY ./node_modules ./node_modules

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["dist/server/entry.mjs"]

EXPOSE $PORT
