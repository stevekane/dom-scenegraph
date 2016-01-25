var mat4 = require('gl-mat4')
var vec3 = require('gl-vec3')
var Node = require('./Node')

module.exports = Camera

function Camera () {
  Node.call(this)
  this.dimensions = vec3.fromValues(640, 480, 0)
}

Camera.prototype.updateMatrices = function () {
  Node.prototype.updateMatrices.call(this)
  mat4.invert(this.worldMatrix, this.worldMatrix)
}
