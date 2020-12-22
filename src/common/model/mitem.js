import { getSubItems, extractBodyProps } from './markdown'
var _ = require('lodash')

const MERGING_PROPS = ['subItems', 'tags']
const NOT_BASE_PROPS = ['type']
const mItemProxyGetter = function(obj, prop) {
  //console.log('MItem Proxy Get', prop)

  // needed to call instance methods (e.g. "serialize()") and
  // for getting raw _props and _bodyprops
  if (prop in obj) {
    return obj[prop]
  }

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

  if(prop in obj._props) {
    return obj._props[prop]
  }

  if (prop in obj._bodyprops) {
    return obj._bodyprops[prop]
  }

  if(obj._base){
    if(!NOT_BASE_PROPS.includes(prop) && prop in obj._base) {
      return obj._base[prop]
    }
  }

  return undefined
}

const mItemProxySetter = function(obj, prop, value) {
  if (prop === 'body'){
    obj._props[prop] = value
    obj._bodyprops['subItems'] = getSubItems(value)
    extractBodyProps(value)
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

  if (prop === '_base') {
    obj._base = value
    return true
  }

  obj._props[prop] = value
  return true
}


const proxyHandler = {
  get: mItemProxyGetter,
  set: mItemProxySetter,
  has(obj, prop) {
    return this.ownKeys(obj).includes(prop)
  },
  ownKeys: function(obj) {
    //console.log('Proxy OWN KEYS')
    return [... new Set(['_base', ...Object.keys(obj._props), ...Object.keys(obj._bodyprops), ...Object.keys(obj._base || {})])]
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

export function serializeObject(object) {
  const res = {}
  Object.keys(object).forEach(k => {
    let val = object[k]
    if (Array.isArray(val)) {
      val = val.map(i => i)
    }
    // TODO: if it is an object call this function
    res[k] = val
  })
  return res
}

export class MItem {
  _props = {}

  _bodyprops = {}

  _base = undefined

  constructor(props = {}, base = undefined) {
    this._props = props
    this._base = base
    const proxy = new Proxy(this, proxyHandler)
    if ('body' in props) {
      proxy.body = props.body
    }
    return proxy
  }
  static deserialize(item) {
    return new MItem(item._props, item._base ? MItem.deserialize(item._base) : undefined)
  }

  getSerializedProps(){
    return this.serialize()._props
  }

  serialize() {
    return {
      _props: _.cloneDeep(this._props),
      _bodyprops: _.cloneDeep(this._bodyprops),
      _base: this._base ? this._base.serialize() : undefined
    }
  }
}
