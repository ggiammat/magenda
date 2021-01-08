<template>
  <el-button @click="save()">Save</el-button>
  <markdown-editor
    v-model="item.body"
  ></markdown-editor>
</template>

<script>
import commonEditor from '@/renderer/components/editors/common'
import MarkdownEditor from '@/renderer/components/MarkdownEditor.vue'

export default {
  components: {
    MarkdownEditor
  },
  ...commonEditor
}
</script>
