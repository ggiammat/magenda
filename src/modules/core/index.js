import { MarkdownItemSource } from './sources/markdown'
import { LocalFilesItemSource } from './sources/localfiles'

export const register = (registerTypesLookup, registerSource) => {
  registerSource('default', MarkdownItemSource)
  registerSource('localFiles', LocalFilesItemSource)
}
