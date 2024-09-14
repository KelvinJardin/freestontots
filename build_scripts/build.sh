#!/bin/bash

APP_IMAGE_NAME="registry.byjardin.co.uk/kelv/freestontots/app:latest"
DB_IMAGE_NAME="registry.byjardin.co.uk/kelv/freestontots/db:latest"

docker build -t $APP_IMAGE_NAME -f prod.Dockerfile .
docker build -t $DB_IMAGE_NAME -f db.Dockerfile .
