<template>
  <div class="item-div" :class="{ 'line-through': item.done }" @click="clicked()">
    <span v-if="item._base">(B) </span>
    <span v-if="item.baseId && !item._base">$$B</span>
    <span v-if="item.hasDuplicate">(D)</span>
    <span>{{time}} </span>
    <span>{{item.title}}</span>
  </div>
  <div style="padding-left:20px">
    <item v-for="si in subItems" :key="si.id || si.title" :item="si"></item>
  </div>
</template>
<script>
import { MItem } from '@/common/model/mitem'
import { mapGetters } from 'vuex'
import { format, parseISO } from 'date-fns'
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
  computed: {
    ...mapGetters(['items']),
    time() {
      if (this.item.start) {
        console.log(this.item.start)
        return format(parseISO(this.item.start), 'h:mm aaaa')
      } else {
        return undefined
      }
    },
    subItems() {

      return this.items.filter(i => {
        if (i.rels) {
            let res = i.rels.find(r => r.role === 'child' && r.other === this.item.id)
            return res || false
        }
        return false
      })

      /*
      if(this.item.subItems){
        // find subtiems with id first
        let sub = this.item.subItems.filter(si => typeof si === 'string').map(si => this.items.find(ii => ii.id == si)).filter(i => i)
        let subTitles = sub.map(s => s.title)
        let subNoId = this.item.subItems.filter(si => typeof si === 'object' && !subTitles.includes(si.title)).map(si => new MItem({...si, parent: this.item.id}))
        return [...sub, ...subNoId]
        */
        /*
      return this.item.subItems.map(si => {
        if (typeof si === 'object'){
          return new MItem({...si, parent: this.item.id})
        }
        if(typeof si === 'string'){
          return this.items.find(i => i.id === si)
        }
        return {title: 'undefined subitem'}
      }).filter(si => si)
      */

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
