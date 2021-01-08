<template>
  <el-input-number v-model="item.par" :step="2" step-strictl></el-input-number>
  <el-checkbox v-model="ferieValue">Ferie</el-checkbox>
</template>

<script>
import commonEditor from '../../renderer/components/editors/common'

export default {
  ...commonEditor,
  data(){
    return {
      ferieValue: this.item.ferie > 0
    }
  },
  mounted(){
  },
  watch:{
    'ferieValue'(val){
      console.log('ferieValue is', val)
      this.item.ferie = val ? 8 : 0
      console.log('itemferie is', this.item.ferie)
    },
    'item': {
      deep: true,
      handler(val){
        console.log('item changed', val, this.item.__updates)
        this.save()
      }
    }
  }
}
</script>
