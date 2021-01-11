<template>
  <el-button @click="save()">Save</el-button>
  <markdown-editor
    v-model="item.body"
  ></markdown-editor>
</template>

<script>
import { editorCommons, MarkdownEditor } from '@/magenda/mitems/vue'

export default {
  components: {
    MarkdownEditor
  },
  ...editorCommons
}
</script>
