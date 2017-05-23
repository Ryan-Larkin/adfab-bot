#!/bin/bash
LOCALDIR=`dirname $0`
. ${LOCALDIR}/common.sh
cd ${LOCALDIR}/..
./bin/decrypt.sh
