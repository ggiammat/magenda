import { LocalFilesItemSource } from './source'

export const register = (registerTypesLookup, registerSource) => {
  registerSource('localFiles', LocalFilesItemSource)
}
