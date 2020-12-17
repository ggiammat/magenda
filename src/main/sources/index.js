import log from 'electron-log'

export class ItemSource {
  sourceManager = null
  configuration = null
  name = null

  constructor(name, configuration, sourceManager) {
    this.name = name
    this.configuration = configuration
    this.sourceManager = sourceManager
    log.info(`📁 Initialized ItemSource "${name}"`)
  }

  load(query) {
    this.sourceManager.notifyUpdatedItems(this, this._innerLoad(query))
  }
}
