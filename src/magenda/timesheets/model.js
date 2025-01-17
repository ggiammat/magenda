import { BodyLessMObject } from '@/magenda/core'

export class DayTimeLoggerMItem extends BodyLessMObject {
  _serializable = {
    ...super._getSerializable(),
    type: 'day-time-logger',
    ferie: undefined,
    par: undefined,
    date: undefined
  }

  constructor(props = {}) {
    super()
    return this.init(props)
  }

}
