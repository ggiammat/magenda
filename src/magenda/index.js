
const active_modules = [
  'core',
  'mitems',
  'textEditor',
  'o365',
  'boards',
  'timesheets',
  'WeekWorkspace'
]

// currently unused
const vueModules = {}

const types = {}

const sources = {}

const defaultSources = {}

function registerType(type, clazz) {
  types[type] = clazz
}

function registerSource(id, clazz) {
  console.log('registering source', id)
  sources[id] = clazz
}

function registerDefaultSource(type, sourceId) {
  defaultSources[type] = sourceId
}

async function initModules(loadVue = false) {
  console.log('importing modules', loadVue)
  var m
  for(m of active_modules) {
    let module = await import(`./${m}`)
    if (loadVue) {
      try {
        let vueName = m + '/vue'
        vueModules[m] = await import('./' + vueName)
      } catch {
        console.log('error loading module\'s vue components ', m)
      }
    }
    module.register(registerType, registerSource, registerDefaultSource)
  }
}

export default { initModules, vueModules, sources, types, defaultSources }
