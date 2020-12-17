import { tokenizer, generator } from '../parser/'

const mttagCtrl = ContentState => {
  ContentState.prototype.setMttag = function (node, tag) {
    let { key, offset } = this.cursor.start
    const startBlock = this.getBlock(key)
    const { text } = startBlock
    const tokens = tokenizer(text, {
      options: this.muya.options
    })

    let delta = 0

    const findEmojiToken = (tokens, offset) => {
      for (const token of tokens) {
        const { start, end } = token.range
        if (offset >= start && offset <= end) {
          delta = end - offset
          return token.children && Array.isArray(token.children) && token.children.length
            ? findEmojiToken(token.children, offset)
            : token
        }
      }
    }

    const token = findEmojiToken(tokens, offset)
    if (token && token.type === 'mt_tag') {
      const emojiText = tag
      offset += delta + emojiText.length - token.content.length
      token.content = emojiText
      token.raw = `#${emojiText}`
      startBlock.text = generator(tokens)
      // add a space if this is the last item in the line
      if (tokens.indexOf(token) === tokens.length - 1) {
        startBlock.text = startBlock.text + ' '
        offset = offset + 1
      }
      this.cursor = {
        start: { key, offset },
        end: { key, offset }
      }
      return this.partialRender()
    }
  }
}

export default mttagCtrl
