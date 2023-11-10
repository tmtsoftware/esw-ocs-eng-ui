#!/usr/bin/env bash
ROOT="$(
    cd "$(dirname "$0")" >/dev/null 2>&1 || exit
    pwd -P
)"
SEQ_SCRIPT_VERSION=0.1.0-SNAPSHOT
ESW_VERSION=0.1.0-SNAPSHOT
#cs launch esw-services:$ESW_VERSION --channel https://raw.githubusercontent.com/tmtsoftware/osw-apps/Allan/pekko-scala3-update/apps.json --scala-version 3 -- start-eng-ui-services  --scripts-version $SEQ_SCRIPT_VERSION

cs launch esw-services:$ESW_VERSION --channel file:///shared/work/tmt/csw/osw-apps/apps.json --scala-version 3 -- start-eng-ui-services  --scripts-version $SEQ_SCRIPT_VERSION
