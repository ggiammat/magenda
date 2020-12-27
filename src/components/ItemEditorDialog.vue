<template>
  <el-dialog
    title="Tips"
    v-model="dialogVisible"
    width="80%"
    :before-close="handleClose">
    <el-input
      placeholder="Please input"
      v-model="item.title"
      clearable>
    </el-input>
    <el-checkbox v-model="item.done">Done</el-checkbox>
    <el-date-picker
      v-model="startDate"
      type="datetime"
      placeholder="Select date and time">
    </el-date-picker>
    <div><span style="padding:10px" v-for="si in item.subItems" :key="si">{{ si.title || si }}</span></div>
    <markdown-editor
      :shown="dialogVisible"
      v-model="item.body"
    ></markdown-editor>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="back()">Cancel</el-button>
        <el-popconfirm title="Are you sure to delete this?"
        @confirm="remove()">
          <template #reference>
            <el-button>Delete</el-button>
          </template>
        </el-popconfirm>
        <el-button type="primary" @click="save()">Save</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>

import { MItem } from '@/common/model/mitem'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import storeMixin from '@/components/mixins/store'

// var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/

export default {
  mixins: [storeMixin],
  components: {
    MarkdownEditor
  },
  data: () => ({
    item: new MItem(),
    updatedProps: null,
    dialogVisible: false,
    resolve: null,
    projects: ['PLG', 'CYB', 'EYC'],
    startDate: undefined,
    dateShortcuts: [{
          text: 'Today',
          value: new Date(),
        }]
  }),
  watch: {
    'startDate'() {
      console.log('start changed', this.startDate)
      //const bodySubItems = getSubItems(this.item.body)
      //this.item._bodyprops.subItems = bodySubItems
      this.item.start = this.startDate?.toISOString() || undefined
    },
    'item.done'() {
      console.log('ITEM DONE', this.item.done)
    }
  },
  methods: {
    findItemById(itemId) {
      return this.allItems.find(i => i.id.toString() === itemId.toString())
    },
    show(itemId) {
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

      // FIXME: body appear to be alwasy modified even if it is not (it probably depends on muya that sets the body when it is initialized)
      this.updatedProps = new Set()
      this.item = new Proxy(this.item, {
          set: (obj, prop, value) => {
            this.updatedProps.add(prop.toString())
            obj[prop] = value
            return true
          }
      })

      console.log('show dialog', this.item)
      //return new Promise(resolve => {
      //  this.resolve = resolve
      //})
    },
    handleClose() {
      this.back()
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
    },
    remove() {
      this.dialogVisible = false
      this.deleteItem(this.item.id)
      //this.resolve({ action: 'remove', item: this.item })
    },
    back() {
      this.dialogVisible = false
      //this.resolve({ action: 'back' })
    }
  }
}
</script>
