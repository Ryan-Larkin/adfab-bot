#!/bin/bash
LOCALDIR=`dirname $0`
. ${LOCALDIR}/common.sh
cd ${LOCALDIR}/..
node node_modules/react-scripts/bin/react-scripts.js test --coverage --colors --forceExit --maxWorkers 6
