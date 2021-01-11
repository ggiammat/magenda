<template>
  <el-row>
    <el-col :span="1">
      <el-button @click="currentPage = 'weekWorkspace'">Week</el-button>
      <el-button @click="currentPage = 'board'">Board</el-button>
      <el-button v-if="timesheetsLoaded" @click="currentPage = 'timesheetsMonthlyReport'">TR</el-button>
    </el-col>
    <el-col :span="23">
      <component :is="currentPage"></component>
    </el-col>
  </el-row>
</template>

<script>
// @ is an alias to /src

//import WeekWorkspace from '@/magenda/mitems/vue'
//import Board from '@/modules/boards/Board.vue'
import MAgenda from '@/magenda'
//import { MonthlyReport as TimesheetsMonthlyReport} from '@/modules/timesheets/vue'

export default {
  name: "Home",
  data() {
    return {
      currentPage: "weekWorkspace"
    }
  },
  components: {
    WeekWorkspace: MAgenda.vueModules['WeekWorkspace']?.WeekWorkspace,
    Board: MAgenda.vueModules['boards']?.Board,
    //TimesheetsMonthlyReport
    TimesheetsMonthlyReport: MAgenda.vueModules['timesheets']?.MonthlyReport
  },
  computed: {
    timesheetsLoaded() {
      return MAgenda.vueModules['timesheets']
    }
  }
};
</script>
