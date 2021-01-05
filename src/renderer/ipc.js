import { ipcRenderer } from 'electron'

export function saveItem(item, updates, callback) {
  if (callback) {
    ipcRenderer.on('save-reply', (event, ret) => {
      console.log('main returned', ret)
      callback(ret)
    })
  }
  ipcRenderer.send('mag:source:save-item', item.serialize(), updates)
}

export function updateItem(itemId, updates) {
  ipcRenderer.send('mag:source:save-item', itemId, updates)
}

export function deleteItem(itemId) {
  ipcRenderer.send("mag:source:delete-item", itemId);
}
