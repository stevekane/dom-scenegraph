var mat4 = require('gl-mat4')
var vec3 = require('gl-vec3')
var remove = require('./utils').remove

module.exports = Node

function Node (props) {
  props = props || {}
  this.setParent(props.parent || null)
  this.Type = props.Type || 'Node'
  this.color = props.color || '#113366'
  this.dimensions = props.dimensions || vec3.fromValues(10, 10, 0)
  this.origin = props.origin || [0.5, 0.5]
	this.scale = props.scale || vec3.fromValues(1, 1, 1)
	this.position = props.position || vec3.fromValues(0, 0, 0)
	this.rotation = props.rotation || vec3.fromValues(0, 0, 0)
	this.worldPosition = vec3.fromValues(0, 0, 0)
	this.localMatrix = mat4.create()
	this.worldMatrix = mat4.create()
	this.children = []
}

Node.prototype.updateMatrices = function (parentWorldMatrix) {
	mat4.identity(this.localMatrix)
	mat4.translate(this.localMatrix, this.localMatrix, this.position)
  mat4.rotateX(this.localMatrix, this.localMatrix, this.rotation[0])
  mat4.rotateY(this.localMatrix, this.localMatrix, this.rotation[1])
  mat4.rotateZ(this.localMatrix, this.localMatrix, this.rotation[2])
  mat4.scale(this.localMatrix, this.localMatrix, this.scale)

	if (parentWorldMatrix) {
    mat4.multiply(this.worldMatrix, parentWorldMatrix, this.localMatrix)
  }
	else {
    mat4.copy(this.worldMatrix, this.localMatrix)
  }

  vec3.multiply(this.worldPosition, this.position, this.worldMatrix)

	for (var i = 0, child; child = this.children[i++];) {
    child.updateMatrices(this.worldMatrix)
  }
}

Node.prototype.setParent = function (parent) {
  if (this.parent) remove(this.parent.children, this)
	this.parent = parent
	if (parent && parent.children.indexOf(this) === -1) parent.children.push(this)
}
