import { ItemSource } from './index'
import log from 'electron-log'
import fs from 'fs'
import YAML from 'yaml'
import path from 'path'
import { getSubItems } from '../../common/model/markdown'
import { MItem } from '../../common/model/mitem'

function deduplicateSubItems(subItems, allItems) {
  const titlesOfItemsWithId = subItems.filter(i => i.id).map(i => allItems.find(ai => ai.id == i.id)).filter(i => i != null).map(i => i.title)
  let newSubItems = subItems.map(si => titlesOfItemsWithId.includes(si.title) ? null : si).filter(i => i != null)
  return newSubItems
}

const regex = /^---([\s\S]*)---\n\n([\s\S]*)$/

export class MarkdownItemSource extends ItemSource {
  constructor(name, configuration, sourceManager) {
    super(name, configuration, sourceManager)
    this.dataPath = configuration.storePath
  }

  saveItem (item) {
    log.info('Saving item into MainItemSource')
    log.info(item)
    const toSave = ['title', 'week', 'done', 'start', 'subItems', 'parent', 'source', 'sourceId']
    let d = YAML.stringify(item.getSerializedProps(), toSave)
    let text = item.body || ''
    let markdown = `---\n${d}---\n\n${text}`
    fs.writeFileSync(`${this.dataPath}/${item.id}.md`, markdown, 'utf-8')
  }

  updateItem (itemId, updates) {
    console.log('Markdown source update item')
    let item = this._loadItemFromFile(`${this.dataPath}/${itemId}.md`)
    Object.entries(updates).forEach(e => item[e[0]] = e[1])
    //let newItem = MItem.buildFromDict({ ...item, ...updates })
    this.saveItem(item)
  }

  deleteItem (itemId) {
    log.info('Deleting item into MainItemSource')
    fs.renameSync(`${this.dataPath}/${itemId}.md`,`${this.dataPath}/trash/${itemId}.md`)
  }

  _innerLoad(query) {
    const items = []
    fs.readdirSync(this.dataPath).forEach(file => {
      if (!file.endsWith('.md')) return
      items.push(this._loadItemFromFile(`${this.dataPath}/${file}`))
    })
    // deduplication of subitems. It will not work if the id of itemRef are not in the items
    // loaded in this function
    //items.filter(i => i.subItems).forEach(i => i.subItems = deduplicateSubItems(i.subItems, items))
    return items
  }

  _loadItemFromFile(file) {
    const markdown = fs.readFileSync(file, 'utf-8')
    let m
    if ((m = regex.exec(markdown)) !== null) {
      try {
        let item = {
          id: path.basename(file, '.md'),
          body: m[2],
          ...YAML.parse(m[1])
        }
        return new MItem(item)//MItem.buildFromDict(item)
      } catch (err) {
        log.error(`Error loading item from ${file}: ${err}`)
      }
    }
  }
}
