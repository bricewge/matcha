exports.pick = function (obj, fields) {
  return fields.reduce((a, x) => {
    if (obj[x]) a[x] = obj[x]
    return a
  }, {})
}

exports.uniqueValues = function (obj) {
  let seen = new Set()
  for (let key in obj) { seen.add(obj[key]) }
  return Object.keys(obj).length === seen.size
}

exports.valueIsUnique = function (obj, keyName) {
  for (let key in obj) {
    if (key !== keyName && obj[key] === obj[keyName]) return false
  }
  return true
}

exports.missingKeys = function (obj, keys) {
  return keys.filter((val) => {
    if (!obj.hasOwnProperty(val)) return val
  })
}

exports.is = function (type, obj) {
  var clas = Object.prototype.toString.call(obj).slice(8, -1)
  return obj !== undefined && obj !== null && clas === type
}
