#!/bin/bash

# Variables
IMAGE_NAME="registry.byjardin.co.uk/kelv/freestontots:latest"
CONTAINER_NAME="freestontots_local"

# Function to print error and exit
function error_exit {
    echo "$1" 1>&2
    exit 1
}

# Build the Docker image
echo "Building the Docker image..."
docker build -t $IMAGE_NAME . || error_exit "Error building Docker image."

# Stop and remove any existing container with the same name
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping and removing existing container..."
    docker stop $CONTAINER_NAME && docker rm $CONTAINER_NAME || error_exit "Error stopping/removing existing container."
fi

# Run the Docker container locally
echo "Running the Docker container locally..."
docker run --name $CONTAINER_NAME -d -p 3000:3000 $IMAGE_NAME || error_exit "Error running Docker container."

echo "Docker container is running locally!"
