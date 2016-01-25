var mat3 = require('gl-mat3')
var vec2 = require('gl-vec2')

module.exports = Node

function Node () {
	this.rotationMatrix = mat3.create()
	this.scaleMatrix = mat3.create()
	this.translationMatrix = mat3.create()
	this.localMatrix = mat3.create()
	this.parent = null
	this.children = []
	this.position = vec2.fromValues(0, 0)
	this.scale = vec2.fromValues(1, 1)
	this.rotation = 0
	this.worldMatrix = mat3.create()
	this.worldPosition = vec2.fromValues(0, 0)
}

Node.prototype.updateMatrices = function (parentWorldMatrix) {
	updateLocalMatrix(this)
	mat3.identity(this.worldMatrix)

	if (parentWorldMatrix) mat3.multiply(this.worldMatrix, this.localMatrix, parentWorldMatrix)
	else 							     mat3.copy(this.worldMatrix, this.localMatrix)

	this.worldPosition[0] = this.worldMatrix[6]
	this.worldPosition[1] = this.worldMatrix[7]

	for (var i = 0, child; child = this.children[i++];) child.updateMatrices(this.worldMatrix)
}

Node.prototype.setParent = function (parent) {
	this.parent = parent
	if (parent.children.indexOf(this) === -1) parent.children.push(this)
}

function updateLocalMatrix (node) {
	mat3.identity(node.rotationMatrix)
	mat3.identity(node.scaleMatrix)
	mat3.identity(node.translationMatrix)
	mat3.identity(node.localMatrix)
	
	mat3.rotate(node.rotationMatrix, node.rotationMatrix, node.rotation)
	mat3.scale(node.scaleMatrix, node.scaleMatrix, node.scale)
	mat3.translate(node.translationMatrix, node.translationMatrix, node.position)

	mat3.multiply(node.localMatrix, node.localMatrix, node.rotationMatrix)
	mat3.multiply(node.localMatrix, node.localMatrix, node.scaleMatrix)
	mat3.multiply(node.localMatrix, node.localMatrix, node.translationMatrix)
	return node
}
