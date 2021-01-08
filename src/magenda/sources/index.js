import log from 'electron-log'

export class ItemSource {
  sourceManager = null
  configuration = null
  name = null

  defaultConfiguration = {
    saveBodyProps: false
  }

  constructor(name, configuration, sourceManager) {
    this.name = name
    this.configuration = { ...this.defaultConfiguration, ...configuration }
    this.sourceManager = sourceManager
    log.info(`📁 Initialized ItemSource "${name}"`)
  }
}
