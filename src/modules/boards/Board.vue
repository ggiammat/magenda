<template>
  <el-button @click="test()">TEST</el-button>
  {{ debug }}
  <div v-for="i in items" :key="i.id">

  <Vue3DraggableResizable
    style="background-color: #ffff0030"
    :initW="i.w"
    :initH="i.h"
    v-model:x="i.x"
    v-model:y="i.y"
    v-model:w="i.w"
    v-model:h="i.h"
    v-model:active="i.active"
    :draggable="true"
    :resizable="true"
    @activated="print('activated')"
    @deactivated="print('deactivated')"
    @drag-start="print('drag-start')"
    @resize-start="print('resize-start')"
    @dragging="print('dragging')"
    @resizing="print('resizing')"
    @drag-end="dragEnd(i)"
    @resize-end="dragEnd(i)"
  >
    <div>{{ i.title }} {{ i.targetItem.title }}</div>
    <BoardItemEditor :itemId="i.targetItem.id"></BoardItemEditor>
  </Vue3DraggableResizable>
</div>
</template>
<script>
import { useStore } from 'vuex'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
import { MItem } from '@/magenda/model/base'
import { saveItem, updateItem } from '@/renderer/ipc'
import { ref } from 'vue'
import BoardItemEditor from './BoardItem'

export default {
  components: {
    Vue3DraggableResizable,
    BoardItemEditor
  },
  setup() {
    const store = useStore()

    const board = store.getters.allItems.find(i => i.type === 'board')
    console.log('BOARD ITEM FOUND', board)
    const items = board.childs.map(i => i.getEditingTrackerMItem())
    const print = (val) => {
      console.log(val)
    }
    const debug = ref(items[0].x)

    return {
      items,
      board,
      print,
      debug
    }
  },
  methods: {
    test() {
      saveItem(new MItem({
        rels: [{
          role: 'child',
          other: 'a84afade-5475-4086-a17d-c9fe6389a0a3',
          name: 'parent'
        }, {
          role: 'boarder',
          other: 'b482a74d-9470-406f-aa18-d5a24d345f29',
          name: 'boardItemRel'
        }]
      }))
    },
    dragEnd(item) {
      console.log(this.board)
      updateItem(item.id, item.__updates)
    }
  }
}
</script>
