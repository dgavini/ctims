#!/bin/bash
#!/bin/bash
SELFDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
uuid=$(uuidgen)

TECHNA_HOSTNAME=qa02.technainstitute.net
TECHNA_ROLE=qa
TECHNA_INGRESS_LOCAL_PORT=31088
TECHNA_REGISTRY_PORT=443
TECHNA_REGISTRY_ENDPOINT=docker-registry.uhn.ca

MM_DB_CONTAINER_IMAGE_NAME=matchminer-db
MM_DB_CONTAINER_IMAGE_LOCATION=$TECHNA_REGISTRY_ENDPOINT:$TECHNA_REGISTRY_PORT/$MM_DB_CONTAINER_IMAGE_NAME

docker build -t ${MM_DB_CONTAINER_IMAGE_LOCATION}:$uuid $SELFDIR

docker push ${MM_DB_CONTAINER_IMAGE_LOCATION}:$uuid