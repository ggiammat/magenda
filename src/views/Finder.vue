<template>
  <div class="home">
    <el-input placeholder="Please input" v-model="input"></el-input>
    <el-button @click="add()">+</el-button>
    <el-button @click="close()">X</el-button>
  </div>
  <div v-for="i in matchingItems" :key="i.id">{{i.title}}</div>
</template>

<script>
// @ is an alias to /src

import { remote } from 'electron'
import { mapGetters } from 'vuex'
import storeMixin from '@/components/mixins/store'
import { MItem } from '@/common/model/mitem'

export default {
  mixins: [storeMixin],
  name: "Home",
  components: {
  },
  data() {
    return {
      input: ""
    }
  },
  computed: {
    ...mapGetters(['allItems']),

    matchingItems() {
      if (this.input) {
      return this.allItems.filter(i => {
        console.log(i.title)
        console.log(this.input)
        if (i.title){
          return i.title.toLowerCase().startsWith(this.input.toLowerCase())
        }
        return false
      })
    }
    return []
    },
  },
  methods: {
    close() {
      remote.getCurrentWindow().close()
    },
    add() {
      let item = new MItem()
      item.title = this.input
      this.saveItem(item)
    }
  }
};
</script>
