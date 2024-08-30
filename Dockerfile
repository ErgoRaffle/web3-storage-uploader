FROM node:20.11.0

LABEL maintainer="ergo-raafle team"
LABEL description="Docker image for the web3-storage-uploader owned by ergo-raffle organization."
LABEL org.label-schema.vcs-url="https://github.com/ErgoRaffle/web3-storage-uploader"

RUN adduser --disabled-password --home /app --uid 8080 --gecos "ErgoPlatform" ergo && \
    install -m 0740 -o ergo -g ergo -d /app/peer-dialer /app/logs && chown -R ergo:ergo /app/ && umask 0077
USER ergo

WORKDIR /app
COPY --chmod=700 --chown=ergo:ergo package-lock.json ./
COPY --chmod=700 --chown=ergo:ergo ./package.json ./
ADD --chmod=700 --chown=ergo:ergo ./patches/ ./patches/
RUN npx patch-package
RUN npm ci
COPY --chmod=700 --chown=ergo:ergo . .
RUN npm run build

ENV NODE_ENV=production

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start:prod"]
