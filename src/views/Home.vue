<template>
  <el-row>
    <el-col :span="1">
      <el-button @click="currentPage = 'weekWorkspace'">Week</el-button>
      <el-button @click="currentPage = 'board'">Board</el-button>
      <el-button @click="currentPage = 'timesheetsMonthlyReport'">TR</el-button>
    </el-col>
    <el-col :span="23">
      <component :is="currentPage"></component>
    </el-col>
  </el-row>
</template>

<script>
// @ is an alias to /src

import WeekWorkspace from '@/components/WeekWorkspace.vue'
import Board from '@/renderer/components/Board.vue'
import TimesheetsMonthlyReport from '@/modules/timesheets/MonthlyReport'

export default {
  name: "Home",
  data() {
    return {
      currentPage: "weekWorkspace"
    }
  },
  components: {
    WeekWorkspace,
    Board,
    TimesheetsMonthlyReport
  }
};
</script>
