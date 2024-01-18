#!/usr/bin/env bash

CSW_VERSION=103a389
cs launch csw-services:$CSW_VERSION --channel https://raw.githubusercontent.com/tmtsoftware/osw-apps/Allan/pekko-scala3-update/apps.json --scala-version 3  -- start -e -c -k
