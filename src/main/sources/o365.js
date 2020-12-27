import { MarkdownItemSource } from './markdown'
import log from 'electron-log'
//import { MSALAuthenticationProviderOptions } from '@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions';
//import { Client } from "@microsoft/microsoft-graph-client"
//import { UserAgentApplication } from "msal"
//import * as qs from 'qs'
//import axios from 'axios'
//import 'isomorphic-fetch'
import { MItem } from '../../common/model/mitem'


export class O365ItemSource extends MarkdownItemSource {

  source = 'o365'

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
    log.info('LOADING O365 ITEMS')
    const fs = require('fs')
    const content = fs.readFileSync(this.configuration.file, 'utf-8')
    const rawItems = JSON.parse(content)
    var items = []

    rawItems.forEach(ri => {
      items.push(new MItem(
        {
        id: ri.objectId,
        title: ri.subject,
        start: new Date(ri.start.dateTime).toISOString(),
        end: new Date(ri.end.dateTime).toISOString(),
        allDay: ri.isAllDay,
        sourceId: ri.objectId,
        source: "o365",
        type: 'virtual-event'
      }))
    })

    // call the super
    items = items.concat(super.loadItems(query))
    return items
  }

}
