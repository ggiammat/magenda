<template>
  <div class="item-div" :class="{ 'line-through': item.done }" @click="clicked()">
    <span v-if="item._encapsulated">(X) </span>
    <span v-if="hasEnca && !item._encapsulated">(X$$$) </span>
    <span v-if="item._extends">(E) </span>
    <span v-if="item.hasDuplicate">(D)</span>
    <span>{{time}} </span>
    <span v-if="item.project">[{{item.project}}] </span>
    <span>{{item.title}}</span>
    <span>{{bodyx}}</span>
  </div>
  <div style="padding-left:20px">
    <item v-for="si in subItems" :key="si.id || si.title" :item="si"></item>
  </div>
</template>
<script>
import { MItem } from '@/common/model/base'
import { format } from 'date-fns'
export default {
  name: 'Item',
  props: {
    item: {
      type: MItem
    }
  },
  methods: {
    clicked(){
      this.emitter.emit('dialog-edit', this.item)
    }
  },
  watch: {
  },
  computed: {
    bodyx() {
      this.item.body
      return ""
    },
    hasEnca() {
      if (this.item.rels) {
        return this.item.rels.find(r => r.name === 'encapsulation')
      }
      return false
    },
    time() {
      if (this.item.start) {
        console.log(this.item.id, this.item.start)
        return format(this.item.start, 'h:mm aaaa')
      } else {
        return undefined
      }
    },
    subItems() {
      return this.item.childs?.map(i => i.encapsuler || i)
    }
  }
}
</script>
<style scoped>
.item-div {
  background-color: gray;
  border: 1px solid black;
  color: white;
  border-radius: 5px;
  margin: 4px;
  padding: 2px 4px 2px 4px;
  font-size: smaller;
}
</style>
