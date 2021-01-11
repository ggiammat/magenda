<template>
  <item-editor :itemId="itemId"></item-editor>
</template>

<script>
// @ is an alias to /src

import {TextEditor as ItemEditor} from '@/magenda/textEditor/vue'

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
