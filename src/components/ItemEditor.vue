<template>
  <div>{{ item.title }}</div>
  <markdown-editor
    :shown="bodyEditorVisible"
    v-model="item.body"
  ></markdown-editor>
  <el-button type="primary" @click="save()">Save</el-button>
  <el-button type="primary" @click="saveAndClose()">Save and Close</el-button>
</template>

<script>
import { MItem } from '@/common/model/mitem'
import { ipcRenderer, remote } from 'electron'
import storeMixin from '@/components/mixins/store'
import MarkdownEditor from '@/components/MarkdownEditor.vue'

export default {
  mixins: [storeMixin],
  components: {
    MarkdownEditor
  },
  props: {
    itemId: undefined
  },
  data(){
    return {
      item: MItem,
      bodyEditorVisible: false
    }
  },
  mounted(){
    let itemId = this.itemId
    if(itemId){
      if(typeof itemId === 'string'){
        let it = this.findItemById(itemId).serialize()
        this.item = MItem.deserialize(it)
      } else if(itemId instanceof MItem) {
        this.item = new MItem(itemId.getSerializedProps())
      } else {
        this.item = new MItem(itemId)
      }
    } else {
      this.item = new MItem({week: 53})
    }
    this.dialogVisible = true
    if(this.item.start){
      this.startDate = new Date(this.item.start)
    } else {
      this.startDate = undefined
    }


    if (this.item.bodyRef) {
      this.item.body = ipcRenderer.sendSync('load-body', this.item.bodyRef)
    }

    // FIXME: body appear to be alwasy modified even if it is not (it probably depends on muya that sets the body when it is initialized)
    this.updatedProps = new Set()
    this.item = new Proxy(this.item, {
        set: (obj, prop, value) => {
          this.updatedProps.add(prop.toString())
          obj[prop] = value
          return true
        }
    })

    this.bodyEditorVisible = true
    console.log('show dialog', this.item)
    //return new Promise(resolve => {
    //  this.resolve = resolve
    //})

  },
  methods: {
    saveAndClose() {
      this.save()
      remote.getCurrentWindow().close()
    },
    save() {
      this.dialogVisible = false
      console.log('serial', this.item.serialize())
      console.log('parent', this.item.parent)

      if(this.item.id){
        let updates = {}
        this.updatedProps.forEach(p => updates[p] = this.item[p])
        console.log('updated props', updates)
        this.updateItem(this.item.id, updates)
      } else {
        //this.item.id = uuidv4()
        this.saveItem(this.item)
      }
      //this.resolve({ action: 'save', item: this.item })
    }
  }
}
</script>
