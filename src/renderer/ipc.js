import { ipcRenderer } from 'electron'

export function saveItem(item) {
  ipcRenderer.send('mag:source:save-item', item.serialize())
}

export function updateItem(itemId, updates) {
  ipcRenderer.send('mag:source:save-item', itemId, updates)
}

export function deleteItem(itemId) {
  ipcRenderer.send("mag:source:delete-item", itemId);
}
