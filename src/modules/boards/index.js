import { BoardMItem } from './model'
import { BoardsItemSource } from './source'

export const register = (registerTypesLookup, registerSource) => {
  registerTypesLookup('board-item', BoardMItem)
  registerSource('boards', BoardsItemSource)
}
