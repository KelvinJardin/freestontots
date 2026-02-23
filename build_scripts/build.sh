#!/bin/bash

APP_IMAGE_NAME="registry.byjardin.co.uk/kelv/freestontots/app:latest"
DB_IMAGE_NAME="registry.byjardin.co.uk/kelv/freestontots/db:latest"

docker build --no-cache -t $APP_IMAGE_NAME -f prod.Dockerfile .
docker build --no-cache -t $DB_IMAGE_NAME -f db.Dockerfile .
