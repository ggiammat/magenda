import { MItem, BaseItemSource } from '@/magenda/core'


export class O365ItemSource extends BaseItemSource {

  constructor(name, configuration, sourceManager) {
    super(name, configuration, sourceManager)
  }

  saveItem (item, updates) {
    console.log('O365 Item Source saving item', item, updates)

    if (item.type === 'virtual-event') {
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


  loadItems(query) {
    const fs = require('fs')
    const content = fs.readFileSync(this.configuration.file, 'utf-8')
    const rawItems = JSON.parse(content)
    var items = []

    rawItems.forEach(ri => {
      items.push(new MItem(
        {
        id: ri.objectId,
        title: ri.subject,
        start: new Date(ri.start.dateTime),
        end: new Date(ri.end.dateTime),
        allDay: ri.isAllDay,
        sourceId: ri.objectId,
        source: this.name,
        type: 'virtual-event'
      }))
    })

    // call the super
    items = items.concat(super.loadItems(query))
    return items
  }

}
