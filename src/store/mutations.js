import * as Mutation from './mutation-types'
import { MItem } from '@/magenda/core'
import relTracker from '@/magenda/core/relationships'
import { reactive } from 'vue'


export default {
  [Mutation.INIT_STORE](state, items) {
    const newItems = items.map(i => reactive(MItem.deserialize(i)))
    const newAllItems = state.items.concat(newItems)
    relTracker.updateRelations(newItems, 'add', newAllItems)
    state.items = newAllItems
  },
  [Mutation.RESET_STATE](state) {
    state.items = []
    relTracker.reset()
  },
  [Mutation.LOAD_ITEMS](state, items) {
    const newItems = items.map(i => reactive(MItem.deserialize(i)))
    const newAllItems = state.items.concat(newItems)
    relTracker.updateRelations(newItems, 'add', newAllItems)
    state.items = newAllItems
    console.log('LOAD FINISHED')
  },
  [Mutation.UPDATE_ITEM](state, { itemId, updates }) {
    console.log('updating item mutation')
    let existingItemIndex = state.items.findIndex(i => i.id == itemId)
    if (existingItemIndex >= 0) {
      let oldItem = state.items[existingItemIndex]
      Object.entries(updates).forEach(e => oldItem[e[0]] = e[1])
    }
  },
  [Mutation.DELETE_ITEM](state, itemsId) {
    console.log('DELETING ITEM', itemsId)
    const shallow_copy_array = Array.from(state.items)
    const deletedItems = []
    itemsId.forEach(itemId => {
      let existingItemIndex = shallow_copy_array.findIndex(i => i.id === itemId)
      let deletedItem = itemId
      if (existingItemIndex >= 0) {
        deletedItem = shallow_copy_array.splice(existingItemIndex, 1)[0]
      } else {
        console.warn(`Trying to delete an item not in the state (id: ${itemId})`)
      }
      deletedItems.push(deletedItem)
    })
    relTracker.updateRelations(deletedItems, "delete", shallow_copy_array)
    state.items = shallow_copy_array
  }
}
