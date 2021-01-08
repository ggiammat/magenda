<template>
  <el-button @click="prevWeek()">&lt;</el-button>
  <el-button @click="nextWeek()">&gt;</el-button>
  <el-row :gutter="20">
  <el-col :span="6">
    <div class="grid-content bg-purple">{{formatDay(dates.mon)}}</div>
      <dayTimeLogger :day="dates.mon"></dayTimeLogger>
      <item-list :itemProps="{start: dates.mon}" :itemFilters="{start: val => new Date(val) >= dates.mon && new Date(val) < dates.tue}"/>
  </el-col>
  <el-col :span="4">
    <div class="grid-content bg-purple">{{formatDay(dates.tue)}}</div>
      <dayTimeLogger :day="dates.tue"></dayTimeLogger>
      <item-list :itemProps="{start: dates.tue}" :itemFilters="{start: val => new Date(val) >= dates.tue && new Date(val) < dates.wed}"/>
  </el-col>
  <el-col :span="4">
    <div class="grid-content bg-purple">{{formatDay(dates.wed)}}</div>
      <dayTimeLogger :day="dates.wed"></dayTimeLogger>
      <item-list :itemProps="{start: dates.wed}" :itemFilters="{start: val => new Date(val) >= dates.wed && new Date(val) < dates.thr}"/>
  </el-col>
  <el-col :span="4">
    <div class="grid-content bg-purple">{{formatDay(dates.thr)}}</div>
      <dayTimeLogger :day="dates.thr"></dayTimeLogger>
      <item-list :itemProps="{start: dates.thr}" :itemFilters="{start: val => new Date(val) >= dates.thr && new Date(val) < dates.fri}"/>
  </el-col>
  <el-col :span="4">
    <div class="grid-content bg-purple">{{formatDay(dates.fri)}}</div>
      <dayTimeLogger :day="dates.fri"></dayTimeLogger>
      <item-list :itemProps="{start: dates.fri}" :itemFilters="{start: val => new Date(val) >= dates.fri && new Date(val) < dates.sat}"/>
  </el-col>
</el-row>
</template>
<script>
//import draggable from 'vuedraggable'
import ItemList from './ItemList'
import DayTimeLogger from '@/modules/timesheets/CalendarWidget'
import { addWeeks, subWeeks, startOfWeek, addDays, format } from 'date-fns'

export default {
  components: {
    //draggable,
    ItemList,
    DayTimeLogger
    /*
    DayTimeLogger: defineAsyncComponent({
      loader: () => new Promise((res) => res(MAgenda.modules['timesheets'].CalendarWidget))
    })
    */
  },
  data(){
    return {
      startDate: startOfWeek(new Date(), {weekStartsOn: 1})
      //week: getWeek(new Date(), {weekStartsOn: 1}),
      //year: getYear(new Date())
    }
  },
  computed: {
    dates() {
      //const startOfWeek =  parse(this.week + " " + this.year, "I R", new Date(), {weekStartsOn: 1})
      console.log('week', this.startDate)
      return {
        mon: this.startDate,
        tue: addDays(this.startDate, 1),
        wed: addDays(this.startDate, 2),
        thr: addDays(this.startDate, 3),
        fri: addDays(this.startDate, 4),
        sat: addDays(this.startDate, 5),
        sun: addDays(this.startDate, 6),
      }
    }
 },
  methods: {
    prevWeek(){
      this.startDate = subWeeks(this.startDate, 1)
    },
    nextWeek(){
      this.startDate = addWeeks(this.startDate, 1)
    },
    formatDay(date){
      console.log('formatting', date)
      return format(date, 'EEEE do')
    },
    log(){
      console.log('Calendar Dropped', ...arguments)
    }
  }
}
</script>
