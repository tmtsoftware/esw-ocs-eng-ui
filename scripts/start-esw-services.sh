#!/usr/bin/env bash
ROOT="$(
    cd "$(dirname "$0")" >/dev/null 2>&1 || exit
    pwd -P
)"
SEQ_SCRIPT_VERSION=b2534e4
ESW_VERSION=4c53f71
cs launch esw-services:$ESW_VERSION --channel https://raw.githubusercontent.com/tmtsoftware/osw-apps/Allan/pekko-scala3-update/apps.json --scala-version 3 -- start-eng-ui-services  --scripts-version $SEQ_SCRIPT_VERSION
