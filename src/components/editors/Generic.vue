<template>
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
    v-model="item.body"
  ></markdown-editor>

</template>

<script>
import commonEditor from './common'
import MarkdownEditor from '@/components/MarkdownEditor.vue'

export default {
  components: {
    MarkdownEditor
  },
  ...commonEditor
}
</script>
