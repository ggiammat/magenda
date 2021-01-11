import { MItem, BaseItemSource } from '@/magenda/core'


export class O365EmailItemSource extends BaseItemSource {

  constructor(name, configuration, sourceManager) {
    super(name, configuration, sourceManager)
  }

  saveItem (item, updates) {
    console.log('O365 Item Source saving item', item, updates)

    if (item.type === 'virtual-email') {
      let newItem = new MItem()
      newItem.rels = [{
        name: 'encapsulation',
        other: item.id,
        role: 'encapsulator'
      }]
      this.saveItem(newItem, updates)
      return
    }
    super.saveItem(item, updates)
  }

  loadItems() {
    const fs = require('fs')
    const content = fs.readFileSync(this.configuration.file, 'utf-8')
    const rawItems = JSON.parse(content)
    var items = []

    rawItems.forEach(ri => {
      items.push(MItem.deserialize(
        {
          serializable: {
            id: ri.id,
            title: ri.subject,
            body: ri.body,
            source: this.name,
            sourceId: ri.id,
            type: 'virtual-email'
          }
        }))
      })


    // call the super
    items = items.concat(super.loadItems())
    return items
  }

}
