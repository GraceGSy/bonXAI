#!/bin/bash

# Build react components
npm run build

# cd into widget folder
cd bonxai/js

npm run build

# Exit to main folder
cd ..
cd ..