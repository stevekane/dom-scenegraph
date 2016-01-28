var React = require('react')
var DOM = require('react-dom')
var mat4 = require('gl-mat4')
var Node = require('../Node')
var Camera = require('../Camera')

module.exports = ReactRenderer

function setMat3d (width, height, camera, node) {
  var m = node.worldMatrix
  var v = camera.viewMatrix
  var mat = mat4.create()

  mat4.multiply(mat, v, m)
  var xScaled = (mat[12] + (camera.dimensions[0] / 2)) * (width / camera.dimensions[0])
  var yScaled = (mat[13] + (camera.dimensions[1] / 2)) * (height / camera.dimensions[1]) 
  mat[12] = xScaled
  mat[13] = yScaled
  var vals = mat.join(',')
  return `matrix3d(${vals})`
}

function NodeComponent (width, height, camera, node, key) {
  var xScale = camera.dimensions[0] / width
  var yScale = camera.dimensions[1] / height
  var props = {
    key: key,
    style: {
      position: 'absolute',
      left: -node.dimensions[0] / 2 / xScale,
      top: -node.dimensions[1] / 2 / yScale,
      width: node.dimensions[0] / xScale,
      height: node.dimensions[1] / yScale,
      transform: setMat3d(width, height, camera, node),
      color: 'white',
      fontSize: (node.fontSize || 1) + 'em'
    }
  }

  return React.createElement('div', props, node.text)
}

function ImageComponent (width, height, camera, node, key) {
   
}

function CameraComponent (width, height, camera, node, key) {
  var camera = NodeComponent(width, height, camera, node, key)

  camera.props.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
  camera.props.style.backgroundSize = '10%'
  camera.props.style.backgroundImage = "url('camera.png')"
  camera.props.style.backgroundRepeat = 'no-repeat'
  return camera
}

function ReactRenderer (el, scene) {
  this.scene = scene
}

ReactRenderer.prototype.render = function (el, camera) {
  var renderables = []
  var ASPECT_RATIO = 640 / 480
  var w = el.clientWidth
  var h = el.clientHeight
  var newWidth = w / h <= ASPECT_RATIO ? w : ASPECT_RATIO * h
  var newHeight = newWidth / ASPECT_RATIO
  var props = {
    key: 'root',
    style: {
      overflow: 'hidden',
      position: 'absolute',
      backgroundColor: 'gray',
      width: newWidth,
      height: newHeight,
      fontSize: 14 * newWidth / camera.dimensions[0] + 'px'
    }
  }

  this.scene.root.updateMatrices()
  for (var i = 0, node, Type; node = this.scene.nodes[i++];) {
    if (node === camera) continue
    if   (node.Type === 'Camera') Type = CameraComponent
    else                          Type = NodeComponent
    renderables.push(Type(newWidth, newHeight, camera, node, i))
  }
  var stage = React.createElement('div', props, renderables)

  DOM.render(stage, el)
}
