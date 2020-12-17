import * as Mutation from './mutation-types'
import { MItem } from '@/common/model/mitem'

export default {
  [Mutation.RESET_STATE](state) {
    state.items = []
  },
  [Mutation.LOAD_ITEMS](state, items) {
    console.log('arrived items', new Date(), items)
    const shallow_copy_array = Array.from(state.items)
    items.forEach(i => shallow_copy_array.push(MItem.deserialize(i)))
    state.items = shallow_copy_array
    console.log('state items', new Date(), state.items)
  },
  [Mutation.SAVE_ITEM](state, item) {
    console.log('Serialized item', item)
    let newItem = MItem.deserialize(item)
    console.log('Deserialized item', newItem)
    state.items.push(newItem)
  },
  [Mutation.UPDATE_ITEM](state, { itemId, updates }) {
    let existingItemIndex = state.items.findIndex(i => i.id == itemId)
    if (existingItemIndex >= 0) {
      let oldItem = state.items[existingItemIndex]
      Object.entries(updates).forEach(e => oldItem[e[0]] = e[1])
      console.log('Mutation update', oldItem)
      //state.items.splice(existingItemIndex, 1, WorkItem.build({...oldItem, ...updates}))
    }
  },
  [Mutation.DELETE_ITEM](state, itemId) {
    console.log('DELETE started', new Date())
    const shallow_copy_array = Array.from(state.items)
    let existingItemIndex = shallow_copy_array.findIndex(i => i.id === itemId)
    if (existingItemIndex >= 0) {
      shallow_copy_array.splice(existingItemIndex, 1)
    }
    state.items = shallow_copy_array
    console.log('DELETE ended', new Date())
  }
}
