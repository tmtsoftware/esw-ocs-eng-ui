#!/bin/sh

if test ! -d chrome-linux64; then
  wget https://storage.googleapis.com/chrome-for-testing-public/135.0.7049.84/linux64/chrome-linux64.zip
  unzip chrome-linux64.zip
fi

