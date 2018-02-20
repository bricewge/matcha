exports.inSingleQuotes = function (str) {
  let res = []
  let match = null
  let regexp = /'(.*?)'/g
  while ((match = regexp.exec(str))) {
    res.push(match[1])
  }
  return res
}
