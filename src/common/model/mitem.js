import { extractBodyProps } from './markdown'
//import { v4 as uuidv4 } from 'uuid'
var _ = require('lodash')

const MERGING_PROPS = ['subItems', 'tags']
const NOT_INHERITABLE_PROPS = ['type', 'id', 'hidden', '_extends', '_encapsulated', 'encapsuler']
const EXTENDS_NOT_INHERITABLE_PROPS = ['type', 'id', 'hidden', '_extends', '_encapsulated', 'childs', 'encapsuler']
//const NOT_INHERITABLE_RELS = ['extends', 'encapsulation','parent']
//const EXTENDS_NOT_INHERITABLE_RELS = ['extends', 'encapsulation', 'parent']
const mItemProxyGetter = function(obj, prop) {

  if (MERGING_PROPS.includes(prop)) {
    var bodyRes
    if (obj._props[`ignoredbody_${prop}`]) {
      bodyRes = obj._bodyprops[prop].filter(e => !obj._props[`ignoredbody_${prop}`].includes(e))
    } else {
      bodyRes = obj._bodyprops[prop]
    }
    let res = [...bodyRes || [], ...obj._props[prop] || [] ]
    return res
  }

  /*
  if (prop === 'rels') {
    let res = [...obj._props[prop] || []]
    if (obj._encapsulated) {
      let res2 = obj._encapsulated.rels.filter(r => !NOT_INHERITABLE_RELS.includes(r.name))
      console.log('encapsulated rels', res2)
      res = res.concat(res2)
    }
    if (obj._extends) {
      res = res.concat(obj._extends.rels.filter(r => !EXTENDS_NOT_INHERITABLE_RELS.includes(r.name)))
    }
    return res
  }
  */

  return (
    obj[prop] ||
    obj._props[prop] ||
    obj._bodyprops[prop] ||
    (obj._encapsulated && !NOT_INHERITABLE_PROPS.includes(prop)
      ? obj._encapsulated[prop]
      : undefined) ||
    (obj._extends && !EXTENDS_NOT_INHERITABLE_PROPS.includes(prop)
      ? obj._extends[prop]
      : undefined) ||
    undefined
  )
}

const mItemProxySetter = function(obj, prop, value) {
  if (prop === 'body'){
    obj._props[prop] = value
    //obj._bodyprops['subItems'] = getSubItems(value)
    obj._bodyprops = extractBodyProps(value)
    return true
  }

  //console.log('MItem Proxy Set', prop, value)
  if (MERGING_PROPS.includes(prop)) {
    if (obj._bodyprops[prop]) {
      if (prop === "subItems") {
        obj._props[prop] = value.filter(e => typeof e === 'string')
      } else {
        obj._props[prop] = value.filter(e => !obj._bodyprops[prop].includes(e))
        obj._props[`ignoredbody_{prop}`] = obj._bodyprops[prop].filter(e => !value.includes(e))
      }
      return true
    }
  }

  if (prop.startsWith("_")) {
    obj[prop] = value
  }

  obj._props[prop] = value
  return true
}

//const ITEM_PROPS = ['title', 'week', 'subItems', 'rels']

const proxyHandler = {
  get: mItemProxyGetter,
  set: mItemProxySetter,

  // REACTIVITY SEEMS TO WORK ALSO WITHOUT THESE TWO TRAPS
  has(obj, prop) {
    return this.ownKeys(obj).includes(prop)
  },
  ownKeys: function(obj) {
    return [... new Set([...Object.keys(obj), ...Object.keys(obj._props), ...Object.keys(obj._bodyprops)])]
  },

  getOwnPropertyDescriptor: function (obj, prop) {
    //console.log('PROXY PROPDESCR')
    const val = mItemProxyGetter(obj, prop)
    return val != undefined ? {
          value: val,
          writable: true,
          enumerable: true,
          configurable: true
        }
      : undefined
  }
}

export class MItem {
  _props = {}

  _bodyprops = {}

  constructor(props = {}) {
    this.version = 1
    this._props = {...this._props, ...props}
    const proxy = new Proxy(this, proxyHandler)
    if ('body' in props) {
      proxy.body = props.body
    }
    return proxy
  }
  static deserialize(item) {
    return new MItem(item._props)
  }

  getSerializedProps(){
    return this.serialize()._props
  }

  serialize() {
    return {
      _props: _.cloneDeep(this._props)
    }
  }
}
