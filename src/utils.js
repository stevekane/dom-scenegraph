module.exports.remove = remove
module.exports.radToDeg = radToDeg
module.exports.randFrom = randFrom

function remove (array, el) {
  array.splice(array.indexOf(el), 1)
}

function radToDeg (rad) {
  return 360 * rad / (Math.PI * 2)
}

function randFrom (array) {
  return array[Math.floor(Math.random() * array.length)]
}
