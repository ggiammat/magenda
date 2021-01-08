import { DayTimeLoggerMItem } from './model'
import { TimesheetsItemSource } from './source'

export const register = (registerTypesLookup, registerSource, registerDefaultSource) => {
  registerTypesLookup('day-time-logger', DayTimeLoggerMItem)
  registerSource('timesheets', TimesheetsItemSource)
  registerDefaultSource('day-time-logger', 'timesheets')
}
