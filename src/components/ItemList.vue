<template>
  <div class="item-list" :class="{ highlighted: highlighted }">
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
</template>
<script>
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import Item from '@/components/Item'
import { MItem } from '@/common/model/mitem'
import storeMixin from '@/components/mixins/store'
import { getWeek } from 'date-fns'
export default {
  mixins: [storeMixin],
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
        if ('week' in this.itemFilters) {
          let currWeek = getWeek(new Date(), {weekStartsOn: 1})
          return this.itemFilters.week(currWeek)
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
        if(event.added.element.id){
          this.updateItem(event.added.element.id, this.itemProps)
        } else {
          let item = new MItem(event.added.element.getSerializedProps())
          item.id = uuidv4()
          Object.keys(this.itemProps).forEach(k => item[k] = this.itemProps[k])
          this.saveItem(item)
        }
        //this.updateItem(event.added.element.id, this.itemProps)
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
  background-color: rgb(238, 255, 237);
}
</style>
