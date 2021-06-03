import type { Prefix } from '@tmtsoftware/esw-ts'

export const startSequencerConstants = {
  successMessage: 'Successfully started sequencer',
  failureMessage: 'Failed to start sequencer',
  startSequencerButtonText: 'Start Sequencer',
  inputErrorMessage: 'Please input subsystem and observation mode',
  modalTitle: 'Select a Subsystem and Observation Mode to spawn:',
  subsystemInputPlaceholder: 'Select a Subsystem',
  subsystemInputLabel: 'Subsystem',
  obsModeInputLabel: 'Observation Mode',
  obsModeInputPlaceholder: 'Enter Observation Mode',
  getAlreadyRunningErrorMessage: (prefix: string): string => `${prefix} is already running`
}

export const stopSequencerConstants = {
  successMessage: (sequencerPrefix: Prefix): string => `Successfully stopped sequencer ${sequencerPrefix.toJSON()}`,
  failureMessage: (sequencerPrefix: Prefix): string => `Failed to stop sequencer ${sequencerPrefix.toJSON()}`,
  menuItemText: 'Stop Sequencer',
  modalOkButtonText: 'Stop',
  getModalTitle: (sequencerPrefix: string): string => `Are you sure you want to stop sequencer '${sequencerPrefix}'?`
}

export const reloadSequencerConstants = {
  getSuccessMessage: (sequencerPrefix: string): string => `Successfully loaded script ${sequencerPrefix}`,
  getFailureMessage: (sequencerPrefix: string): string => `Failed to load script ${sequencerPrefix}`,
  menuItemText: 'Reload Script',
  modalOkButtonText: 'Reload',
  getModalTitle: (subsystem: string, obsMode: string): string =>
    `Do you want to reload the sequencer ${subsystem}.${obsMode}?`
}
