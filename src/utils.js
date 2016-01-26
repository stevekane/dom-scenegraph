module.exports.remove = remove
module.exports.radToDeg = radToDeg

function remove (array, el) {
  array.splice(array.indexOf(el), 1)
}

function radToDeg (rad) {
  return 360 * rad / (Math.PI * 2)
}
