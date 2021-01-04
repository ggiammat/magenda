import { MItem } from "@/common/model/mitem"
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
    type: MItem,
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

  item = item.getEditingTrackerMItem(props.updatedProps)

  if (item.bodyRef) {
    item.body = ipcRenderer.sendSync('load-body', item.bodyRef)
  }

  const save = () => {
    if (item.id) {
      let updates = item.__updates
      if(updates.__v_isReactive){
        updates = {}
        Object.entries(item.__updates).forEach(e => updates[e[0]] = e[1])
      }
      console.log('updated props', updates)
      updateItem(item.id, updates)
    } else {
      saveItem(item)
    }
  }

  const remove = () => {
    deleteItem(item.id)
  }

  return {
    item: reactive(item),
    save,
    remove,
    startDate: new Date()
  }
}

export default {
  props: editorProps,
  setup
}
