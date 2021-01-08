import { MarkdownItemSource } from '../../main/sources/markdown'
//import { DayTimeLoggerMItem } from './model'


export class TimesheetsItemSource extends MarkdownItemSource {

  source = 'timesheets'

  constructor(name, configuration, sourceManager) {
    super(name, configuration, sourceManager)
  }

/*

  _loadItemFromFile(file) {
    let raw = this._loadRawItemFromFile(file)
    if (raw.type === 'day-time-logger') {
      return new DayTimeLoggerMItem(raw)
    }
    console.error('Unknown type', raw)
  }

*/
}
