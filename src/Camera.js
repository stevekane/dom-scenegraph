var mat4 = require('gl-mat4')
var vec3 = require('gl-vec3')
var Node = require('./Node')
var utils = require('./utils')

module.exports = Camera

function Camera (props) {
  Node.call(this, props)
  this.Type = 'Camera'
  this.viewMatrix = mat4.create()
}

Camera.prototype = Object.create(Node.prototype)

Camera.prototype.updateMatrices = function (parentWorldMatrix) {
  Node.prototype.updateMatrices.call(this, parentWorldMatrix)
  mat4.identity(this.viewMatrix)
  mat4.invert(this.viewMatrix, this.worldMatrix)
}
