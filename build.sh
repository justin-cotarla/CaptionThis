#!/bin/bash

cd frontend
npm install
npm run build

rm -rf ../server/build
mv build ../server/build
