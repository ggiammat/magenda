<template>
  <div class="home">
    <week-workspace/>
  </div>
</template>

<script>
// @ is an alias to /src

import WeekWorkspace from '@/components/WeekWorkspace.vue'

export default {
  name: "Home",
  components: {
    WeekWorkspace
  }
};
</script>
