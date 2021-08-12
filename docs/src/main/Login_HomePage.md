# Login and Home Page

## Login

The below image shows a snapshot of the login screen :

![Login](./images/Login-Screen.png)

To access the Engineering UI portal, the user has to login with roles and credentials as specified below.

### Authorisation

For testing purposes, we are creating `osw-user1, esw-user1 & tcs-user1` users while launching the Keycloak from csw-services

Testing Purpose user-role osw-user can be used.

    Username: osw-user1         Password: osw-user1

For Auth Service esw-user role is required.

    Username: esw-user1         Password: esw-user1

## Home Page

Once login happens successfully the user should be able to see the below screen :

![Home Page](./images/HomePage.png)

### Spawn/Shutdown the Sequence Manager

This page shows a button to Spawn/Shutdown the Sequence Manager.

If Sequence Manager is spawned with agents then it shows label 'Shutdown' for the Sequence Manager.

![ShutdownSequenceManager](./images/HomePage_SequenceManager-ShutdownButton.png)

Clicking on 'Shutdown' button asks for confirmation before shutting down the Sequence Manager.

![ConfirmShutdownSequenceManager](./images/HomePage-ShutdownSequenceManagerConfirm.png)

Once Sequence Manager is shutdown then label changes to 'Spawn' and message of successful shutdown is displayed.

![Home Page](./images/HomePage_SequenceManager-SpawnButton.png)

After clicking on 'Spawn' button, select an agent to run Sequence Manager on.

![Home Page](./images/HomePage_SequenceManager-SpawnAfterShutdown.png)

Clicking on one of the agents, spawns Sequence Manager on that machine.

### Home Page also shows tabs for links to

* @ref[Manage Infrastructure](./ManageInfrastructure.md)
* @ref[Manage Observations](./ManageObservation.md)
* @ref[Resources](./Resources.md)
