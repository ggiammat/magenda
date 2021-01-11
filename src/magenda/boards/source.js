import { BaseItemSource } from '@/magenda/core'


export class BoardsItemSource extends BaseItemSource {

  constructor(name, configuration, sourceManager) {
    super(name, configuration, sourceManager)
  }

/*
  _loadItemFromFile(file) {
    let raw = this._loadRawItemFromFile(file)
    if (raw.type === 'board') {
      return new MItem(raw)
    }
    console.log('returning boardmitem')
    return new BoardMItem(raw)
  }
*/

}
