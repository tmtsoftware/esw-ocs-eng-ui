#!/usr/bin/env bash
ROOT="$(
    cd "$(dirname "$0")" >/dev/null 2>&1 || exit
    pwd -P
)"

set -x
npm run build || exit 1
rm -rf $ROOT/../apps/esw-ocs-eng-ui
## use following for installing latest eng-ui
mv $ROOT/../esw-ocs-eng-ui $ROOT/../apps/esw-ocs-eng-ui
cd $ROOT/../apps
./serve.py
