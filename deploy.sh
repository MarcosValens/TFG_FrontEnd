#!/bin/bash

docker image rm $(docker image ls -aq) -f
docker build -t tfgportscanner/portscanner-frontend:$1 .
docker push tfgportscanner/portscanner-frontend:$1
