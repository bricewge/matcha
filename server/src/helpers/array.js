exports.commonItems = function (a, b) {
  var setA = new Set(a)
  var setB = new Set(b)
  var intersection = new Set([...setA].filter(x => setB.has(x)))
  return intersection.size
}
