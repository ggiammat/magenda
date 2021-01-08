<template>
  <markdown-editor
    v-model="item.body"
  ></markdown-editor>
</template>

<script>
import commonEditor from './common'
import MarkdownEditor from '../MarkdownEditor.vue'

export default {
  components: {
    MarkdownEditor
  },
  ...commonEditor
}
</script>
