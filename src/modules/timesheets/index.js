import { DayTimeLoggerMItem } from './model'
import { TimesheetsItemSource } from './source'

export const register = (registerTypesLookup, registerSource) => {
  registerTypesLookup('day-time-logger', DayTimeLoggerMItem)
  registerSource('timesheets', TimesheetsItemSource)
}
