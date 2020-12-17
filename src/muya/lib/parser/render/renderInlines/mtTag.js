import { CLASS_OR_ID } from '../../../config'

export default function mtTag (h, cursor, block, token, outerClass) {
  const className = this.getClassName(outerClass, block, token, cursor)
  const { marker } = token
  const { start, end } = token.range

  const startMarker = this.highlight(h, block, start, start + marker.length, token)
  // const endMarker = this.highlight(h, block, end - marker.length, end, token)
  const content = this.highlight(h, block, start + marker.length, end, token)
  var text = content[0]
  const parsed = content[0].split(';').reduce((acc, t) => {
    const t2 = t.split(':')
    if (t2.length === 1) {
      acc.tag = t2[0]
    } else {
      acc[t2[0]] = t2[1]
    }
    return acc
  }, {})
  console.log(parsed)

  var color = 'GoldenRod'

  if (!isNaN(new Date(parsed.date ? parsed.date : parsed.tag))) {
    color = 'blue'
  }

  return [
    h(`span.${className}.${CLASS_OR_ID.AG_REMOVE}`, startMarker),
    h(`code.${CLASS_OR_ID.AG_INLINE_RULE}.ag-mttag`, {
      attrs: {
        spellcheck: 'false',
        style: 'background-color: ' + color + '; color: black'
      }
    }, text) //,
    // do not hide the end marker
    // h('span.ag-plain-text', endMarker)
  ]
}
