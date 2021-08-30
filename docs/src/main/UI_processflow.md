# Process Flow for Users

This flow describes the various activities a user can perform in OCS-ENG-UI.  The text here describes the activities at a high level with links to more detailed explanations.


## Log in to OCS-ENG-UI

After following the installation and setup steps explained in @ref[Getting Started](./Getting-started.md), you should be able to see the `Login Page` of OCS-ENG-UI in the browser.
Log in as an authenticated user with credentials specified @ref[here](./Login_HomePage.md#authentication-and-authorization).

Once logging in is successful, the user will be in the `Home Page` of ESW-ENG-UI.
From here, the user shall be able to follow the steps below to manage an observation in the User Interface.

## Spawn Sequence Manager

Sequence Manager is a critical OCS service that manages the configuration of Sequence Components and Sequencers based on an observation's observing mode or `obsMode`.
It can start, monitor, and shutdown Sequence Components. Sequence Manager also determines which resources are required to execute a Sequence for an obsMode.
It helps in executing multiple observation Sequences concurrently by preventing resource conflicts when attempting to run Sequences simultaneously.
Hence, it is mandatory that the Sequence Manager be up and running on a machine/Agent.

If Sequence Manager hasn't been started after logging in, then on the Home Page, the user can click on 'Spawn' Button to
start Sequence Manager as explained @ref[here](./Login_HomePage.md#spawn-shutdown-the-sequence-manager)

@@@ note

To understand the Sequence Manager states, please visit the Sequence Manager technical documentation @extref[here](esw:////technical/sequence-manager-tech.html#sequence-manager-states).

@@@

## Provision Sequence Components

Once the Sequence Manager has been spawned, the user is ready to provision Sequence Components per Agent. Provisioning is the allocation and starting
of Sequence Components on machines that are available to run Sequencers.  An Agent process must be running on a machine in order for it to participate in provisioning.

As explained @ref[here](./ManageInfrastructure.md#provisioning) the user can specify the number of Sequence Components to be spawned per Agent.

@@@ note

To know more about the provision functionality see @extref[here](esw:technical/sequence-manager-tech.html#provision-sequence-components).

@@@

## Configuring for an Observation

Once the Sequence Components are provisioned, Sequence Manager can take the configure step. Configure is used to create and start the Sequencers needed for an observing mode.
A Sequence Componnet, when configured with an obsMode, becomes a Sequencer. There must always be enough Sequence Components to running to handle all the Sequencers needed for all
concurrently executing observations.

Once configured for an obsMode, the Sequencers can be used to run Sequences in that obsMode.
Unless there is a conflict in the resources required for an observation, TMT can run multiple observations at a time. The Configure feature hence checks for any
resource conflicts with ongoing observations.

Users can configure from either the @ref[Manage Infrastructure](./ManageInfrastructure.md#configure) page or the @ref[Manage Observation](./ManageObservation.md#the-configurable-tab) page of the UI.

@@@ note

To know more about configure functionality see @extref[here](esw:technical/sequence-manager-tech.html#configuring-sequencers-for-an-observing-mode).

@@@

When changing instruments or observing modes, users will also shut down a running observation as explained @ref[here](./ManageObservation.md#shutdown-sequencers)
and configure the system for another observation's Sequencers. This operation takes no more than a couple seconds.

## Managing an Observation

To manage an observation, a user can go to the @ref[Manage Observation](./ManageObservation.md) page. Here the user can see three tabs: `Running`, `Configurable`, and `Non-Configurable`.
OCS-ENG-UI is an engineering user interface.  Therefore it provides low-level access to many features of OCS that are not expected to be used during normal operations.

The Running tab shows the obsModes that **are currently configured** with Sequencers and available to
run Sequences.

The Configurable tab shows obsModes that **may be configured** after considering the resources used by the Running tab obsModes.

Finally, the Non-Configurable tab shows
which obsModes **can not be configured** and the reasons why they can not be configured.

In the Running tab as explained @ref[here](./ManageObservation.md#the-running-tab) the user can:

* Configure Sequencers
* Shut down a running observation
* Track running Sequencers and sequences as explained @ref[here](./ManageObservation.md#tracking-a-sequence)
* Reload a Script by stopping and restarting the sequencer.
* View resources in use or available.

In the Configurable tab as explained @ref[here](./ManageObservation.md#the-configurable-tab) the user can view the obsModes and resources available and also configure a selected obsMode using the 'Configure' button.

In the Non-Configurable tab as explained @ref[here](./ManageObservation.md#the-non-configurable-tab) users can see the reasons an obsMode is not configurable either due to resources already in use
or unavailability of Sequence Components.

## Manage Sequencers

Once Sequencers have been configured, a user can go to the @ref[Manage Sequencer](./ManageSequencer.md) page by clicking on the gear icon next to name of the Sequencer.

### Load Sequence

Users may load a Sequence as explained @ref[here](./ManageSequencer.md#loading-a-sequence). This is a low-level command for engineering purposes.
Once a Sequence is loaded, a user should be able to see each Step of the Sequence before it executes. Clicking on a Step shows the Step's parameters on the right.

### Go Online/Go Offline

A user can instruct Sequencers to Go Offline/Go Online @ref[functionality](./ManageSequencer.md#go-offline-go-online) to change status of Sequencers to Offline or Online.
No Sequence can run on Sequencers that are in the offline state.

### Start, Pause/Resume Sequence

Sequencers can be commanded to begin executing immediately when a Sequence is received, or execution can happen in two steps: load Sequence followed by start Sequence. Both are useful in different
circumstances.

Once a Sequencer is Online and Loaded, a user can start the Sequence by clicking on start button as explained @ref[here](./ManageSequencer.md#starting-a-sequence). Once a Sequencer is started,
the icon will change to Pause icon and also the first step will be in the green color indicating it is executing.

A Sequence can be paused/resumed as explained @ref[here](./ManageSequencer.md#pause-and-resume-sequence).

### Stop, Abort Sequence

Sequencers support the familiar observing concept of observation/Sequence Stop and Abort. Once a Sequence starts executing, the following buttons get activated:

* @ref[Stop Sequence](./ManageSequencer.md#stop-sequence) - This feature is used to clear/save Sequencer state and any science data before stopping.

* @ref[Abort Sequence](./ManageSequencer.md#abort-sequence) - This feature is used to clean up tasks before aborting. Sequence is aborted in any case at the end. Science data is saved if possible, but
the Sequence ends as soon as possible.

### Step Functionalities

OCS-ENG-UI allows low-level control and monitoring of the Sequence as it is executing including single-stepping, setting breakpoints, and even adding steps.
Once a Sequence starts executing, each Step in the Sequence offers the following features. Click on any of the features below to understand how to use it in UI.

* @ref[Insert/remove breakpoint](./ManageSequencer.md#insert-and-remove-breakpoint)

* @ref[Add Steps](./ManageSequencer.md#adding-steps)

* @ref[Delete Steps](./ManageSequencer.md#delete-step)

* @ref[Duplicate a Step](./ManageSequencer.md#duplicate-steps)

## Tracking Sequence Progress

Once a Sequence is executing or completed, a user can track status of the Sequence or the Steps completed in the @ref[Manage Observation](./ManageObservation.md) page as explained @ref[here](./ManageObservation.md#tracking-a-sequence).

## Resources Page

The @ref[Resources](./Resources.md) Page displays the list of Sequencer Subsystem, their status and the  observation mode that they are running on.
