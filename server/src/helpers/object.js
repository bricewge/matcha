exports.pick = function (obj, ...fields) {
  return fields.reduce((a, x) => {
    if (obj.hasOwnProperty(x)) a[x] = obj[x]
    return a
  }, {})
}

exports.uniqueValues = function (obj) {
  let seen = new Set()
  for (let key in obj) { seen.add(obj[key]) }
  return Object.keys(obj).length === seen.size
}

exports.keyIsUnique = function (obj, keyName) {
  for (let key in obj) {
    if (key !== keyName && obj[key] === obj[keyName]) return false
  }
  return true
}
