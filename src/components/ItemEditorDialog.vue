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
    <el-button @click="save()">Save</el-button>
    <el-button type="primary" @click="closeAndSave()">Save and Close</el-button>
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
      sharedUpdatedProps: {
        type: Object,
        default: () => { return {} }
      }
    }
  },
  computed: {
    ...mapGetters(['allItems'])
  },
  methods: {
    show(item) {

      if(item){
        if(typeof item === 'string'){
          let it = this.allItems.find(i => i.id === item)
          this.itemRef = it
        } else if(item instanceof MItem) {
          this.itemRef = item
        } else {
          this.itemRef = new MItem(item)
        }
      } else {
        this.itemRef = new MItem()
      }

      this.sharedUpdatedProps = {}
      this.dialogVisible = true

    },
    handleClose() {
      this.back()
    },
    save() {
      this.$refs.editor.save()
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
