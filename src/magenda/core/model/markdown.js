
const regex = /\B(#)(\w*[0-9a-zA-Z][\w\-.:;]*)\b/gm;

export function extractBodyProps (text) {
  let m
  let res = {}
  res.subItems = getSubItems(text)
  while ((m = regex.exec(text)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    let full = m[2]
    let tokens = full.split(':')
    if(tokens.length == 2) {
      res[tokens[0]] = tokens[1]
    }
  }
  return res
}

export function getSubItems(text) {
  const regex = /\[([ xX])\] (.+)/gm
  let m
  var res = []
  while ((m = regex.exec(text)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }

    let checked = m[1] === 'x' || m[1] === 'X'
    res.push({title: m[2], done: checked})
  }
  return res
}
