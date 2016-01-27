var Node = require('./Node')
var remove = require('./utils').remove

module.exports = SceneGraph

function SceneGraph (root, nodes) {
  this.root = root
  this.nodes = nodes
}
