<template>
  <item-editor-dialog ref="dialog"></item-editor-dialog>
  <week-calendar></week-calendar>
  <el-button @click="createNew()">+</el-button>
    <el-row :gutter="20">
      <el-col :span="4"><div>Past Weeks</div><item-list :groupByProject="true" :canDrop="false" :itemFilters="{deadline: val => val < thisWeekStart}"/></el-col>
      <el-col :span="4"><div>This Week</div><item-list :groupByProject="true" :itemProps="{deadline: newTaskThisWeek, start: undefined}" :itemFilters="{deadline: val => val >= thisWeekStart && val <= thisWeekEnd}"/></el-col>
      <el-col :span="4"><div>Next Week</div><item-list :groupByProject="true" :itemProps="{deadline: newTaskNextWeek, start: undefined}" :itemFilters="{deadline: val => val >= nextWeekStart && val <= nextWeekEnd}"/></el-col>
      <el-col :span="4"><div>Upcoming Weeks</div><item-list :groupByProject="true" :itemProps="{deadline: newTaskUpcoming, start: undefined}" :itemFilters="{deadline: val => val > nextWeekEnd}"/></el-col>
      <el-col :span="4"><div>No Deadline</div><item-list :groupByProject="true" :itemProps="{deadline: undefined, start: undefined}" :itemFilters="{deadline: val => !val, source: val => val != 'O365'}"/></el-col>
    </el-row>
</template>
<script>
import { ItemEditorDialog } from '@/magenda/mitems/vue'
import ItemList from "./ItemList"
import WeekCalendar from "./WeekCalendar"
import { endOfWeek, startOfWeek, addWeeks, addDays } from 'date-fns'
import { MItem } from '@/magenda/core'
export default {
  components: {
    ItemEditorDialog,
    ItemList,
    WeekCalendar
  },
  data(){
    return {
      thisWeekStart: startOfWeek(new Date(), {weekStartsOn: 1}),
      thisWeekEnd: endOfWeek(new Date(), {weekStartsOn: 1}),
      nextWeekStart: addWeeks(startOfWeek(new Date(), {weekStartsOn: 1}), 1),
      nextWeekEnd: addWeeks(endOfWeek(new Date(), {weekStartsOn: 1}), 1),
      newTaskThisWeek: addDays(new Date(), 1),
      newTaskNextWeek: addDays(new Date(), 7),
      newTaskUpcoming: addDays(new Date(), 14)
    }
  },
  methods: {
    createNew(){
      console.log('CreateNew called')
      this.emitter.emit('dialog-edit', new MItem({deadline: this.thisWeekEnd}))
    },
    registerDialog(item) {
      console.log('called dialog edit', item)
      let arg = item.id
      if(!arg) {
        arg = item
      }
      this.$refs.dialog.show(arg)
    }
  },
  unmounted(){
    console.log('WORKSPACE UNMOUNTED')
    this.emitter.off('dialog-edit', this.registerDialog)
  },
  mounted(){
    console.log('WORKSPACE MOUNTED')
    this.emitter.on('dialog-edit', this.registerDialog)
  }
}
</script>
