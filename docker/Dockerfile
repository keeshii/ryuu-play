FROM node:18.20.8 as base

ARG REPO=https://github.com/keeshii/ryuu-play.git
ARG TAG=0.1.0
ARG EXTERNAL_URL=http://localhost:12021

# Download repository
RUN git clone "$REPO" /repo \
  && cd /repo \
  && git checkout "origin/${TAG}"

# Install dependencies, build ptcg-server
RUN cd /repo \
  && npm install \
  && npm run build -w packages/common \
  && npm run build -w packages/sets \
  && npm run build -w packages/server

# Build ptcg-play in production
RUN cd /repo \
  && sed -i "s|apiUrl: 'https://ptcg.ryuu.eu'|apiUrl: '${EXTERNAL_URL}'|g" packages/play/src/environments/environment.prod.ts \
  && npm run build -w packages/play -- --configuration=production

# Include only porduction dependencies only
RUN cd /repo \
  && rm -rf node_modules \
  && NODE_ENV=production npm ci --omit=dev -w=packages/server -w=packages/sets

# Listen to all interfaces, update path to web-ui
RUN cd /repo \
  && sed -i 's/localhost/0.0.0.0/g' init.js \
  && sed -i '/webUiDir/d' init.js \
  && sed -i 's/config.backend.webUiDir/__dirname + "\/ptcg-play"/' start.js

# Create install directory
RUN mkdir /ryuu-play \
   && cp -RL /repo/node_modules /ryuu-play \
   && mv /repo/packages/play/dist/ptcg-play /ryuu-play \
   && mv /repo/*.js /ryuu-play \
   && mkdir /ryuu-play/data

FROM node:18.20.8-slim
ENV NODE_ENV production

USER node:node
COPY --from=base --chown=node:node /ryuu-play /home/node/ryuu-play
ADD --chown=node:node entrypoint.sh /home/node/entrypoint.sh
RUN chmod a+x /home/node/entrypoint.sh

VOLUME /home/node/ryuu-play/data
ENTRYPOINT ["/home/node/entrypoint.sh"]
