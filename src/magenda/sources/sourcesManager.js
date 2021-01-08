import { ipcMain } from 'electron'
import log from 'electron-log'
//import * as Mutation from './../../store/mutation-types'
import { MItem } from '../model/base'
import MAgenda from '../../magenda'

/*
function deduplicateItems(items, allItems) {
  let duplicatesPairs = []
  items.forEach((i, index) => {
    let dup = allItems.find(ai => ai.source == i.source && ai.sourceId == i.sourceId)
    if (dup) {
      duplicatesPairs.push([i, index, dup])
    }})
  let newItems = items
  let updatedOrig = []
  duplicatesPairs.forEach(i => {
    log.debug(`Skipping duplicated item ${i[0].title}`)
    updatedOrig.push({
      itemId: i[2].id, updates: { hasDuplicate: true }
    })
    newItems.splice(i[1], 1)
  })
  return { dedupItems: newItems, updatedOrig: updatedOrig }
}
*/

export class SourcesManager {
  sources = {}
  store = null

  constructor(configuration, store) {
    log.info('Initializate SourcesManager with conf ', configuration)

    Object.keys(MAgenda.sources).forEach(s => {
      console.log('instantiating item source', s)
      this.sources[s] = new MAgenda.sources[s](s, configuration[s], this)
    })
    /*
    Object.entries(configuration).forEach(e => {
      let id = e[0]
      let conf = e[1]
      log.info(`Instantiating ${id} with configuration ${conf}`)
      if (id === 'default') {
        this.sources[id] = new MarkdownItemSource('default', conf, this)
      } else if (id === 'O365') {
        this.sources['o365'] = new O365ItemSource('o365', conf, this)
      } else if (id === 'localFiles') {
        this.sources['localFiles'] = new LocalFilesItemSource('localFiles', conf, this)
      } else if (id === 'boards') {
        this.sources['boards'] = new BoardsItemSource('boards', conf, this)
      } else if (id === 'timesheets') {
        this.sources['timesheets'] = new TimesheetsItemSource('timesheets', conf, this)
      }
    })

    */
    this.store = store

    /*
    this.store.subscribe((mutation, state) => {
      let type = mutation.type
      if (type === Mutation.SAVE_ITEM) {
        this.saveItem(MItem.deserialize(mutation.payload))
      } else if (type === Mutation.DELETE_ITEM) {
        this.deleteItem(mutation.payload)
      } else if (type === Mutation.UPDATE_ITEM) {
        this.updateItem(mutation.payload.itemId, mutation.payload.updates)
      }
    })
    */

    ipcMain.on("mag:source:init-store", (event, itemsFilter) => {
      console.log('itemsFilter not yet supported:', itemsFilter)
      event.returnValue = {
        items: this.store.state.items.map(i => i.serialize())
      }
    })

    ipcMain.on('mag:source:save-item', (event, itemOrId, updates) => {
      console.log('SAVE ITEM RECEIVED', itemOrId, updates)
      let item = typeof itemOrId === 'object' ? MItem.deserialize(itemOrId) : this.store.state.items.find(i => i.id === itemOrId)
      console.log('deserialized item', item)

      let itemSource = item.source
      if (!itemSource) {
        console.log('Received item without source. Applying the defualtSource', MAgenda.defaultSources)
        itemSource = MAgenda.defaultSources[item.type]
      }
      if (!itemSource) {
        console.log('Setting item source to default')
        itemSource = 'default'
      }

      const ret = this.sources[itemSource].saveItem(item, updates)
      event.reply('save-reply', ret)
    })

    ipcMain.on('mag:source:delete-item', (event, itemId) => {
      let item = this.store.state.items.find(i => i.id === itemId)
      let itemSource = item.source || 'default'
      this.sources[itemSource].deleteItem(item)
    })

    this.init('all')

    /*
    ipcMain.on('vue-initialized', () => {
      log.info('VUE INITIALIZED RECEIVED')
      log.info('STORE ITEMS', this.store.state.items.length)
      this.store.dispatch('resetState')
      log.info('STORE ITEMS', this.store.state.items.length)
      this.load('all')
    })
    */
    //this.listenForIpcMainEvents()
  }

  saveItem (item) {
    this.sources['default'].saveItem(item)
  }

  deleteItem (item) {
    this.sources['default'].deleteItem(item)
  }

  updateItem (itemId, updates) {
    let item = this.store.state.items.find(i => i.id === itemId)
    this.sources['default'].updateItem(itemId, updates, item)
  }

  load(query) {
    Object.entries(this.sources).forEach(s => {
      s[1].load(query)
    })
  }

  init(query) {
    Object.entries(this.sources).forEach(s => {
      s[1].init(query)
    })
  }


  notifyUpdatedItems(source, items) {
    //const { dedupItems, updatedOrig } = deduplicateItems(items, this.store.state.items)
    //log.info(`DEDUP RESULTS: ${dedupItems}, ${updatedOrig}`)
    //this.store.commit(Mutation.LOAD_ITEMS, items.map(i => i.serialize()))

    /*
    updatedOrig.forEach(i => {
      this.store.commit(Mutation.UPDATE_ITEM, i)
    })
    */

    //console.log(items)
    //this.store.commit(Mutation.LOAD_ITEMS, items.map(i => i.serialize()))
  }
}
