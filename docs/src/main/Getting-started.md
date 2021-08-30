# Getting Started

## Prerequisites

The `v15.x` version of [Node.js](https://nodejs.org/en/download/package-manager/) must be installed.

### Install the ESW-OCS-ENG-UI source repository

At this time, OCS-ENG-UI can only be run from the UI source directory. This means you must first check out
the source code from [this repository](https://github.com/tmtsoftware/esw-ocs-eng-ui).  Follow the typical GitHub instructions
describing how to clone a repository.

### Required backend services/components

To see the OCS-ENG-UI working, it is necessary to have a few pieces of infrastructure running including:

* CSW Location Service
* CSW Auth Service - user with esw-user role is required
* Sequence Manager
* Agent Service
* One or more Agents should be up and running.

### Running backend services locally

1. csw-services should be up & running.

    To install and start the csw-services please follow the instruction given
   @link:[here](https://tmtsoftware.github.io/csw/4.0.0-RC1/apps/cswservices.html)

2. The latest binaries of ESW need to be present on machine. Current latest : 0.3.0-RC1.
  `cs install esw-services:0.3.0-RC1`
  Note: This step needs to be done at least once and/or whenever new changes of esw are pulled from GitHub.

3. To start esw services follow instruction @link:[here](https://github.com/tmtsoftware/esw/tree/master/esw-services#running-the-esw-services-using-coursier)

* OCS-ENG-UI requires `AgentService` along with one or more agent should be up & running to manage observations on various agent/machine. To start, run following command `esw-services start --agent --agent-service`.

* Sequence manager could be started from UI. However, Sometimes you may want to work in a simulation environment & to start a simulated Sequence Manager, use
    `esw-services start --agent-service -s --simulation`
* Alternatively, You can use `esw-services start-eng-ui-services` command to start all the required services and agents required to test the observation scripts written in repo `sequencer-scripts/ui-setup` branch.

## Run the ESW-OCS-ENG-UI Application in Local Environment

Open the cloned esw-ocs-eng-ui repository on your terminal and then follow the instruction below:

Run following commands in the terminal.

```bash
  npm install
  npm start
```

## Required File Configuration for an ObsMode

ESW-ENG-UI has 2 configuration files that can be modified for testing and operations. These files are kept in the Configuration Service.

To simplify testing, the necessary configuration files with testing data are added for you in Configuration Service when you start `esw-services` with `start-eng-ui-services` flag.

```bash
sbt:shell> esw-services/run start-eng-ui-services
```

When you would want to configure an ObsMode other than the ones present in the test configuration files (in `ui-setup` branch), follow these steps to configure required files for setting up new ObsModes.

1. version.conf at path `/tmt/osw/version.json`
2. provisionConf.conf at path `/tmt/esw/smProvisionConfig.conf`
3. smObsModeConf.conf : sequence manager takes path argument.

For example, lets say you want to start an `ESW-Darknight` observation, and it requires 2 resources & Sequencers, Namely ESW & TCS.

Following are the configuration files required to start an observation using `esw-ocs-eng-ui`.

* Version file is used by agent service to spawn sequence manager & sequence components while provisioning with appropriate versions.
This file need to be saved at `/tmt/osw/version.conf` with the following json content.

```json
{
  "scripts": $scriptVersion,
  "esw": $eswVersion
}
```

* Next, we need to save `smObsModeConfig.conf` file in Configuration Service containing information related to ESW-Darknight while starting Sequence Manager.
Sequence Manager uses this information to configure an observation, i.e. start Sequencers on provisioned Sequence Components.

```hocon
esw-sm {
  obsModes: {
    IRIS_Darknight: {
      resources: [ESW, TCS, IRIS]
      sequencers: [ESW, TCS, IRIS]
    }
  }
}
```

This file indicates to Sequence Manager that the IRIS_Darknight obsMode requires the ESW, TCS, and IRIS resources, and Sequence Manager
will attempt to start a Sequencer for ESW, TCS, and IRIS. It will look for an IRIS_Darknight script in the `sequencer-script` repository for each Sequencer.

Provisioning is the deployment and starting of Sequence Components on machines that will be available for Sequencers.
For a machine to be available for provisioning, it must have an Agent running.

* For provisioning, Sequence Manager needs a provision configuration containing information on how many Sequence Components to start on running Agents/machines.
This file needs to present at this path `/tmt/esw/smProvisionConfig.conf` in the Configuration Service.

```hocon
esw-sm {
  provision {
    ESW: 2
    IRIS: 1
  }
}
```

This is the default provision configuration. It is also possible to override this and create a different provision configuration using the OCS-ENG-UI.

To learn how to save a file in config service, visit @extref[here](csw:services/config.html#create).

@@@ note
There must also be Sequencer scripts written in Kotlin for all the Sequencers in all obsModes, and the need to be present in sequencer-script repository.
These scripts are assumed to be written in such a way that they would perform actions on receiving pre-defined commands. This subject is not covered in
this manual.
@@@

Follow along in the guide to User Process Flow to learn about starting and managing observations in ENG-OCS-UI @ref[here](UI_processflow.md).
