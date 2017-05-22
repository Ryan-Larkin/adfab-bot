#!/bin/bash
DIR=`dirname $0`
if [ -z "${ENCRYPTED_KEY}" -o -z "${ENCRYPTED_IV}" ]
then
	echo "Please provide ENCRYPTED_KEY and ENCRYPTED_IV environment variables"
	exit 1
fi
openssl enc -aes-256-cbc -K ${ENCRYPTED_KEY} -iv ${ENCRYPTED_IV} -in ${DIR}/variables.sh -out ${DIR}/variables.sh.enc
