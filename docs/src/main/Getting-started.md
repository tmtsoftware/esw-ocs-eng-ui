# Getting started

## Prerequisites

The `v15.x` version of [Node.js](https://nodejs.org/en/download/package-manager/) must be installed.

### Required backend services/components

* Location Service
* Auth Service - user with esw-user role is required
* Agent Service
* One or more agents should be up and running.

### Running backend services locally

1. csw-services should be up & running.
   using sbt shell inside CSW `csw-services/run start -k -c`.

2. The latest binaries of ESW need to be present on machine with 0.1.0-SNAPSHOT version.
   run `sbt publishLocal` inside ESW sbt shell.
   Note: This step needs to be done atleast once and/or whenever new changes of esw are pulled from github.

3. Start esw services
  *  OCS-ENG-UI requires `AgentService` along with one or more agent should be up & running to manage observations on various agent/machine. To start, run following command inside ESW sbt shell `esw-services/run start --agent --agent-service`.

  * Sequence manager could be started from UI. However, Sometimes you may want to work in a simulation environment & to start a simulated Sequence Manager, use
    `esw-services/run start --agent-service -s --simulation`

  * Alternatively, You can use `esw-services/run start-eng-ui-services` command to start all the required services and agents required to test the observation scripts written in repo `sequencer-scripts/ui-setup` branch.

## Run the ESW-OCS-ENG-UI Application in Local Environment

Run following commands in the terminal.

  ```bash
    npm install
    npm start
  ```

## Required file configuration for an ObsMode

The following configuration files with testing data are added for you in config service when you start `esw-services` with `start-eng-ui-services` flag.

```bash
sbt:shell> esw-services/run start-eng-ui-services
```

When you would want to configure an ObsMode other than the one's present in `ui-setup` branch, follow the steps to configure required files for setting up new ObsModes.

1. version.conf at path `/tmt/osw/version.json`
2. provisionConf.conf at path `/tmt/esw/smProvisionConfig.conf`
3. smObsModeConf.conf : sequence manager takes path argument.

For example, lets say you want to start an `ESW-Darknight` observation and it requires 2 resources & Sequencers, Namely ESW & TCS.

Following are the configuration files required to start an observation using `esw-ocs-eng-ui`.

* First, we must have sequencer scripts written in kotlin for both the sequencers, need to be present in sequencer-script repo. These scripts are assumed to be written in such a way that they would perform actions on recieving pre-defined commands.

* Version file is used by agent service to spawn sequence manager & sequence components while provisioning with appropriate versions. This file need to be saved at `/tmt/osw/version.conf` with the following json content.

```json
{
  "scripts": $scriptVersion,
  "esw": $eswVersion
}
```

* Next, we need to save `smObsModeConfig.conf` file in config service containing information related to ESW-Darknight while starting sequence manager. Sequence manager uses this information to configure an observation,i.e start sequencers on provisioned sequence components.

```hocon
esw-sm {
  obsModes: {
    IRIS_Darknight: {
      resources: [ESW, TCS]
      sequencers: [ESW, TCS]
    }
  }
}
```

* For provisioning, Sequence manager needs a provision config containing information on how many sequence components to start on running agents/machines.
This file needs to present at this path `/tmt/esw/smProvisionConfig.conf` in config service.

```hocon
esw-sm {
  provision {
    ESW: 2
    IRIS: 1
  }
} 
```

To learn how to save a file in config service, visit @extref[here](csw:services/config.html#create).

Follow along the guide to on how to start observation on UI @ref[here](./Login_HomePage.md).
