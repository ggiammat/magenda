<template>
  <item-editor-dialog ref="dialog"></item-editor-dialog>
  <week-calendar></week-calendar>
  <el-button @click="this.$refs.dialog.show()">+</el-button>
    <el-row :gutter="20">
      <el-col :span="4"><item-list :itemProps="{week: currWeek-1, start: undefined}" :itemFilters="{week: val => val < currWeek, start: val => !val}"/></el-col>
      <el-col :span="4"><item-list :itemProps="{week: currWeek, start: undefined}" :itemFilters="{week: val => val == currWeek, start: val => !val}"/></el-col>
      <el-col :span="4"><item-list :itemProps="{week: currWeek+1, start: undefined}" :itemFilters="{week: val => val > currWeek, start: val => !val}"/></el-col>
      <el-col :span="4"><item-list :itemProps="{week: undefined, start: undefined}" :itemFilters="{week: val => !val, start: val => !val}"/></el-col>
    </el-row>
</template>
<script>
import ItemEditorDialog from '@/components/ItemEditorDialog'
import ItemList from "@/components/ItemList"
import WeekCalendar from "@/components/WeekCalendar"
import { getWeek } from 'date-fns'
export default {
  components: {
    ItemEditorDialog,
    ItemList,
    WeekCalendar
  },
  data(){
    return {
      currWeek: getWeek(new Date(), {weekStartsOn: 1}),
    }
  },
  mounted(){
    this.emitter.on('dialog-edit', (item) => {
      console.log('called dialog edit', item)
      let arg = item.id
      if(!arg) {
        arg = item
      }
      this.$refs.dialog.show(arg)
    })
  }
}
</script>
