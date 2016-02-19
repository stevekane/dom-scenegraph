var mat4 = require('gl-mat4')
var vec3 = require('gl-vec3')
var Node = require('./Node')
var utils = require('./utils')

module.exports = Camera

function Camera (props) {
  Node.call(this, props)
  this.Type = 'Camera'
  this.viewMatrix = mat4.create()
  this.viewportScale = vec3.fromValues(1, 1, 1)
}

Camera.prototype = Object.create(Node.prototype)
