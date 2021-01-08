import { registerMObjectType } from '../common/model/base'

const modules = [
  'boards',
  'timesheets'
]


async function initModules() {
  var m
  for(m of modules) {
    let module = await import(`../modules/${m}`)
    module.register(registerMObjectType)
  }
}

export default { initModules }
