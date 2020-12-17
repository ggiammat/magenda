import { MarkdownItemSource } from './markdown'
import { O365ItemSource } from './o365'
import { ipcMain } from 'electron'
import log from 'electron-log'
import * as Mutation from './../../store/mutation-types'
import { MItem } from '../../common/model/mitem'

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


export class SourcesManager {
  sources = {}
  store = null

  constructor(configuration, store) {
    log.info('Initializate SourcesManager with conf ', configuration)
    Object.entries(configuration).forEach(e => {
      let id = e[0]
      let conf = e[1]
      log.info(`Instantiating ${id} with configuration ${conf}`)
      if (id === 'default') {
        this.sources[id] = new MarkdownItemSource('default', conf, this)
      } else if (id === 'O365') {
        this.sources[id] = new O365ItemSource('o365', conf, this)
      }
    })
    this.store = store
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
    ipcMain.on('vue-initialized', () => {
      log.info('VUE INITIALIZED RECEIVED')
      log.info('STORE ITEMS', this.store.state.items.length)
      this.store.dispatch('resetState')
      log.info('STORE ITEMS', this.store.state.items.length)
      this.load('all')
    })
    //this.listenForIpcMainEvents()
  }

  saveItem (item) {
    this.sources['default'].saveItem(item)
  }

  deleteItem (item) {
    this.sources['default'].deleteItem(item)
  }

  updateItem (itemId, updates) {
    this.sources['default'].updateItem(itemId, updates)
  }

  load(query) {
    Object.entries(this.sources).forEach(s => {
      s[1].load(query)
    })
  }

  notifyUpdatedItems(source, items) {
    log.info(`Received notification for updated items from ${source.name}`)
    const { dedupItems, updatedOrig } = deduplicateItems(items, this.store.state.items)
    //log.info(`DEDUP RESULTS: ${dedupItems}, ${updatedOrig}`)
    this.store.commit(Mutation.LOAD_ITEMS, dedupItems.map(i => i.serialize()))
    updatedOrig.forEach(i => {
      log.debug(i)
      this.store.commit(Mutation.UPDATE_ITEM, i)
    })

    //console.log(items)
    //this.store.commit(Mutation.LOAD_ITEMS, items.map(i => i.serialize()))
  }
}
