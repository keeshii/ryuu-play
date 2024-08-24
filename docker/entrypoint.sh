#!/bin/sh

APPDIR="/home/node/ryuu-play"
DATADIR="${APPDIR}/data"
WEBUIDIR="${APPDIR}/ptcg-play"

mkdir -p $DATADIR/avatars

if [ ! -f "${DATADIR}/scans" ]; then
    cp -r "${APPDIR}/scans" "${DATADIR}"
fi

if [ ! -f "${DATADIR}/config.js" ]; then
    cp -r "${APPDIR}/config.js" "$DATADIR"
    sed -i 's/\.\/output/..\/output/g' "$DATADIR/config.js"
    sed -i 's/localhost/0.0.0.0/g' "$DATADIR/config.js"
fi

if [ ! -f "${DATADIR}/start.js" ]; then
    cp -r "${APPDIR}/start.js" "${DATADIR}"
    sed -i 's/\.\/output/..\/output/g' "${DATADIR}/start.js"
    sed -i "/.then(() => app.start())/i\ \ .then(() => app.configureWebUi('${WEBUIDIR}'))" "${DATADIR}/start.js"
fi

cd "${DATADIR}"
node start.js
