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
    type: Set,
    default: new Set()
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
      item = new MItem(it.serialize())
    } else {
      console.error(`Could not find item with id ${props.itemId}`)
    }
  }

  if (item.bodyRef) {
    item.body = ipcRenderer.sendSync('load-body', item.bodyRef)
  }

  let updatedProps = props.updatedProps || {}
  item = new Proxy(item, {
    set: (obj, prop, value) => {
      updatedProps.add(prop)
      obj[prop] = value;
      return true
    }
  })

  const save = () => {
    if (item.id) {
      let updates = {}
      updatedProps.forEach(p => updates[p] = item[p])
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
