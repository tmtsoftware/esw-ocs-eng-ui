#!/usr/bin/env bash
# make sure cs add-channel is already done
# cs channel --add https://raw.githubusercontent.com/tmtsoftware/apps/master/apps.json 

export INTERFACE_NAME=en0
export AAS_INTERFACE_NAME=en0
export TMT_LOG_PATH=/tmp

nohup cs launch --execve csw-services -- start -k -c &
sleep 10000
echo "spawned loaction, config & keycloak server"
nohup cs launch --execve agent-service-app -- start &
echo "spawned agent service app"
nohup cs launch --execve esw-services -- start -a &
echo "spawned agent"