<template>
  <el-input
    placeholder="Please input"
    v-model="item.title"
    clearable>
  </el-input>
  <el-checkbox v-model="item.done">Done</el-checkbox>
  <el-date-picker
    v-model="item.start"
    type="datetime"
    placeholder="Select date and time">
  </el-date-picker>
  <div><span style="padding:10px" v-for="si in item.subItems" :key="si">{{ si.title || si }}</span></div>
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
