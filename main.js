var React = require('react')
var mat4 = require('gl-mat4')
var DOM = require('react-dom')
var Node = require('./src/Node')
var Camera = require('./src/Camera')

var STAGE = document.getElementById('stage')
var root = new Node
var box = new Node
var b2 = new Node
var b3 = new Node
var c = new Camera

const colors = ['blue', 'red', 'green', 'pink']

box.setParent(root)
b2.setParent(box)
b3.setParent(b2)
box.position[0] = 0
box.position[1] = 0
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

function setMat3d (camera, node) {
  var m = node.worldMatrix
  var v = camera.worldMatrix
  var mat = mat4.create()

  mat4.multiply(mat, v, m)
  mat[12] += camera.dimensions[0] / 2
  mat[13] += camera.dimensions[1] / 2

  return `matrix3d(${mat.join(',')})`
}

function Box (camera, node, key) {
  var props = {
    key: key,
    style: {
      position: 'absolute',
      backgroundColor: node.color,
      left: -node.dimensions[0] / 2,
      top: -node.dimensions[1] / 2,
      width: node.dimensions[0],
      height: node.dimensions[1],
      transform: setMat3d(camera, node)
    }
  }

  return React.createElement('div', props)
}

function SceneGraph (camera, root) {
  var nodes = getNodes(root)
  var props = {
    style: {
      backgroundColor: 'gray',
      width: camera.dimensions[0],
      height: camera.dimensions[1] 
    }
  }
  var boxes = []

  for (var i = 0, box; box = nodes[i++];) {
    boxes.push(Box(camera, box, i))
  }
  
  return React.createElement('div', props, boxes)
}

var count = 0

function render () {
  requestAnimationFrame(render)
  count += 0.01
  //box.rotation += Math.PI / 1080
  b2.rotation -= Math.PI / 24
  b2.position[0] = Math.sin(count) * 100
  b3.position[1] = Math.cos(count) * 50
  //c.rotation -= Math.PI / 1080
  root.updateMatrices()
  c.updateMatrices()
  DOM.render(SceneGraph(c, root), STAGE)
}

window.box = box
window.b2 = b2
window.c = c

render()
