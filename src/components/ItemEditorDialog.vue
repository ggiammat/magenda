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
import { v4 as uuidv4 } from 'uuid'
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
    }
  },
  methods: {
    findItemById(itemId) {
      return this.items.find(i => i.id.toString() === itemId.toString())
    },
    show(itemId) {
      if(itemId){
        if(typeof itemId === 'string'){
          this.item = MItem.deserialize(this.findItemById(itemId).serialize())
        } else if(itemId instanceof MItem) {
          this.item = new MItem(itemId.getSerializedProps())
        } else {
          this.item = new MItem(itemId)
        }
      } else {
        this.item = new MItem({week: 51})
      }
      this.dialogVisible = true
      if(this.item.start){
        this.startDate = new Date(this.item.start)
      } else {
        this.startDate = undefined
      }

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
        // TODO: update only updated fields
        let updates = this.item.getSerializedProps()
        this.updateItem(this.item.id, updates)
      } else {
        this.item.id = uuidv4()
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
