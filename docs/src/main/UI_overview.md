# Overview and Guide to this User Manual

TMT Observatory will use many web applications to observe and manage the observatory instruments and telescope systems.
The TMT user interfaces can be grouped into two categories: observing user interfaces and engineering user interfaces.
Observing user interfaces will be developed as part of the ESW.HCMS work package. Each subsystem is responsible for an engineering user
interface for their subsystem.

The **OCS Engineering User Interface is the _engineering interface_ for the ESW Observatory Control System** or OCS. The purpose of OCS-ENG-UI
is to exercise the functionality of OCS. OCS-ENG-UI provides low-level control of OCS that allows us to understand and test OCS.

OCS-ENG-UI does not necessarily represent the observing user interface that will be used at the telescope during operations.

The OCS-ENG-UI provides a browser-based User Interface with the following capabilities that exercise the required functionality of the OCS.

* Provision Sequence Components on multiple computers
* Configure Sequencers based on the "obsMode" of an observing Sequence
* Indicate to the user which obsModes are possible at any specific time
* Track observatory resource usage by configured Sequencers
* Observatory resources and mapping between obsModes, Sequencers, and resources is configuration-based allowing quick changes without releasing a new version of the UI
* Track the progress of a Sequence that is submitted to a configured set of Sequencers
* Allows starting/shutdown of the OCS Sequence Manager
* See the individual steps and parameter values as they execute in the hierarchy of Sequencers
* Shutdown, abort, or restart individual Sequencers or Sequence Components

It also allows demonstration of features like running parallel observations in different obsModes by checking for any resource conflicts.

A screenshot of the OCS-ENG-UI showing the status of an executing Sequence is shown below.

![Status when Paused](images/ObservationStatus_Paused.png)

The UI has been developed based on the currently selected ESW UISTD tools and technologies for browser-based user interfaces:

* @link:[React](https://reactjs.org){ open=new }

* @link:[Ant Design](https://ant.design){ open=new }

* @link:[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/){ open=new }

* @link:[TypeScript](https://www.typescriptlang.org/){ open=new }

In addition, it is built using the [ESW-TS Typescript library](http://tmtsoftware.github.io/esw-ts/) that supports UI communication with CSW components including
Sequencers, Assemblies, and HCDs, as well as the use of CSW Services in user interfaces.

## User Manual Highlights

This manual aims at helping users understand how the OCS Engineering User Interface works and its different features.

* @ref:[Getting started](Getting-started.md) which describes the basic setup required to run this user interface on a browser.
* @ref:[Process Flow](UI_processflow.md) describes the user process flow to work in the UI.
* @ref:[Login and Home Page](Login_HomePage.md) explains login procedure and functionalities on the home page.
* @ref:[Manage Infrastructure](ManageInfrastructure.md) shows the agents started on different machines and describes how to provision, configure sequence components.
* @ref:[Manage Observation](ManageObservation.md) is where the sequences can be tracked for different observing modes. It also shows in-use, configurable and non-configurable resources
* @ref:[Manage Sequencer](ManageSequencer.md) is where sequence can be loaded, started, paused and resumed. Once sequence is loaded, other important features get enabled as explained in this page of the manual.
* @ref:[Resources](Resources.md) shows the resources and sequence components in-use and unavailable.
