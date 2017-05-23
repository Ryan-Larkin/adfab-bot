#!/bin/bash
DIR=`dirname $0`
if [ -f "${DIR}/variables.sh.enc" ]
then
	if [ -z "${ENCRYPTED_KEY}" -o -z "${ENCRYPTED_IV}" ]
	then
		echo -e "\033[1;31mPlease provide ENCRYPTED_KEY and ENCRYPTED_IV environment variables.\033[0m"
		echo "You'll find them inside wiki."
		exit 0
	fi
	openssl enc -aes-256-cbc -K ${ENCRYPTED_KEY} -iv ${ENCRYPTED_IV} -in ${DIR}/variables.sh.enc -out ${DIR}/variables.sh -d
fi
