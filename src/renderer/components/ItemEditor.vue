<template>
  <el-button type="primary" @click="save()">Save</el-button>
  <el-button type="primary" @click="saveAndClose()">Save and Close</el-button>
  <TextFileEditor ref="editor" :itemId="itemId"></TextFileEditor>
</template>

<script>
import { remote } from 'electron'
import TextFileEditor from './editors/TextFile'
export default {
  components: {
    TextFileEditor
  },
  props: {
    itemId: undefined
  },
  methods: {
    saveAndClose() {
      this.save()
      remote.getCurrentWindow().close()
    },
    save() {
        this.$refs.editor.save()
    }
  }
}
</script>
