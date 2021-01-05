import { BaseMItem } from '../common/model/internal'

export class DayTimeLoggerMItem extends BaseMItem {
  _serializable = {
    ...super.alwaysSerialziable(),
    ferie: undefined,
    par: undefined,
    date: undefined
  }

  constructor(props = {}) {
    super()
    return this.init(props)
  }

}
