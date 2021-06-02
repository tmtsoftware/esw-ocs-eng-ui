export const startSequencerConstants = {
  failureMessage: 'Failed to start sequencer',
  successMessage: 'Successfully started sequencer',
  startSequencerButtonText: 'Start Sequencer',
  inputErrorMessage: 'Please input subsystem and observation mode',
  modalTitle: 'Select a Subsystem and Observation Mode to spawn:',
  subsystemInputPlaceholder: 'Select a Subsystem',
  subsystemInputLabel: 'Subsystem',
  obsModeInputLabel: 'Observation Mode',
  obsModeInputPlaceholder: 'Enter Observation Mode',
  getAlreadyRunningErrorMessage: (prefix: string): string => `${prefix} is already running`
}
