#!/bin/bash

rm -rf $HOME/.nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
. $HOME/.nvm/nvm.sh
nvm install v22.15.0
npm install -g npm@10.9.2
. $HOME/.nvm/nvm.sh
echo "XXX HOME=$HOME, PATH=$PATH"
which npm
which node
npm --version
node --version
