<template>
  <div class="item-list" :class="{ highlighted: highlighted }">
    <div v-if="groupByProject && groupedItems.length > 1">
   <div v-for="group in groupedItems" :key="group.groupName">
     <el-divider content-position="left">{{ group.groupName === 'nogroup' ? 'Others' : group.groupName }}</el-divider>
     <draggable
     :list="group.items"
     group="people"
     @change="log"
     item-key="id">
     <template #item="{element}">
       <div>
         <item :item="element"></item>
       </div>
      </template>
    </draggable>
   </div>
 </div>
 <div v-else>
   <draggable
   :list="visibleItems"
   group="people"
   @change="log"
   item-key="id">
   <template #item="{element}">
     <div>
       <item :item="element"></item>
     </div>
    </template>
  </draggable>
 </div>
</div>
</template>
<script>
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import Item from './Item'
import { MItem } from '@/magenda/core'
import { saveItem, updateItem } from '@/renderer/ipc'
export default {
  components: {
    draggable,
    Item
  },
  props: {
    itemFilters: {
      type: Object,
      default: () => { return {}}
    },
    itemProps: {
      type: Object,
      default: () =>{ return {}}
    },
    canDrop: {
      type: Boolean,
      default: true
    },
    groupByProject: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      id: '0',
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['topLevelItems']),
    groupedItems() {
      let res = {}
      this.visibleItems.forEach(i => {
        if (i.project) {
          res[i.project] ? res[i.project].push(i) : res[i.project] = [i]
        } else {
          res['nogroup'] ? res['nogroup'].push(i) : res['nogroup'] = [i]
        }
      })
      return Object.entries(res).map(e => {return {groupName: e[0], items: e[1]}}).sort((a, b) => {
        if (a.groupName === 'nogroup') return 1
        if (b.groupName === 'nogroup') return -1
        return a.groupName.localeCompare(b.groupName)
      })
    },
    visibleItems() {
      return this.topLevelItems
        .filter(t => {
          let res = true
          Object.keys(this.itemFilters).forEach(k => {
            res &= this.itemFilters[k](t[k])
          })
          return res
        })
    },
    highlighted() {
        if ('deadline' in this.itemFilters) {
          return this.itemFilters.deadline(new Date())
        }
        if ('start' in this.itemFilters) {
          return this.itemFilters.start(new Date())
        }
        return false
    }
  },
  methods: {
    showDialog(item) {
      this.$refs.dialog.show(item.id)
    },
    log(event) {
      if(event.added){
        if(this.canDrop) {
        if(event.added.element.id){
          updateItem(event.added.element.id, this.itemProps)
        } else {
          let item = new MItem(event.added.element.getSerializedProps())
          saveItem(item , this.itemProps)
        }
        //this.updateItem(event.added.element.id, this.itemProps)
      }
      }
    },
  }
}
</script>
<style>
.item-list {
  padding: 10px;
  border: 1px dashed gray;
}
.line-through {
    text-decoration: line-through;
}
.highlighted {
  border: 2px dashed green;
}
</style>
