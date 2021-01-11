import { O365ItemSource } from './source'

export const register = (registerTypesLookup, registerSource) => {
  registerSource('O365', O365ItemSource)
}
