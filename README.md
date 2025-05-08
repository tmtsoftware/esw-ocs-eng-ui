# ESW-OCS-ENG-UI

This project is a React web application.

## Prerequisites required for running ESW-OCS-ENG-UI application

1. csw-services should be up & running.
    - it starts location service, config-service & aas server.

> `./scripts/start-csw-services.sh`

2. Start esw services
    - `AgentService` along with one or more agent should be up & running. To start, run following command inside ESW sbt shell `esw-services/run start --agent --agent-service`.

    - Alternatively, to run esw-services with a simulated Sequence Manager, use
    `esw-services/run start --agent-service -s --simulation`

    - You can use `esw-services/run start-eng-ui-services` command to start all the services and agents required to test the scripts written in repo sequncer-scripts/ui-setup branch.

> `./scripts/start-esw-services.sh` (recommended way).

The `v20.x` version of [Node.js](https://nodejs.org/en/download/package-manager/) must be installed.

## User role for login

For testing purposes, we are creating a `osw-user1` while launching the Keycloak from csw-services

Username: osw-user1
Password: osw-user1

## Run the Application in Local Environment

Run following commands in the terminal.

  ```bash
    npm install
    ./scripts/start-eng-ui.sh
  ```

Then, open [localhost:8080/esw-ocs-eng-ui](http://localhost:8000/esw-ocs-eng-ui/) in a browser

### Required backend services/components

- Location Service
- Auth Service - user with esw-user role is required
- Agent Service
- One or more agents should be up and running.

## Build the App for Production

Run following commands in the terminal.

```bash
npm install
npm run build
```

## Running Tests

To run test:

```bash
npm test
```

To run test in watch mode:

```bash
npm run test:unit:watch
```

## How to Use the Project

The project has the following structure:

```bash
.
├── src
│   ├── assets
│   ├── components
|   ├── containers
│   ├── config
│   ├── features
│   ├── routes
├── test
├── types
```

- `assets`: This directory contains all the files (images, audio etc) that are used by the UI component.
- `components`: App reusable functions / components created for this UI application.
- `config`: This contains the application specific configurations.
- `containers`: App reusable functions / utilities goes here.
- `test`: This directory contains all the tests for the UI application.
- `types`: This directory contains all the types that needs to be imported externally for UI application.

## Version compatibility

| esw-ocs-eng-ui | esw        | csw        | esw-ts     |
|----------------|------------|------------|------------|
| v1.0.0         | v1.0.0     | v6.0.0     | v1.0.2     |
| v1.0.0-RC3     | v1.0.0     | v6.0.0     | v1.0.0-RC1 |
| v0.3.1         | v0.5.1     | v5.0.1     | v0.4.1     |
| v0.3.1-RC1     | v0.5.1-RC1 | v5.0.1-RC1 | v0.4.1-RC1 |
| v0.3.0         | v0.5.0     | v5.0.0     | v0.4.0     |
| v0.3.0-RC2     | v0.5.0-RC2 | v5.0.0-RC2 | v0.4.0-RC2 |
| v0.3.0-RC1     | v0.5.0-RC1 | v5.0.0-RC1 | v0.4.0-RC1 |
| v0.2.0         | v0.4.0     | v4.0.1     |            |
| v0.2.0-RC1     | v0.4.0-RC1 | v4.0.1-RC1 |            |
| v0.1.0         | v0.3.0     | v4.0.0     |            |
| v0.1.0-RC2     | v0.3.0-RC2 | v4.0.0-RC2 |            |
| v0.1.0-RC1     | v0.3.0-RC1 | v4.0.0-RC1 |            |
| v0.1.0-M1      | v0.3.0-M1  | v4.0.0-M1  |            |

## Public Release History

| Date       | Tag    | Source                                                                            | Docs                                                                             | Assets                                                                                           |
|------------|--------|-----------------------------------------------------------------------------------|----------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| 2025-05-08 | v1.0.0 | [esw-ocs-eng-ui-1.0.0](https://github.com/tmtsoftware/esw-ocs-eng-ui/tree/v1.0.0) | [esw-ocs-eng-ui-1.0.0 docs](https://tmtsoftware.github.io/esw-ocs-eng-ui/1.0.0/) | [esw-ocs-eng-ui-1.0.0 assets](https://github.com/tmtsoftware/esw-ocs-eng-ui/releases/tag/v1.0.0) |
| 2023-04-13 | v0.3.1 | [esw-ocs-eng-ui-0.3.1](https://github.com/tmtsoftware/esw-ocs-eng-ui/tree/v0.3.1) | [esw-ocs-eng-ui-0.3.1 docs](https://tmtsoftware.github.io/esw-ocs-eng-ui/0.3.1/) | [esw-ocs-eng-ui-0.3.1 assets](https://github.com/tmtsoftware/esw-ocs-eng-ui/releases/tag/v0.3.1) |
| 2022-11-15 | v0.3.0 | [esw-ocs-eng-ui-0.3.0](https://github.com/tmtsoftware/esw-ocs-eng-ui/tree/v0.3.0) | [esw-ocs-eng-ui-0.3.0 docs](https://tmtsoftware.github.io/esw-ocs-eng-ui/0.3.0/) | [esw-ocs-eng-ui-0.3.0 assets](https://github.com/tmtsoftware/esw-ocs-eng-ui/releases/tag/v0.3.0) |
| 2022-02-09 | v0.2.0 | [esw-ocs-eng-ui-0.2.0](https://github.com/tmtsoftware/esw-ocs-eng-ui/tree/v0.2.0) | [esw-ocs-eng-ui-0.2.0 docs](https://tmtsoftware.github.io/esw-ocs-eng-ui/0.2.0/) | [esw-ocs-eng-ui-0.2.0 assets](https://github.com/tmtsoftware/esw-ocs-eng-ui/releases/tag/v0.2.0) |
| 2021-09-23 | v0.1.0 | [esw-ocs-eng-ui-0.1.0](https://github.com/tmtsoftware/esw-ocs-eng-ui/tree/v0.1.0) | [esw-ocs-eng-ui-0.1.0 docs](https://tmtsoftware.github.io/esw-ocs-eng-ui/0.1.0/) | [esw-ocs-eng-ui-0.1.0 assets](https://github.com/tmtsoftware/esw-ocs-eng-ui/releases/tag/v0.1.0) |

## Pre-Release History

| Date       | Tag        | Source                                                                                    | Docs                                                                                     | Assets                                                                                                   |
|------------|------------|-------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| 2025-05-05 | v1.0.0-RC3 | [esw-ocs-eng-ui-1.0.0-RC3](https://github.com/tmtsoftware/esw-ocs-eng-ui/tree/v1.0.0-RC3) | [esw-ocs-eng-ui-1.0.0-RC3 docs](https://tmtsoftware.github.io/esw-ocs-eng-ui/1.0.0-RC3/) | [esw-ocs-eng-ui-1.0.0-RC3 assets](https://github.com/tmtsoftware/esw-ocs-eng-ui/releases/tag/v0.3.1-RC1) |
| 2022-10-04 | v0.3.1-RC1 | [esw-ocs-eng-ui-0.3.1-RC1](https://github.com/tmtsoftware/esw-ocs-eng-ui/tree/v0.3.1-RC1) | [esw-ocs-eng-ui-0.3.1-RC1 docs](https://tmtsoftware.github.io/esw-ocs-eng-ui/0.3.1-RC1/) | [esw-ocs-eng-ui-0.3.1-RC1 assets](https://github.com/tmtsoftware/esw-ocs-eng-ui/releases/tag/v0.3.1-RC1) |
| 2022-10-10 | v0.3.0-RC2 | [esw-ocs-eng-ui-0.3.0-RC2](https://github.com/tmtsoftware/esw-ocs-eng-ui/tree/v0.3.0-RC2) | [esw-ocs-eng-ui-0.3.0-RC2 docs](https://tmtsoftware.github.io/esw-ocs-eng-ui/0.3.0-RC2/) | [esw-ocs-eng-ui-0.3.0-RC2 assets](https://github.com/tmtsoftware/esw-ocs-eng-ui/releases/tag/v0.3.0-RC2) |
| 2022-10-04 | v0.3.0-RC1 | [esw-ocs-eng-ui-0.3.0-RC1](https://github.com/tmtsoftware/esw-ocs-eng-ui/tree/v0.3.0-RC1) | [esw-ocs-eng-ui-0.3.0-RC1 docs](https://tmtsoftware.github.io/esw-ocs-eng-ui/0.3.0-RC1/) | [esw-ocs-eng-ui-0.3.0-RC1 assets](https://github.com/tmtsoftware/esw-ocs-eng-ui/releases/tag/v0.3.0-RC1) |
| 2022-02-01 | v0.2.0-RC1 | [esw-ocs-eng-ui-0.2.0-RC1](https://github.com/tmtsoftware/esw-ocs-eng-ui/tree/v0.2.0-RC1) | [esw-ocs-eng-ui-0.2.0-RC1 docs](https://tmtsoftware.github.io/esw-ocs-eng-ui/0.2.0-RC1/) | [esw-ocs-eng-ui-0.2.0-RC1 assets](https://github.com/tmtsoftware/esw-ocs-eng-ui/releases/tag/v0.2.0-RC1) |
| 2021-09-20 | v0.1.0-RC2 | [esw-ocs-eng-ui-0.1.0-RC2](https://github.com/tmtsoftware/esw-ocs-eng-ui/tree/v0.1.0-RC2) | [esw-ocs-eng-ui-0.1.0-RC2 docs](https://tmtsoftware.github.io/esw-ocs-eng-ui/0.1.0-RC2/) | [esw-ocs-eng-ui-0.1.0-RC2 assets](https://github.com/tmtsoftware/esw-ocs-eng-ui/releases/tag/v0.1.0-RC2) |
| 2021-08-24 | v0.1.0-RC1 | [esw-ocs-eng-ui-0.1.0-RC1](https://github.com/tmtsoftware/esw-ocs-eng-ui/tree/v0.1.0-RC1) | [esw-ocs-eng-ui-0.1.0-RC1 docs](https://tmtsoftware.github.io/esw-ocs-eng-ui/0.1.0-RC1/) | [esw-ocs-eng-ui-0.1.0-RC1 assets](https://github.com/tmtsoftware/esw-ocs-eng-ui/releases/tag/v0.1.0-RC1) |
| 2021-07-13 | v0.1.0-M1  | [esw-ocs-eng-ui-0.1.0-M1](https://github.com/tmtsoftware/esw-ocs-eng-ui/tree/v0.1.0-M1)   | [esw-ocs-eng-ui-0.1.0-M1 docs](https://tmtsoftware.github.io/esw-ocs-eng-ui/0.1.0-M1/)   | [esw-ocs-eng-ui-0.1.0-M1 assets](https://github.com/tmtsoftware/esw-ocs-eng-ui/releases/tag/v0.1.0-M1)   |

## References

- ESW-TS Library - [Link](https://github.com/tmtsoftware/esw-ts/)
- ESW-TS Library Documentation - [Link](https://tmtsoftware.github.io/esw-ts/)
