import * as Mutation from './mutation-types'

export default {
  /*
  loadItems({ commit }, items) {
    return commit(Mutation.LOAD_ITEMS, items)
  },
  saveItem({ commit }, item) {
    return commit(Mutation.SAVE_ITEM, item)
  },
  updateItem({ commit }, { itemId, updates }) {
    console.log('this update', this)
    return commit(Mutation.UPDATE_ITEM, { itemId, updates })
  },
  deleteItem({ commit }, itemId) {
    return commit(Mutation.DELETE_ITEM, itemId)
  },
  */
  resetState({ commit }) {
    return commit(Mutation.RESET_STATE)
  }
}
