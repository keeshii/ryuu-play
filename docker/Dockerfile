FROM node:14.21.3 as base

ARG REPO=https://github.com/keeshii/ryuu-play.git
ARG TAG=master
ARG EXTERNAL_URL=http://localhost:12021

# Download repository
RUN git clone "$REPO" /repo \
  && cd /repo \
  && git checkout "origin/${TAG}"

# Build ptcg-server
RUN cd /repo/ptcg-server \
  && npm install \
  && npm run build

# Build ptcg-play
RUN cd /repo/ptcg-play \
  && npm install \
  && sed -i 's/allowServerChange: true/allowServerChange: false/g' src/environments/environment.prod.ts \
  && sed -i 's/enableImageCache true/allowServerChange: false/g' src/environments/environment.prod.ts \
  && sed -i "s|apiUrl: 'https://ptcg.ryuu.eu'|apiUrl: '${EXTERNAL_URL}'|g" src/environments/environment.prod.ts \
  && npm run build -- --configuration production

# Include only porduction dependencies only
RUN cd /repo/ptcg-server \
  && rm -rf node_modules \
  && NODE_ENV=production npm install

# Create install directory
RUN mkdir /ryuu-play \
  && mv /repo/ptcg-server/node_modules /ryuu-play \
  && mv /repo/ptcg-server/output /ryuu-play \
  && mv /repo/ptcg-server/scans /ryuu-play \
  && mv /repo/ptcg-play/dist/ptcg-play /ryuu-play \
  && mv /repo/ptcg-server/*.js /ryuu-play \
  && mkdir /ryuu-play/data


FROM node:14.21.3-alpine
ENV NODE_ENV production

USER node:node
COPY --from=base --chown=node:node /ryuu-play /home/node/ryuu-play
ADD --chown=node:node entrypoint.sh /home/node/entrypoint.sh
RUN chmod a+x /home/node/entrypoint.sh

VOLUME /home/node/ryuu-play/data
ENTRYPOINT ["/home/node/entrypoint.sh"]
