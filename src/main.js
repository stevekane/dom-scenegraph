var vec3 = require('gl-vec3')
var SceneGraph = require('./SceneGraph')
var Node = require('./Node')
var Box = require('./Box')
var Sprite = require('./Sprite')
var Camera = require('./Camera')
var Renderer = require('./renderers/ReactRenderer')

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
const root = new Node
const b1 = new Sprite({
  parent: root,
  dimensions: vec3.fromValues(40, 40, 0),
  src: '../assets/scotch.png'
})
const b2 = new Sprite({
  parent: b1,
  dimensions: vec3.fromValues(20, 20, 0),
  src: '../assets/sun.png'
})
const b3 = new Box({
  parent: b2,
  dimensions: vec3.fromValues(100, 20, 0),
  backgroundColor: 'rgba(0,0,0,0)',
  text: 'Lorem ipsum bamf',
  fontSize: 1.5
})
const cam1 = new Camera({
  parent: b1,
  dimensions: vec3.fromValues(640 / 2, 480 / 2, 0)
})
const cam2 = new Camera({
  parent: b2,
  dimensions: vec3.fromValues(640 / 3, 480 / 3, 0)
})
const cam3 = new Camera({
  parent: root,
  dimensions: vec3.fromValues(640 / 4, 480 / 4, 0)
})
const c = new Camera({
  dimensions: vec3.fromValues(640, 480, 0)
})
const cameras = [cam1, cam2, cam3]
const scene = new SceneGraph(root, [b1, b2, b3, cam1, cam2, cam3])
const renderer = new Renderer
var count = 0
var activeCamera = c

function handleKeyDown (e) {
  if      (e.keyCode == KEYS.DOWN)  activeCamera.position[1] += CAM_SPEED
  else if (e.keyCode == KEYS.UP)    activeCamera.position[1] -= CAM_SPEED
  else if (e.keyCode == KEYS.LEFT)  activeCamera.position[0] -= CAM_SPEED
  else if (e.keyCode == KEYS.RIGHT) activeCamera.position[0] += CAM_SPEED
  else if (e.keyCode == KEYS.PLUS)  {
    if (e.ctrlKey) {
      activeCamera.rotation[2] += CAM_ROTATION_SPEED
    }
    else {
      activeCamera.scale[0] -= CAM_ZOOM_SPEED
      activeCamera.scale[1] -= CAM_ZOOM_SPEED
    }
  }
  else if (e.keyCode == KEYS.MINUS) {
    if (e.ctrlKey) {
      activeCamera.rotation[2] -= CAM_ROTATION_SPEED
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
  b1.rotation[2] += Math.PI / 1080
  b2.rotation[2] -= Math.PI / 720
  b2.position[0] = Math.sin(count / 100) * 100
  b3.position[1] = Math.cos(count / 10) * 50
  c.updateMatrices()
  renderer.render(STAGE, activeCamera, scene)
}

render()
