import { BodyLessMObject } from '@/magenda/core'



export class BoardMItem extends BodyLessMObject {
  _serializable = {
    ...super._getSerializable(),
    type: 'board-item',
    x: undefined,
    y: undefined,
    w: undefined,
    h: undefined
  }

  constructor(props = {}) {
    super()
    return this.init(props)
  }

}
