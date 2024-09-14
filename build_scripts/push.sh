#!/bin/bash

IMAGE_NAME="registry.byjardin.co.uk/kelv/freestontots:latest"

# Build the Docker image
docker build -t $IMAGE_NAME -f prod.Dockerfile .

if [ $? -ne 0 ]; then
  echo "Docker build failed, exiting..."
  exit 1
fi

# Log in to GitLab Container Registry
docker login registry.byjardin.co.uk

# Push the Docker image
docker push $IMAGE_NAME
