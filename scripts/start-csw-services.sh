#!/usr/bin/env bash

CSW_VERSION=2f05249
cs launch csw-services:$CSW_VERSION --channel https://raw.githubusercontent.com/tmtsoftware/osw-apps/branch-6.0.x/apps.json --scala-version 3  -- start -e -c -k
