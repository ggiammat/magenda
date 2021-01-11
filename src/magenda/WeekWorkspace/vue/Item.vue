<template>
  <div
    class="item-div drag-el" :class="{ 'line-through': item.done, over: over }"
    @click="clicked()"
    draggable="true"
    @dragstart='startDrag($event, item)'
    @drop='onDrop($event, 1)'
    @dragover.prevent
    @dragenter.prevent
    @dragenter="over = true"
    @dragleave="over = false"
    @drop.stop
  >
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
    <item v-for="si in subItems" :key="si.id || si.title" :item="si" :listId="listId"></item>
  </div>
</template>
<script>
import { MItem } from '@/magenda/core'
import { format } from 'date-fns'
export default {
  name: 'Item',
  props: {
    item: {
      type: MItem,
    },
    listId: String
  },
  data(){
    return {
      over: false
    }
  },
  methods: {
    clicked(){
      this.emitter.emit('dialog-edit', this.item)
    },
    startDrag(evt, item) {
      console.log('drag started', evt, item)
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('itemID', item.id)
      evt.dataTransfer.setData(`listId:${this.listId}`, 1)
      console.log('listid', this.listId)
      if (evt.shiftKey) {
        console.log('Shift is pressed!')
      }
    },
    onDrop(event, arg) {
      this.over = false
      const data = event.dataTransfer.getData('itemID')
      console.log('item drop', data, event, arg)
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
.over {
  border: 5px solid brown;
}
</style>
