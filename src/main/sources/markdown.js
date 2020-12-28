import { ItemSource } from './index'
import log from 'electron-log'
import fs from 'fs'
import YAML from 'yaml'
import path from 'path'
import { MItem } from '../../common/model/mitem'
import { v4 as uuidv4 } from 'uuid'
import * as Mutation from './../../store/mutation-types'

const regex = /^---([\s\S]*)---\n\n([\s\S]*)$/

export class MarkdownItemSource extends ItemSource {

  source = 'default'

  constructor(name, configuration, sourceManager) {
    super(name, configuration, sourceManager)
    this.dataPath = configuration.storePath
  }

  deleteItem (item) {
    log.info('Deleting item into MainItemSource')
    fs.renameSync(`${this.dataPath}/${item.id}.md`,`${this.dataPath}/trash/${item.id}.md`)
    console.log('SubItems:', this.subItemsRefs[item.id])

    //this.subItemsRefs[item.id].forEach(ref => {
    //  this.sourceManager.store.commit(Mutation.DELETE_ITEM, ref)
    //})
    this.sourceManager.store.commit(Mutation.DELETE_ITEM, [item.id, ...(this.subItemsRefs[item.id] || [])])
    delete this.subItemsRefs[item.id]
  }


  saveItem (item, updates) {

    if (item.type === 'virtual-subitem') {
      console.log('MarkdownSource - It\'s a virtual-subitem')
      let newItem = new MItem()
      //newItem.baseId = item.id
      newItem.rels = [{
        name: 'encapsulation',
        other: item.id,
        role: 'encapsulator'
      }]
      this.saveItem(newItem, updates)
      return
    }

    // no id. It's a new item
    if (!item.id) {
      console.log('MarkdownSource - It\'s a new item')
      item.id = uuidv4()
      if (updates) {
        Object.keys(updates).forEach(k => item[k] = updates[k])
      }
      this.writeItemToFile(item)
      const subs = this.createSubItems(item)
      this.sourceManager.store.commit(Mutation.LOAD_ITEMS, [item.serialize(), ...subs.map(s => s.serialize())])
    } else {
      console.log('MarkdownSource - It\'s an update')
      // It's an update
      let updatedItem = MItem.deserialize(item.serialize()) // clone the item because the original is in vuex and cannot be modified outside a mutation
      Object.keys(updates).forEach(k => (updatedItem[k] = updates[k]));
      this.writeItemToFile(updatedItem)
      this.sourceManager.store.commit(Mutation.UPDATE_ITEM, {
        itemId: item.id,
        updates: updates
      });

      //await new Promise(resolve => setTimeout(resolve, 5000))

      //update the subitems. For simplicity we delete all the existing and recreate the new
      //this.subItemsRefs[item.id].forEach(ref => {
      //  this.sourceManager.store.commit(Mutation.DELETE_ITEM, ref)
      //})
      this.sourceManager.store.commit(Mutation.DELETE_ITEM, this.subItemsRefs[item.id])
      delete this.subItemsRefs[item.id]

      //await new Promise(resolve => setTimeout(resolve, 5000))

      const subs = this.createSubItems(updatedItem)
      if(subs.length > 0) {
        this.sourceManager.store.commit(Mutation.LOAD_ITEMS, subs.map(s => s.serialize()))
      }
    }
  }



  writeItemToFile(item){
    const toSave = ['title', 'week', 'done', 'start', 'subItems', 'parent', 'source', 'sourceId', 'rels', 'role', 'other', 'name'] //name is only for the relationships... find a better way to filter rels fields
    let d = YAML.stringify(item.getSerializedProps(), toSave)
    let text = item.body || ''
    let markdown = `---\n${d}---\n\n${text}`
    fs.writeFileSync(`${this.dataPath}/${item.id}.md`, markdown, 'utf-8')
    console.log('item wrote to ', `${this.dataPath}/${item.id}.md`)
  }

  updateItem (itemId, updates, item) {
    console.log('Markdown source update item')
    //let item = this._loadItemFromFile(`${this.dataPath}/${itemId}.md`)
    //Object.entries(updates).forEach(e => item[e[0]] = e[1])
    //let newItem = MItem.buildFromDict({ ...item, ...updates })
    // since this callback is called after the commit, the item is already updated
    console.log('item to save', item)
    this.saveItem(item)
  }


  hashCode (str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  load(query) {
    this.sourceManager.store.commit(Mutation.LOAD_ITEMS, this.loadItems().map(i=>i.serialize()))
  }

  init(query) {
    this.sourceManager.store.commit(Mutation.INIT_STORE, this.loadItems().map(i=>i.serialize()))
  }

  loadItems(query) {
    var items = []
    fs.readdirSync(this.dataPath).forEach(file => {
      if (!file.endsWith('.md')) return
      let item = this._loadItemFromFile(`${this.dataPath}/${file}`)
      items.push(item)
      items = items.concat(this.createSubItems(item))
    })
    //console.log('items', items.map(i=>i.serialize()))
    return items
  }

  // keep the ids of all subItems created for an item
  subItemsRefs = {}

  createSubItems(item) {
    const res = []
    if (item.subItems) {
      this.subItemsRefs[item.id] = []
      item.subItems
        .filter(si => typeof si === "object")
        .forEach(si => {
          let subItem = new MItem(si)
          subItem.id = `${item.id}:${this.hashCode(si.title)}`
          subItem.type = 'virtual-subitem'
          subItem.source = this.source
          subItem.rels = [{
              other: item.id,
              role: "child",
              name: "parent"
            },
            {
              name: 'extends',
              other: item.id,
              role: 'extender'
            }
          ]
          res.push(subItem)
        })
    }
    this.subItemsRefs[item.id] = res.map(i => i.id)
    return res
  }

  _loadItemFromFile(file) {
    const markdown = fs.readFileSync(file, 'utf-8')
    let m
    if ((m = regex.exec(markdown)) !== null) {
      try {
        let item = {
          id: path.basename(file, '.md'),
          body: m[2],
          ...YAML.parse(m[1]),
          source: this.source
        }
        return new MItem(item)//MItem.buildFromDict(item)
      } catch (err) {
        log.error(`Error loading item from ${file}: ${err}`)
      }
    }
  }
}
