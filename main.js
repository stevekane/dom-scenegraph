var React = require('react')
var DOM = require('react-dom')
var Node = require('./src/Node')

var STAGE = document.getElementById('stage')
var root = new Node
var box = new Node
var b2 = new Node
var b3 = new Node

const colors = ['blue', 'red', 'green', 'pink']

box.setParent(root)
b2.setParent(box)
b3.setParent(b2)
box.position[0] = 300
box.position[1] = 300
box.dimensions[0] = 40
box.dimensions[1] = 40
box.color = randFrom(colors)
b2.color = randFrom(colors)
b3.color = randFrom(colors)
b2.dimensions[0] = 20
b2.dimensions[1] = 20

function randFrom (array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getNodes (root) {
  var ar = []
  
  function add (node) {
    ar.push(node)
    node.children.forEach(add)
  }
  
  root.children.forEach(add)
  return ar
}

function setMat3d (node) {
  var m = node.worldMatrix

  return `matrix3d(${node.worldMatrix.join(',')})`
}

function Box (node, key) {
  var props = {
    key: key,
    style: {
      position: 'absolute',
      backgroundColor: node.color,
      left: -node.dimensions[0] / 2,
      top: -node.dimensions[1] / 2,
      width: node.dimensions[0],
      height: node.dimensions[1],
      transform: setMat3d(node)
    }
  }

  return React.createElement('div', props)
}

function SceneGraph (root) {
  var nodes = getNodes(root)
  var props = {
    style: {
      backgroundColor: 'gray',
      width: 640,
      height: 580
    }
  }
  return React.createElement('div', props, nodes.map(Box))
}

var count = 0

function render () {
  requestAnimationFrame(render)
  count += 0.01
  box.rotation += Math.PI / 1080
  b2.rotation -= Math.PI / 24
  b2.position[0] = Math.sin(count) * 100
  b3.position[1] = Math.cos(count) * 50
  root.updateMatrices()
  DOM.render(SceneGraph(root), STAGE)
}

window.box = box
window.b2 = b2

render()
