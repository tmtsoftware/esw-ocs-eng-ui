import { ObsMode, Variation } from '@tmtsoftware/esw-ts'

export const obsModeAndVariationFrom = (componentName: string): [ObsMode, Variation | undefined] => {
  const parts = componentName.split('.')
  return parts.length > 1
    ? [new ObsMode(parts[0]), new Variation(parts.slice(1).join('.'))]
    : [new ObsMode(parts[0]), undefined]
}
