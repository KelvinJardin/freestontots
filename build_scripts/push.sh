#!/bin/bash

APP_IMAGE_NAME="registry.byjardin.co.uk/kelv/freestontots/app:latest"
DB_IMAGE_NAME="registry.byjardin.co.uk/kelv/freestontots/db:latest"

# Build the Docker image
docker build --no-cache -t $APP_IMAGE_NAME -f prod.Dockerfile .
docker build --no-cache -t $DB_IMAGE_NAME -f db.Dockerfile .

if [ $? -ne 0 ]; then
  echo "Docker build failed, exiting..."
  exit 1
fi

# Log in to GitLab Container Registry
docker login registry.byjardin.co.uk

# Push the Docker image
docker push $APP_IMAGE_NAME
docker push $DB_IMAGE_NAME
