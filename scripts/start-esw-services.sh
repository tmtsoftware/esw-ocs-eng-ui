#!/usr/bin/env bash
ROOT="$(
    cd "$(dirname "$0")" >/dev/null 2>&1 || exit
    pwd -P
)"
SEQ_SCRIPT_VERSION=b2534e4
ESW_VERSION=3b1cd42
cs launch esw-services:$ESW_VERSION -- start-eng-ui-services  --scripts-version $SEQ_SCRIPT_VERSION
