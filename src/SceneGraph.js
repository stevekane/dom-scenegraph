var Node = require('./Node')
var remove = require('./utils').remove

module.exports = SceneGraph

function SceneGraph () {
  this.root = new Node
  this.nodes = []
}

SceneGraph.prototype.add = function (node, parent) {
  if (this.nodes.indexOf(node) === -1) {
    this.nodes.push(node)
    node.setParent(parent || this.root) 
  }
}

SceneGraph.prototype.remove = function (node) {
  remove(this.nodes, node)
  node.setParent(null)
}
