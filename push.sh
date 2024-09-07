#!/bin/bash

IMAGE_NAME="registry.byjardin.co.uk/kelv/freestontots/app:latest"

# Build the Docker image
docker build -t $IMAGE_NAME .

# Log in to GitLab Container Registry
docker login registry.byjardin.co.uk

# Push the Docker image
docker push $IMAGE_NAME
