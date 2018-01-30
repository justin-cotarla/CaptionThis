#!/bin/bash

cd frontend
npm install
npm run build

mv build ../server/build