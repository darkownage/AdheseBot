#!/bin/bash
docker build -t adhesebot:latest .
docker run \
    --name adhese_bot -d \
    adhesebot:latest

