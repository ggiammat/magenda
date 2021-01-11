<template>
  <DayTimeLoggerEditor :item="item" :key="item.id"></DayTimeLoggerEditor>
</template>
<script>
import { mapGetters } from 'vuex'
import { isSameDay } from 'date-fns'
import { DayTimeLoggerMItem } from '../model'
import DayTimeLoggerEditor from './editor'
//import { reactive } from "vue"
export default {
  components: {
    DayTimeLoggerEditor
  },
  props: {
    day: Date
  },
  computed: {
    ...mapGetters(['allItems']),
    item() {
      let item = this.allItems.filter(i => i instanceof DayTimeLoggerMItem).find(i => isSameDay(this.day, i.date))
      if (!item) {
        item = new DayTimeLoggerMItem({date: this.day})
      }
      return item
    }
  }
}
</script>
