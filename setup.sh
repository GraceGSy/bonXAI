#!/bin/bash

# Install npm packages
npm install

# Build react components
npm run build

# cd into widget folder
cd bonxai

pip install -e .

jupyter labextension develop bonxai --overwrite

# Exit to main folder
cd ..