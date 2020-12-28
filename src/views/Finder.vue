<template>
  <div class="home">
    this is the finder
    <el-button @click="close()">X</el-button>
  </div>
</template>

<script>
// @ is an alias to /src

import { remote } from 'electron'

export default {
  name: "Home",
  components: {
  },
  methods: {
    close() {
      remote.getCurrentWindow().close()
    }
  }
};
</script>
