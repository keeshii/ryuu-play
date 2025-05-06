#!/bin/sh

APPDIR="/home/node/ryuu-play"
DATADIR="${APPDIR}/data"

if [ ! -f "${DATADIR}/init.js" ]; then
    cp -r "${APPDIR}/init.js" "$DATADIR"
fi

cd "${APPDIR}"
node start.js --init=${DATADIR}/init.js
