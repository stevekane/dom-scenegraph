module.exports.remove = remove

function remove (array, el) {
  array.splice(array.indexOf(el), 1)
}
