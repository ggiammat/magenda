import { O365ItemSource } from './source'
import { O365EmailItemSource } from './emailSource'

export const register = (registerTypesLookup, registerSource) => {
  registerSource('O365', O365ItemSource)
  registerSource('O365Emails', O365EmailItemSource)
}
