import { readFileSync } from 'fs'
import { SourcesManager } from './sources/sourcesManager'

const CONF_FILE = '/home/gabriele/work-agenda/configuration.json'

function loadConfiguration() {
  const content = readFileSync(CONF_FILE)
  const configuration = JSON.parse(content)
  return configuration
}

function initSources(configuration, store) {
  new SourcesManager(configuration.sources, store)
}

export { loadConfiguration, initSources }
