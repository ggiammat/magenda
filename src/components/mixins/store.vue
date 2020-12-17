<script>
import { mapGetters } from 'vuex'
import { serializeObject } from '@/common/model/mitem'
export default {
  computed: {
    ...mapGetters(['items']),
  },
  methods: {
    updateItem(itemId, updates){

        console.log('updates', updates)

        this.$store.dispatch('updateItem', {itemId, updates})
        this.$message({message: 'Item Updated', type: 'success'})
    },
    saveItem(item) {
      this.$store.dispatch('saveItem', item.serialize())
      this.$message({message: 'Item Saved', type: 'success'})
      if(item.parent) {
        console.log('adding subitem')
        let parentItem = this.$store.state.items.find(i => i.id === item.parent)
        console.log('found parent', parentItem)
        let subitems = parentItem.subItems
        subitems.push(item.id)
        subitems = subitems.map(i => typeof i === 'object' ? serializeObject(i) : i) //to remove the proxy
        console.log('new subitems', subitems)
        this.updateItem(parentItem.id, {subItems: subitems})
      }
    },
    deleteItem(itemId) {
      let item = this.$store.state.items.find(i => i.id === itemId)
      this.$store.dispatch('deleteItem', itemId)
      this.$message({message: 'Item Deleted', type: 'success'})
      if (item.parent) {
        let parentItem = this.$store.state.items.find(i => i.id === item.parent)
        console.log('found parent', parentItem)
        let subitems = parentItem.subItems
        subitems = subitems.filter(i => i != itemId).map(i => typeof i === 'object' ? serializeObject(i) : i) //to remove the proxy
        console.log('new subitems', subitems)
        this.updateItem(parentItem.id, {subItems: subitems})
      }
    }
  }
}
</script>
