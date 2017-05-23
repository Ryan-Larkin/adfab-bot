#!/bin/bash
DIR=`dirname $0`
if [ -f ${DIR}/variables.sh ]
then
	source ${DIR}/variables.sh
fi
cd ${DIR}/..
if [ -z "${BRANCH_NAME}" ]
then
	if [ -d .git ]
	then
		BRANCH_NAME=`git rev-parse --abbrev-ref HEAD`
		if [ "${BRANCH_NAME}" == "HEAD" ]
		then
			BRANCH_NAME=`git branch --remote --verbose --no-abbrev --contains | sed -rne 's/^[^\/]*\/([^\ ]+).*$/\1/p'`
		fi
	fi
fi
if [ ! -z "${BRANCH_NAME}" ]
then
	export BRANCH=${BRANCH_NAME}
fi
