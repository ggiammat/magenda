<template>
  <markdown-editor
    v-model="item.body"
  ></markdown-editor>
</template>

<script>
import MarkdownEditor from './MarkdownEditor'
import editorCommons from './common'

export default {
  components: {
    MarkdownEditor
  },
  ...editorCommons
}
</script>
