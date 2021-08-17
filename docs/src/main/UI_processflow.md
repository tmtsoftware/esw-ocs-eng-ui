# Process Flow

After following all steps as explained in page - @ref[Getting Started](./Getting-started.md), you should be able to see Login Page on the browser.

Log in as an authenticated user with credentials specified @ref[here](./Login_HomePage.md#authorisation).

Once Login is successful, user shall be able to follow the below steps to manage an observation in the User Interface.

## Spawn Sequence Manager

Sequence Manager manages the configurations of Sequence Components using the observation mode. It helps in executing multiple Sequences concurrently. It also prevents resource conflicts when running sequences simultaneously. It can start , monitor and shutdown Sequence Components. Sequence Manager also determines which resources are required to execute a sequence. Hence it is mandatory that the Sequence Manager should be up and running on a machine. If Sequence Manager hasn't been started then on the Home Page, user can click on 'Spawn' Button to start Sequence Manager as explained @ref[here](./Login_HomePage.md#spawn-shutdown-the-sequence-manager)

@@@ note

To understand states of Sequence Manager please visit @extref[here](esw:////technical/sequence-manager-tech.html#sequence-manager-states)

@@@

## Provision Sequence Components

Once the Sequence Manager has been spawned, now user can provision Sequence Components per Agent. As explained @ref[here](./ManageInfrastructure.md#provision) the user can specify the number of sequence component to be spawned per agent.

@@@ note

To know more about Provision functionality @extref[Read Here](esw:technical/sequence-manager-tech.html#provision-sequence-components)

@@@

## Configure Sequencer

Once the Sequence Components are provisioned, Sequence Manager can take the configure step. Configure is used for starting Sequencers needed for an observing mode. Unless there is a conflict in the resources required for observation, TMT can run multiple observation at a time. The Configure feature  hence checks for any resource conflicts with ongoing observations.
User can configure from either @ref[Manage Infrastructure](./ManageInfrastructure.md#configure) or the @ref[Manage Observation](./ManageObservation.md#configurable) page of the UI.

@@@ note

To know more about Configure Functionality @extref[visit here](esw:technical/sequence-manager-tech.html#configuring-sequencers-for-an-observing-mode)

@@@

User can also shutdown the running observation as explained @ref[here](./ManageObservation.md#shutdown-sequencer) and configure another sequencer.

## Manage Observation

To manage an observation, user can go to @ref[Manage Observation](./ManageObservation.md) page.

Here user can see three tabs : Running, Configurable and Non-Configurable.

In the Running tab as explained @ref[here](./ManageObservation.md#running) user can

* Configure Sequencers
* Shutdown running observation
* Track running Sequencers and sequences as explained @ref[here](./ManageObservation.md#tracking-sequence)
* Reload Script by stopping and restarting the sequencer.
* View resources in use or available.

In the Configurable tab as explained @ref[here](./ManageObservation.md#configurable) user can view the resources available and also configure them using 'Configure' button.

In the Non-Configurable tab as explained @ref[here](./ManageObservation.md#non-configurable) users can see resources in use and unavailable sequence components.

## Manage Sequencers

Once Sequencers have been configured, user can go to @ref[Manage Sequencer](./ManageSequencer.md) page by clicking on gear icon next to name of the Sequencer.

### Load Sequence

User can then Load Sequence as explained @ref[here](./ManageSequencer.md#loading-a-sequence). Once sequence is loaded, user should be able to see the each command as a step. Clicking on each steps should show the parameter table on the right.

### Go Online/Go Offline

User can use Go Online/Go Offline @ref[functionality](./ManageSequencer.md#go-offline-go-online) to change status of the sequencer to Online/ Offline. No Sequence can run on a sequencer which is in offline state.

### Start, Pause/Resume Sequence

Once Sequencer is Online and Loaded, user can start the sequence by clicking on start button as explained @ref[here](./ManageSequencer.md#starting-a-sequence). Once sequencer is started, the icon will change to Pause icon and also the first step will be in green color.

Sequence can be paused/resumed as explained @ref[here](./ManageSequencer.md#pause-and-resume-sequence).

### Stop, Abort Sequence

Once sequence starts executing, following buttons get activated

* @ref[Stop Sequence](./ManageSequencer.md#stop-sequence) - This feature is used to clear/save Sequencer state before stopping.

* @ref[Abort Sequence](./ManageSequencer.md#abort-sequence) - This feature is used to clean up tasks before aborting. Sequence is aborted in any case at the end.  

### Step Functionalities

 Once sequence is loaded and when sequence starts executing, each Step in the sequence offers the below features. Click on any of feature below to understand how to do it in UI.

* @ref[Insert/remove breakpoint](./ManageSequencer.md#insert-and-remove-breakpoint)

* @ref[Add Steps](./ManageSequencer.md#add-step)

* @ref[Delete Steps](./ManageSequencer.md#delete-step)

* @ref[Duplicate Step](./ManageSequencer.md#duplicate-step)

## Tracking Sequence

Once the sequence is executing or completed, user can track status of the sequence or the steps completed in  @ref[Manage Observation](./ManageObservation.md) page as explained @ref[here](./ManageObservation.md#tracking-sequence).

## Resources Page

@ref[Resource](./Resources.md) page displays the list of Sequencer Subsystem, their status and the  observation mode that they are running on.
