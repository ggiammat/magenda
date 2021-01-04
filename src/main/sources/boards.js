import { MarkdownItemSource } from './markdown'
import { MItem, BoardMItem } from '../../common/model/mitem'


export class BoardsItemSource extends MarkdownItemSource {

  source = 'boards'

  constructor(name, configuration, sourceManager) {
    super(name, configuration, sourceManager)
  }

  _loadItemFromFile(file) {
    let raw = this._loadRawItemFromFile(file)
    if (raw.type === 'item-board') {
      return new MItem(raw)
    }
    return new BoardMItem(raw)
  }
}
