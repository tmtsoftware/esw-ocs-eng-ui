export const killComponentConstants = {
  getSuccessMessage: (componentId: string): string => `Successfully killed Sequence Component: ${componentId}`,
  getFailureMessage: (componentId: string): string => `Sequence Component (${componentId}) could not be killed`,
  menuItemText: 'Shutdown Component',
  modalOkButtonText: 'Delete',
  getModalTitle: (componentId: string): string => `Do you want to delete ${componentId} sequence component?`
}
