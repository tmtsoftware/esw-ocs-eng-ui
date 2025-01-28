#!/usr/bin/env bash
ROOT="$(
    cd "$(dirname "$0")" >/dev/null 2>&1 || exit
    pwd -P
)"
SEQ_SCRIPT_VERSION=a818829
ESW_VERSION=4d97ed9
cs launch esw-services:$ESW_VERSION --channel https://raw.githubusercontent.com/tmtsoftware/osw-apps/Allan/pekko-scala3-update/apps.json --scala-version 3 -- start-eng-ui-services  --scripts-version $SEQ_SCRIPT_VERSION

