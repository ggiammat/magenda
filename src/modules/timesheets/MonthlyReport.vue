<template>
  <div v-for="r in dayReports" :key="r.id">{{ r.date }} {{ r.ferie }} | {{ r.par }}</div>
</template>
<script>
import { DayTimeLoggerMItem } from './model'
import { mapGetters } from 'vuex'
import { format, eachDayOfInterval, isWithinInterval, endOfMonth, startOfMonth } from 'date-fns'
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
      let reports = days.map(d => { return{date: format(d, 'MMMM dd'), ferie: itemsDict[d]?.ferie || undefined, par: itemsDict[d]?.par || undefined}})
      return reports
    }
  }
}
</script>
