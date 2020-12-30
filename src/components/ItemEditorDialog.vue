<template>
  <el-dialog
    title="Tips"
    v-model="dialogVisible"
    width="80%"
    :before-close="handleClose">
    <el-button @click="currentEditor = 'genericEditor'">ED1</el-button>
    <el-button @click="currentEditor = 'textFileEditor'">ED2</el-button>
    <component :is="currentEditor" ref="editor" v-if="dialogVisible" :item="itemRef" :updatedProps="sharedUpdatedProps"></component>
    <el-button @click="back()">Cancel</el-button>
    <el-popconfirm title="Are you sure to delete this?"
    @confirm="closeAndRemove()">
      <template #reference>
        <el-button>Delete</el-button>
      </template>
    </el-popconfirm>
    <el-button type="primary" @click="closeAndSave()">Save</el-button>
  </el-dialog>
</template>
<script>

import TextFileEditor from './editors/TextFile'
import GenericEditor from './editors/Generic'
import { mapGetters } from 'vuex'
import { MItem } from "@/common/model/mitem"

// var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/

export default {
  components: {
    TextFileEditor,
    GenericEditor
  },
  data() {
    return {
      itemRef: undefined,
      dialogVisible: false,
      currentEditor: "genericEditor",
      sharedUpdatedProps: new Set()
    }
  },
  computed: {
    ...mapGetters(['allItems'])
  },
  methods: {
    show(itemId) {

      this.dialogVisible = true

      if(itemId){
        if(typeof itemId === 'string'){
          let it = this.allItems.find(i => i.id === itemId)
          this.itemRef = MItem.deserialize(it.serialize())
        } else if(itemId instanceof MItem) {
          this.itemRef = new MItem(itemId.getSerializedProps())
        } else {
          this.itemRef = new MItem(itemId)
        }
      } else {
        this.itemRef = new MItem({week: 53})
      }
    },
    handleClose() {
      this.back()
    },
    closeAndSave() {
      this.dialogVisible = false
      this.$refs.editor.save()
    },
    closeAndRemove() {
      this.dialogVisible = false
      this.$refs.editor.remove()
    },
    back() {
      this.dialogVisible = false
      //this.resolve({ action: 'back' })
    }
  }
}
</script>
