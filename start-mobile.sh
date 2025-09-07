#!/bin/bash

# Increase file descriptor limits for this session
ulimit -n 65536

# Clear Metro cache
npx expo start --clear

echo "Mobile app started with increased file limits"
