var mat4 = require('gl-mat4')
var vec3 = require('gl-vec3')
var Node = require('./Node')

module.exports = Camera

function Camera () {
  Node.call(this, 'camera')
  this.dimensions = vec3.fromValues(640, 480, 0)
  this.viewMatrix = mat4.create()
}

Camera.prototype = Object.create(Node.prototype)

Camera.prototype.updateMatrices = function (parentWorldMatrix) {
  Node.prototype.updateMatrices.call(this, parentWorldMatrix)
  mat4.identity(this.viewMatrix)
  mat4.invert(this.viewMatrix, this.worldMatrix)
}
