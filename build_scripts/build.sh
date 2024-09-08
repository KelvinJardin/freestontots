#!/bin/bash

IMAGE_NAME="registry.byjardin.co.uk/kelv/freestontots:latest"

# Build the Docker image
docker build -t $IMAGE_NAME .
