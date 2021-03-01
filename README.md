# ESW-OCS-ENG-UI

This project is a React web application.

## Prerequisites Required for Running OCS-UI Application

1. csw-services are required to be up & running.
    using sbt shell inside csw `csw-services/run start -k -c`

2. `AgentService`, along with one or more `Agent's` are required to be up & running.
    using sbt shell inside esw `esw-services/run start -agent --agent-service`

3. esw's latest binaries need to be present on machine with 0.1.0-SNAPSHOT version.
    run `sbt publishLocal` inside esw's sbt shell.
    Note: This step needs to be done atleast once and/or whenever new changes of esw are pulled from github.

The latest stable version of [Node.js](https://nodejs.org/en/download/package-manager/) must be installed.

## Run the Application in Local Environment

Run following commands in the terminal.

  ```bash
    npm install
    npm start
  ```

Then, open [localhost:8080](http://localhost:8080) in a browser

### Required backend services/components

* Location Service
* Auth Service - user with esw-user role is required
* Agent Service
* One or more agents should be up and running.

## Build the App for Production

Run following commands in the terminal.

```bash
npm install
npm run build
```

## Running Tests

```bash
npm test
```

## How to Use the Project

The project has following structure:

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

* `assets`: This directory contains all the files (images, audio etc) that are used by the UI component.
* `components`: App reusable functions / components created for this UI application.
* `config`: This contains the application specific configurations.
* `containers`: App reusable functions / utilities goes here.
* `test`: This directory contains all the tests for the UI application.
* `types`: This directory contains all the types that needs to be imported externally for UI application.

## References

* ESW-TS Library - [Link](https://tmtsoftware/esw-ts/)
* ESW-TS Library Documentation - [Link](https://tmtsoftware.github.io/esw-ts/)
