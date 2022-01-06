#!/usr/bin/env bash
ROOT="$(
    cd "$(dirname "$0")" >/dev/null 2>&1 || exit
    pwd -P
)"

npm run build
rm -rf $ROOT/../apps/esw-ocs-eng-ui
## use following for installing latest eng-ui
mv $ROOT/../esw-ocs-eng-ui $ROOT/../apps/esw-ocs-eng-ui
cd $ROOT/../apps
./serve.py
