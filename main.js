var React = require('react')
var mat4 = require('gl-mat4')
var DOM = require('react-dom')
var SceneGraph = require('./src/SceneGraph')
var Node = require('./src/Node')
var Camera = require('./src/Camera')
var radToDeg = require('./src/utils').radToDeg

function randFrom (array) {
  return array[Math.floor(Math.random() * array.length)]
}

function setMat3d (camera, node) {
  var m = node.worldMatrix
  var v = camera.viewMatrix
  var mat = mat4.create()

  mat4.multiply(mat, v, m)
  mat[12] += camera.dimensions[0] / 2
  mat[13] += camera.dimensions[1] / 2

  return `matrix3d(${mat.join(',')})`
}

function BoxNode (camera, node, key) {
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

function CameraNode (camera, node, key) {
  var props = {
    key: key,
    style: {
      position: 'absolute',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      backgroundSize: '10%',
      backgroundImage: "url('camera.png')",
      backgroundRepeat: 'no-repeat',
      left: -node.dimensions[0] / 2,
      top: -node.dimensions[1] / 2,
      width: node.dimensions[0],
      height: node.dimensions[1],
      transform: setMat3d(camera, node)
    }
  }

  return React.createElement('div', props)
}

function Scene (camera, scene) {
  var nodes = scene.nodes
  var props = {
    key: 'root',
    style: {
      overflow: 'hidden',
      position: 'absolute',
      backgroundColor: 'gray',
      width: camera.dimensions[0],
      height: camera.dimensions[1] 
    }
  }
  var renderables = []

  for (var i = 0, node, renderable; node = nodes[i++];) {
    if (node === camera) continue
    renderable = node.type === 'camera' 
      ? CameraNode(camera, node, i) 
      : BoxNode(camera, node, i)
    renderables.push(renderable)
  }
  
  return React.createElement('div', props, renderables)
}

const KEYS = {
  DOWN: 40,
  UP: 38,
  LEFT: 37,
  RIGHT: 39,
  PLUS: 187,
  MINUS: 189,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  ESCAPE: 27 
}

const STAGE = document.getElementById('stage')
const CAM_SPEED = 5
const CAM_ZOOM_SPEED = 0.1
const CAM_ROTATION_SPEED = Math.PI / 36
const scene = new SceneGraph
const b1 = new Node
const b2 = new Node
const b3 = new Node
const cam1 = new Camera
const cam2 = new Camera
const cam3 = new Camera
const c = new Camera
const cameras = [cam1, cam2, cam3]
const colors = ['blue', 'red', 'green', 'pink']
var count = 0
var activeCamera = c

scene.add(b1)
scene.add(b2, b1)
scene.add(b3, b2)
scene.add(cam1, b1)
scene.add(cam2, b2)
scene.add(cam3)

cam1.dimensions[0] = 640 / 2
cam1.dimensions[1] = 480 / 2
cam2.dimensions[0] = 640 / 4
cam2.dimensions[1] = 480 / 4
cam3.dimensions[0] = 640 / 3
cam3.dimensions[1] = 480 / 3
b1.dimensions[0] = 40
b1.dimensions[1] = 40
b1.color = randFrom(colors)
b2.color = randFrom(colors)
b3.color = randFrom(colors)
b2.dimensions[0] = 20
b2.dimensions[1] = 20

function handleKeyDown (e) {
  if      (e.keyCode == KEYS.DOWN)  activeCamera.position[1] += CAM_SPEED
  else if (e.keyCode == KEYS.UP)    activeCamera.position[1] -= CAM_SPEED
  else if (e.keyCode == KEYS.LEFT)  activeCamera.position[0] -= CAM_SPEED
  else if (e.keyCode == KEYS.RIGHT) activeCamera.position[0] += CAM_SPEED
  else if (e.keyCode == KEYS.PLUS)  {
    if (e.ctrlKey) {
      activeCamera.rotation += CAM_ROTATION_SPEED
    }
    else {
      activeCamera.scale[0] -= CAM_ZOOM_SPEED
      activeCamera.scale[1] -= CAM_ZOOM_SPEED
    }
  }
  else if (e.keyCode == KEYS.MINUS) {
    if (e.ctrlKey) {
      activeCamera.rotation -= CAM_ROTATION_SPEED
    }
    else {
      activeCamera.scale[0] += CAM_ZOOM_SPEED
      activeCamera.scale[1] += CAM_ZOOM_SPEED
    }
  }
  else if (e.keyCode == KEYS.ONE) {
    activeCamera = cameras[0]
  }
  else if (e.keyCode == KEYS.TWO) {
    activeCamera = cameras[1]
  }
  else if (e.keyCode == KEYS.THREE) {
    activeCamera = cameras[2]
  }
  else if (e.keyCode == KEYS.ESCAPE) {
    activeCamera = c
  }
  else {}
}

document.body.addEventListener('keydown', handleKeyDown)

function render () {
  requestAnimationFrame(render)
  count++
  b1.rotation += Math.PI / 1080
  b2.rotation -= Math.PI / 720
  b2.position[0] = Math.sin(count / 100) * 100
  b3.position[1] = Math.cos(count / 10) * 50
  scene.root.updateMatrices()
  c.updateMatrices()
  DOM.render(Scene(activeCamera, scene), STAGE)
}

window.scene = scene

render()
