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
  //mat[12] += width / 2
  //mat[13] += height / 2
  var vals = mat.join(',')
  return `matrix3d(${vals})`
}

function BaseProps (width, height, camera, node, key) {
  var xScale = width / camera.dimensions[0]
  var yScale = height / camera.dimensions[1]

	this.key = key
	this.style = {
		position: 'absolute',
    left: (-node.dimensions[0] / 2 * xScale),
    top: (-node.dimensions[1] / 2 * yScale),
		width: node.dimensions[0] * xScale,
		height: node.dimensions[1] * yScale,
		transform: setMat3d(width, height, camera, node)
	}
}


function NodeComponent (width, height, camera, node, key) {
	return React.DOM.div(new BaseProps(width, height, camera, node, key))
}

function BoxComponent (width, height, camera, node, key) {
	var props = new BaseProps(width, height, camera, node, key)

	props.style.backgroundColor = node.backgroundColor
  props.style.color = node.color
  props.style.fontSize = (node.fontSize || 1) + 'em'
	return React.DOM.div(props, node.text || '')
}

function SpriteComponent (width, height, camera, node, key) {
	var props = new BaseProps(width, height, camera, node, key)

	props.style.background = 'url("' + node.src + '")'
	props.style.backgroundSize = '100%'
	props.style.backgroundRepeat = 'no-repeat'
	return React.DOM.div(props)
}

function CameraComponent (width, height, camera, node, key) {
	var props = new BaseProps(width, height, camera, node, key)

  props.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
  props.style.backgroundSize = '10%'
  props.style.backgroundImage = "url('assets/camera.png')"
  props.style.backgroundRepeat = 'no-repeat'
	return React.DOM.div(props)
}

function ReactRenderer () {}

ReactRenderer.prototype.render = function (el, camera, scene) {
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
      fontSize: 16 * newWidth / camera.dimensions[0] + 'px'
    }
  }

  scene.root.updateMatrices()
  mat4.invert(camera.viewMatrix, camera.worldMatrix)

  for (var i = 0, node, Type; node = scene.nodes[i++];) {
    if (node === camera) continue
    if      (node.Type === 'Camera') Type = CameraComponent
    else if (node.Type === 'Box')		 Type = BoxComponent 
    else if (node.Type === 'Sprite') Type = SpriteComponent 
    else                          	 Type = NodeComponent
    renderables.push(new Type(newWidth, newHeight, camera, node, i))
  }
  var stage = React.createElement('div', props, renderables)

  DOM.render(stage, el)
}
