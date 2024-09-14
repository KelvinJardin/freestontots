#!/bin/bash

IMAGE_NAME="registry.byjardin.co.uk/kelv/freestontots:latest"

docker build -t $IMAGE_NAME -f prod.Dockerfile .
