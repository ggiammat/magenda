<template>
  <el-button @click="prevMonth()">&lt;</el-button>
  <el-button @click="nextMonth()">&gt;</el-button>
  <table>
  <tr>
    <th style="width: 130px">Day</th>
    <th style="width: 50px">Ferie</th>
    <th>PAR</th>
  </tr>
  <tr v-for="r in dayReports" :key="r.id">
    <td>{{ r.date }}</td>
    <td>{{ r.ferie }}</td>
    <td>{{ r.par }}</td>
  </tr>
  </table>
</template>
<script>
import { DayTimeLoggerMItem } from '../model'
import { mapGetters } from 'vuex'
import { addMonths, subMonths, format, eachDayOfInterval, isWithinInterval, endOfMonth, startOfMonth } from 'date-fns'
export default {
  data() {
    return {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date())
    }
  },
  computed: {
    ...mapGetters(['allItems']),
    dayReports() {
      const interval = {start: this.start, end: this.end}
      console.log(interval)
      let days = eachDayOfInterval(interval)
      let items = this.allItems.filter(i => i instanceof DayTimeLoggerMItem).filter(i => isWithinInterval(i.date, {start: this.start, end: this.end}))
      let itemsDict = {}
      items.forEach(i => itemsDict[i.date] = i)
      let reports = days.map(d => { return{date: format(d, 'EEE MMM dd'), ferie: itemsDict[d]?.ferie || undefined, par: itemsDict[d]?.par || undefined}})
      return reports
    }
  },
  methods: {
    prevMonth() {
      this.start = subMonths(this.start, 1)
      this.end = endOfMonth(this.start)
    },
    nextMonth() {
      this.start = addMonths(this.start, 1)
      this.end = endOfMonth(this.start)

    }
  }
}
</script>
