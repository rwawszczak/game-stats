#!/bin/sh

cd /app
npm install || exit 1
npm install -g @angular/cli  || exit 1
ng build --no-progress  || exit 1
