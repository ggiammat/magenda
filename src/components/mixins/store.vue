<script>
import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'

export default {
  computed: {
    ...mapGetters(['allItems']),
  },
  methods: {
    updateItem(itemId, updates){

        ipcRenderer.send('mag:source:save-item', itemId, updates)

        //console.log('updates', updates)

        //this.$store.dispatch('updateItem', {itemId, updates})
        //this.$message({message: 'Item Updated', type: 'success'})
    },
    saveItem(item) {

      ipcRenderer.send('mag:source:save-item', item.serialize())

      /*
      if(item.parent) {
        item.baseId = item.parent
        let parentItem = this.$store.state.items.find(i => i.id === item.parent)
        item._base = parentItem
      }
      console.log('dispatching serialized item', item.serialize())
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
      */
    },
    deleteItem(itemId) {

      ipcRenderer.send('mag:source:delete-item', itemId)


      /*
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

      */
    }
  }
}
</script>
