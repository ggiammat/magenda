<template>
  <item-editor :itemId="itemId"></item-editor>
</template>

<script>
// @ is an alias to /src

import ItemEditor from '../components/ItemEditor.vue'

export default {
  name: "Home",
  components: {
    ItemEditor
  },
  props: {
    itemId: String //set by the router
  }
};
</script>
