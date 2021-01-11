import { readFileSync } from 'fs'
import { SourcesManager } from '@/magenda/core'
//const CONF_FILE = '/home/gabriele/work-agenda/configuration-test.json'
const CONF_FILE = '/home/gabriele/work-agenda/configuration.json'

function loadConfiguration() {
  const content = readFileSync(CONF_FILE)
  const configuration = JSON.parse(content)
  return configuration
}

function initSources(configuration, store) {
  return new SourcesManager(configuration.sources, store)
}


export { loadConfiguration, initSources }
