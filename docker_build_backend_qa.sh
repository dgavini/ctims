#!/bin/bash
set -a
. /home/qa_env_vars.sh
set +a

docker compose build --no-cache backend_qa
