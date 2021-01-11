
import { DefaultMItemSource } from './source'

export * from './model'

export const register = (registerTypesLookup, registerSource) => {
  //registerTypesLookup('day-time-logger', DayTimeLoggerMItem)
  registerSource('default', DefaultMItemSource)
  //registerDefaultSource('day-time-logger', 'timesheets')
}
