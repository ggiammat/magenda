
const active_modules = [
  'core',
  'o365',
  'boards',
  'timesheets'
]

// currently unused
//const modules = {}

const types = {}

const sources = {}

function registerType(type, clazz) {
  types[type] = clazz
}

function registerSource(id, clazz) {
  console.log('registering source', id)
  sources[id] = clazz
}

async function initModules() {
  var m
  for(m of active_modules) {
    let module = await import(`../modules/${m}`)
    //modules[m] = module
    module.register(registerType, registerSource)
  }
}

export default { initModules, /* modules,*/ sources, types }
