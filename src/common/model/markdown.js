

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
