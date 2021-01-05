import { BaseMItem } from './internal'

export class MItem extends BaseMItem {
  _serializable = {
    ...super.alwaysSerialziable(),
    title: undefined,
    done: undefined,
    start: undefined,
    sourceId: undefined,
    body: undefined,
    bodyRef: undefined,
    deadline: undefined
  }

  constructor(props = {}) {
    super()
    return this.init(props)
  }
}
