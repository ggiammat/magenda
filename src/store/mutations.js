import * as Mutation from './mutation-types'
import { MItem } from '@/common/model/mitem'



function deleteRels(itemOrId, allItems, relsCache) {
  const deletedId = typeof itemOrId === 'object' ? itemOrId.id : itemOrId
  const deletedItem = typeof itemOrId === 'object' ? itemOrId : undefined

  const currBase = relsCache.base[deletedId]
  if (currBase) {
    currBase._base = undefined
    console.log('DELETE BASE', currBase.id)
  }

  if (deletedItem) {
    // surface the base
    if (deletedItem._base) {
      allItems.push(deletedItem._base)
      console.log('DEBASE', deletedItem._base.id)
    }
    delete relsCache.base[deletedItem.baseId]
  }
  console.log('BASE RELS', relsCache.base)
}

function updateRels(newItems, allItems, relsCache) {
  newItems.forEach(i => {
    // relsCache.base is {'baseId': 'whoHasThatBaseId'}
    const currBase = relsCache.base[i.id]

    // I'm the base of somebody
    if (currBase) {
      // set me as base
      currBase._base = i
      // remove me from the state
      let iIndex = allItems.findIndex(ii => ii.id === i.id)
      allItems.splice(iIndex, 1)
      console.log('HIDE ITEM', iIndex)
    }

    // I have somebody as base
    if (i.baseId) {
      // find the other element
      let bIndex = allItems.findIndex(ii => ii.id === i.baseId)

      if (bIndex >= 0) {
        // set the other as my base
        i._base = allItems[bIndex]
        //remove the other from the state
        allItems.splice(bIndex, 1)
        console.log('HIDE 2 ITEM', bIndex)
      }
      // update rels cache
      relsCache.base[i.baseId] = i
    }
  })
}

export default {
  [Mutation.RESET_STATE](state) {
    state.items = []
    state._itemRelsCache = { base: {}}
  },
  [Mutation.LOAD_ITEMS](state, items) {
    console.log('ADDING ITEMS', items.map(i => i._props.id))
    const des = items.map(i => MItem.deserialize(i))
    const newState = state.items.concat(des)
    updateRels(des, newState, state._itemRelsCache)
    state.items = newState
  },
  /*
  [Mutation.SAVE_ITEM](state, item) {
    let newItem = MItem.deserialize(item)
    state.items.push(newItem)
  },
  */
  [Mutation.UPDATE_ITEM](state, { itemId, updates }) {
    console.log('updating item mutation')
    let existingItemIndex = state.items.findIndex(i => i.id == itemId)
    if (existingItemIndex >= 0) {
      let oldItem = state.items[existingItemIndex]
      if(updates._base){
        updates._base = MItem.deserialize(updates._base)
        console.log('deserializing base', updates._base)
      }
      Object.entries(updates).forEach(e => oldItem[e[0]] = e[1])
      //state.items.splice(existingItemIndex, 1, WorkItem.build({...oldItem, ...updates}))
    }
  },
  [Mutation.DELETE_ITEM](state, itemId) {
    console.log('DELETING ITEM', itemId)
    const shallow_copy_array = Array.from(state.items)
    let existingItemIndex = shallow_copy_array.findIndex(i => i.id === itemId)
    var deletedItem = itemId
    if (existingItemIndex >= 0) {
      deletedItem = shallow_copy_array.splice(existingItemIndex, 1)[0]
    } else {
      console.warn(`Trying to delete an item not in the state (id: ${itemId})`)
    }
    deleteRels(deletedItem, shallow_copy_array, state._itemRelsCache)
    state.items = shallow_copy_array
  }
}
