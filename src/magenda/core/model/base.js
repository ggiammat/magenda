import { extractBodyProps } from './markdown'
var _ = require('lodash')
import MAgenda from '../..'

const MERGING_PROPS = ['subItems', 'tags']
const NOT_INHERITABLE_PROPS = ['type', 'id', 'hidden', '_extends', '_encapsulated', 'encapsuler']
const EXTENDS_NOT_INHERITABLE_PROPS = ['type', 'id', 'hidden', '_extends', '_encapsulated', 'childs', 'encapsuler', 'body', 'bodyProps', 'bodyRef']
//const NOT_INHERITABLE_RELS = ['extends', 'encapsulation','parent']
//const EXTENDS_NOT_INHERITABLE_RELS = ['extends', 'encapsulation', 'parent']
const mItemProxyGetter = function(obj, prop) {

  if (MERGING_PROPS.includes(prop)) {
    var bodyRes
    if (obj instanceof BodyfulMObject) {
      if (obj._serializable[`ignoredbody_${prop}`]) {
        bodyRes = obj._serializable.bodyProps[prop].filter(e => !obj._serializable[`ignoredbody_${prop}`].includes(e))
      } else {
        bodyRes = obj._serializable.bodyProps[prop]
      }
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
  if (obj._serializable.bodyProps && obj._serializable.bodyProps[prop] !== undefined) return obj._serializable.bodyProps[prop]
  if (obj._encapsulated && !NOT_INHERITABLE_PROPS.includes(prop) && obj._encapsulated[prop] !== undefined) return obj._encapsulated[prop]
  if (obj._extends && !EXTENDS_NOT_INHERITABLE_PROPS.includes(prop) && obj._extends[prop] !== undefined) return obj._extends[prop]
  return undefined
}

const mItemProxySetter = function(obj, prop, value) {

  //console.log('MItem Proxy Set', prop, value)
  if (MERGING_PROPS.includes(prop)) {
    if (obj._serializable.bodyProps && obj._serializable.bodyProps[prop]) {
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
    if (prop === 'body') {
      obj._serializable.bodyProps = extractBodyProps(value)
    }
    return true
  }


  obj[prop] = value
  if (prop === 'body') {
    obj._serializable.bodyProps = extractBodyProps(value)
  }

  return true
}

//const ITEM_PROPS = ['title', 'week', 'subItems', 'rels']

const proxyHandler = {
  get: mItemProxyGetter,
  set: mItemProxySetter,
  has(obj, prop) {
    return this.ownKeys(obj).includes(prop)
  },
  ownKeys: function(obj) {
    return [
      ...new Set([
        ...Object.keys(obj),
        ...Object.keys(obj._serializable),
        ...(obj instanceof BodyfulMObject ? Object.keys(obj._serializable.bodyProps) : [])
      ])
    ]
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



function createEditingProxy(target, externalUpdatesTrackerDict) {
  let updatesTrackerDict = externalUpdatesTrackerDict || {}
  return new Proxy(target, {
    __updates: updatesTrackerDict,
    __saved: {},
    get(obj, prop) {
      if (prop === "__updates") {
        return this.__updates
      }
      if(Object.prototype.hasOwnProperty.call(this.__updates, prop)) {
        return this.__updates[prop]
      }
      if(Object.prototype.hasOwnProperty.call(this.__saved, prop)) {
        return this.__saved[prop]
      }
      if(prop === 'resetUpdates') {
        return () => {
          console.log('resetUpdaets executed', this.__updates)
          Object.keys(this.__updates).forEach(k => {
            this.__saved[k] = this.__updates[k]
            delete this.__updates[k]
          })
        }
      }
      return Reflect.get(...arguments)
    },
    set(obj, prop, value) {
      this.__updates[prop] = value
      return true
    }
  })
}

function deserialize(raw) {
  if (raw.serializable.type){
    if(Object.prototype.hasOwnProperty.call(MAgenda.types, raw.serializable.type)) {
      let x = new MAgenda.types[raw.serializable.type](raw.serializable)
      return x
    } else {
      return new MItem(raw.serializable)
    }
  } else {
    return new MItem(raw.serializable)
  }
}


export class BaseMObject {

  _serializable = {
    id: undefined,
    type: undefined,
    source: undefined,
    rels: undefined
  }

  _getSerializable() {
    return this._serializable
  }

  init(props) {
    const proxy = new Proxy(this, proxyHandler)
    Object.entries(props).filter(e => e[1]).forEach(e => proxy[e[0]] = e[1])
    return proxy
  }

  static deserialize(props) {
    return deserialize(props)
  }

  getSerializedProps(){
    return this.serialize().serializable
  }

  getEditingTrackerMItem(externalUpdatesTrackerDict){
    return createEditingProxy(this, externalUpdatesTrackerDict)
  }

  serialize() {
    return {
      serializable: _.cloneDeep(this._serializable)
    }
  }
}


export class BodyLessMObject extends BaseMObject {
  _serializable = {
    ...super._getSerializable()
  }
}

export class BodyfulMObject extends BaseMObject {
  _serializable = {
    ...super._getSerializable(),
    body: undefined,
    bodyProps: {},
    bodyRef: undefined
  }
}

export class MItem extends BodyfulMObject {
  _serializable = {
    ...super._getSerializable(),
    title: undefined,
    done: undefined,
    start: undefined,
    sourceId: undefined,
    deadline: undefined
  }

  constructor(props = {}) {
    super()
    return this.init(props)
  }
}
