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
  && npm run build -w packages/ptcg-server

# Build ptcg-play
RUN cd /repo/packages/ptcg-play \
  && sed -i 's/allowServerChange: true/allowServerChange: false/g' src/environments/environment.prod.ts \
  && sed -i 's/enableImageCache: s/enableImageCache: false/g' src/environments/environment.prod.ts \
  && sed -i "s|apiUrl: 'https://ptcg.ryuu.eu'|apiUrl: '${EXTERNAL_URL}'|g" src/environments/environment.prod.ts \
  && npm run build -- --configuration production

# Include only porduction dependencies only
RUN cd /repo \
  && rm -rf node_modules \
  && NODE_ENV=production npm ci --production --workspace=packages/ptcg-server

# Create install directory
RUN mkdir /ryuu-play \
  && mv /repo/node_modules /ryuu-play \
  && mv /repo/packages/ptcg-server/dist /ryuu-play \
  && mv /repo/packages/ptcg-server/scans /ryuu-play \
  && mv /repo/packages/ptcg-play/dist/ptcg-play /ryuu-play \
  && mv /repo/packages/ptcg-server/*.js /ryuu-play \
  && mkdir /ryuu-play/data


FROM node:18.20.8-alpine
ENV NODE_ENV production

USER node:node
COPY --from=base --chown=node:node /ryuu-play /home/node/ryuu-play
ADD --chown=node:node entrypoint.sh /home/node/entrypoint.sh
RUN chmod a+x /home/node/entrypoint.sh

VOLUME /home/node/ryuu-play/data
ENTRYPOINT ["/home/node/entrypoint.sh"]
