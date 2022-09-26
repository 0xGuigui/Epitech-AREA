#!/usr/bin/env bash

node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
