import { BaseItemSource } from '@/magenda/core'
import { ipcMain } from 'electron'
import { MItem } from '@/magenda/core'
import fs from 'fs'


export class LocalFilesItemSource extends BaseItemSource {

  mappedFiles = {}

  constructor(name, configuration, sourceManager) {
    super(name, configuration, sourceManager)


    ipcMain.on('load-body', (event, ref) => {
      console.log('loading content for', ref)
      const content = fs.readFileSync(ref, 'utf-8')
      event.returnValue = content
    })
  }

  openFile(filePath) {
    console.log('opening', filePath)

    if (this.mappedFiles[filePath]) {
      return this.mappedFiles[filePath]
    }

    if (!fs.existsSync(filePath)) {
      console.error(`File ${filePath} does not exist`)
      return
    }

    let item = new MItem({
      title: filePath,
      bodyRef: filePath
    })
    this.saveItem(item, {})
    // !! item has an Id as side effect of the saveItem() invokation
    this.mappedFiles[filePath] = item.id
    return item.id
  }

  saveItem (item, updates) {
    console.log('LocalFile Item Source saving item', item, updates)

    /*
    if (updates.body) {
      let newContent = updates.body
      //updates.body = undefined
      fs.writeFileSync(item.bodyRef, newContent, 'utf-8')
    }
    */

    super.saveItem(item, updates)
  }

  deleteItem (item) {
    delete this.mappedFiles[item.bodyRef]
    super.deleteItem(item)
  }


  loadItems(query) {
    let items = super.loadItems(query)
    items.forEach(i => this.mappedFiles[i.bodyRef] = i.id)
    console.log(items)
    return items
  }

}
