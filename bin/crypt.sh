#!/bin/bash
DIR=`dirname $0`
if [ -f "${DIR}/variables.sh" ]
then
	if [ -z "${ENCRYPTED_KEY}" -o -z "${ENCRYPTED_IV}" ]
	then
		echo -e "\033[1;31mPlease provide ENCRYPTED_KEY and ENCRYPTED_IV environment variables.\033[0m"
		echo "You'll find them inside wiki or you can generate with following command:"
		echo -e "\033[1;32mopenssl enc -aes-256-cbc -k *secret* -P -md sha1\033[0m"
		echo "If you generate new credentials, don't forget to copy then inside wiki AND continuous integration."
		exit 1
	fi
	openssl enc -aes-256-cbc -K ${ENCRYPTED_KEY} -iv ${ENCRYPTED_IV} -in ${DIR}/variables.sh -out ${DIR}/variables.sh.enc
fi
