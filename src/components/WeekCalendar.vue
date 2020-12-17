<template>
  <el-button @click="week--">&lt;</el-button>
  <el-button @click="week++">&gt;</el-button>
  <el-row :gutter="20">
  <el-col :span="6">
    <div class="grid-content bg-purple">{{formatDay(dates.mon)}}</div>
      <item-list :itemProps="{start: dates.mon.toISOString()}" :itemFilters="{start: val => new Date(val) >= dates.mon && new Date(val) < dates.tue}"/>
  </el-col>
  <el-col :span="4">
    <div class="grid-content bg-purple">{{formatDay(dates.tue)}}</div>
      <item-list :itemProps="{start: dates.tue.toISOString()}" :itemFilters="{start: val => new Date(val) >= dates.tue && new Date(val) < dates.wed}"/>
  </el-col>
  <el-col :span="4">
    <div class="grid-content bg-purple">{{formatDay(dates.wed)}}</div>
      <item-list :itemProps="{start: dates.wed.toISOString()}" :itemFilters="{start: val => new Date(val) >= dates.wed && new Date(val) < dates.thr}"/>
  </el-col>
  <el-col :span="4">
    <div class="grid-content bg-purple">{{formatDay(dates.thr)}}</div>
      <item-list :itemProps="{start: dates.thr.toISOString()}" :itemFilters="{start: val => new Date(val) >= dates.thr && new Date(val) < dates.fri}"/>
  </el-col>
  <el-col :span="4">
    <div class="grid-content bg-purple">{{formatDay(dates.fri)}}</div>
      <item-list :itemProps="{start: dates.fri.toISOString()}" :itemFilters="{start: val => new Date(val) >= dates.fri && new Date(val) < dates.sat}"/>
  </el-col>
</el-row>
</template>
<script>
//import draggable from 'vuedraggable'
import ItemList from '@/components/ItemList'
import { parse, getWeek, getYear, addDays, format } from 'date-fns'

export default {
  components: {
    //draggable,
    ItemList
  },
  data(){
    return {
      week: getWeek(new Date(), {weekStartsOn: 1}),
      year: getYear(new Date())
    }
  },
  computed: {
    dates() {
      const startOfWeek =  parse(this.week + " " + this.year, "I R", new Date(), {weekStartsOn: 1})
      console.log('week', startOfWeek)
      return {
        mon: startOfWeek,
        tue: addDays(startOfWeek, 1),
        wed: addDays(startOfWeek, 2),
        thr: addDays(startOfWeek, 3),
        fri: addDays(startOfWeek, 4),
        sat: addDays(startOfWeek, 5),
        sun: addDays(startOfWeek, 6),
      }
    }
 },
  methods: {
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
