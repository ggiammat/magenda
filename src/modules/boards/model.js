import { BaseMItem } from '../../common/model/internal'

export class BoardMItem extends BaseMItem {
  _serializable = {
    ...super.alwaysSerialziable(),
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
