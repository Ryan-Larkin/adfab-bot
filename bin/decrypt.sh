#!/bin/bash
DIR=`dirname $0`
openssl enc -aes-256-cbc -K ${ENCRYPTED_KEY} -iv ${ENCRYPTED_IV} -in ${DIR}/variables.sh.enc -out ${DIR}/variables.sh -d
