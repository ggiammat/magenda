import { MItem } from './mitem.mjs'


const mi = MItem.buildFromDict({id: '9999', title: 'asd'})
const ser = mi.serialize()
console.log(mi)
console.log(ser)
console.log(MItem.deserialize(ser))
