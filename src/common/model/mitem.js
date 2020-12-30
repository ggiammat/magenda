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
    if (obj._serializable[`ignoredbody_${prop}`]) {
      bodyRes = obj._serializable.bodyProps[prop].filter(e => !obj._serializable[`ignoredbody_${prop}`].includes(e))
    } else {
      bodyRes = obj._serializable.bodyProps[prop]
    }
    let res = [...bodyRes || [], ...obj._serializable[prop] || [] ]
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
  if (obj[prop] !== undefined) return obj[prop]
  if (obj._serializable[prop] !== undefined) return obj._serializable[prop]
  if (obj._serializable.bodyProps[prop] !== undefined) return obj._serializable.bodyProps[prop]
  if (obj._encapsulated && !NOT_INHERITABLE_PROPS.includes(prop) && obj._encapsulated[prop] !== undefined) return obj._encapsulated[prop]
  if (obj._extends && !EXTENDS_NOT_INHERITABLE_PROPS.includes(prop) && obj._extends[prop] !== undefined) return obj._extends[prop]
  return undefined
}

const mItemProxySetter = function(obj, prop, value) {
  if (prop === 'body'){
    obj._serializable.body = value
    obj._serializable.bodyProps = extractBodyProps(value)
    return true
  }

  //console.log('MItem Proxy Set', prop, value)
  if (MERGING_PROPS.includes(prop)) {
    if (obj._serializable.bodyProps[prop]) {
      if (prop === "subItems") {
        obj._serializable.bodyProps[prop] = value.filter(e => typeof e === 'string')
      } else {
        obj._serializable.bodyProps[prop] = value.filter(e => !obj._serializable.bodyProps[prop].includes(e))
        obj._props[`ignoredbody_{prop}`] = obj._serializable.bodyProps[prop].filter(e => !value.includes(e))
      }
      return true
    }
  }

  if (Object.prototype.hasOwnProperty.call(obj._serializable, prop)) {
    obj._serializable[prop] = value
    return true
  }


  obj[prop] = value

  return true
}

//const ITEM_PROPS = ['title', 'week', 'subItems', 'rels']

const proxyHandler = {
  get: mItemProxyGetter,
  set: mItemProxySetter,

  // REACTIVITY SEEMS TO WORK ALSO WITHOUT THESE TWO TRAPS
  /*
  has(obj, prop) {
    return this.ownKeys(obj).includes(prop)
  },
  ownKeys: function(obj) {
    return [... new Set([...Object.keys(obj), ...Object.keys(obj._props), ...Object.keys(obj._bodyprops)])]
  },
  */

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

  _serializable = {
    id: undefined,
    type: undefined,
    title: undefined,
    done: undefined,
    start: undefined,
    source: undefined,
    sourceId: undefined,
    rels: undefined,
    body: undefined,
    bodyRef: undefined,
    bodyProps: {},
    deadline: undefined
  }

  constructor(props = {}) {
    this._serializable = {...this._serializable, ...props}
    const proxy = new Proxy(this, proxyHandler)
    if(!this.bodyProps && props.body) {
        proxy.body = props.body
    }
    //Object.entries(props).filter(e => e[1]).forEach(e => proxy[e[0]] = e[1])
    return proxy
  }
  static deserialize(props) {
    return new MItem(props)
  }

  getSerializedProps(){
    console.warn('Using deprecated getSerializedProps()')
    return this.serialize()
  }

  serialize() {
    return _.cloneDeep(this._serializable)
  }
}
