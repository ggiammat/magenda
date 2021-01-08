import { BaseMItem, MItem } from "@/common/model/base"
import { useStore } from 'vuex'
import { ipcRenderer } from 'electron'
import { reactive } from "vue"
import { saveItem, updateItem, deleteItem } from '@/renderer/ipc'
const editorProps = {
  itemId: {
    type: String,
    default: undefined
  },
  item: {
    type: BaseMItem,
    default: undefined
  },
  updatedProps: {
    type: Object,
    default: () => {
      return {}
    }
  }
}


function setup(props) {
  const store = useStore()

  let item = new MItem()

  const allItems = store.getters.allItems

  if (props.item) {
    item = props.item
  } else if (props.itemId) {
    let it = allItems.find(i => i.id === props.itemId)
    if (it) {
      item = it
    } else {
      console.error(`Could not find item with id ${props.itemId}`)
    }
  }

  //console.log('raw is ', item.__v_raw)
  //if (item.__v_raw) {
  //  item = item.__v_raw
  //}

  item = item.getEditingTrackerMItem(props.updatedProps)

  if (item.bodyRef) {
    item.body = ipcRenderer.sendSync('load-body', item.bodyRef)
  }

  item = reactive(item)

  const save = () => {
    let updates = item.__updates
    if(updates.__v_isReactive){
      updates = {}
      Object.entries(item.__updates).forEach(e => updates[e[0]] = e[1])
    }
    if (item.id) {
      console.log('updated props', updates)
      updateItem(item.id, updates)
    } else {
      saveItem(item, updates)
    }
    // reset updates
    //Object.keys(item.__updates).forEach(k => delete item.__updates[k])
    item.resetUpdates()
    console.log('updates reset', item.__updates)
  }

  const remove = () => {
    deleteItem(item.id)
  }


  console.log('editor initialized with item', item.id)

  return {
    item,
    save,
    remove,
    startDate: new Date()
  }
}

export default {
  props: editorProps,
  setup
}
