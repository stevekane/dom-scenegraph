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
const b1 = new Box({
  parent: root,
  position: vec3.fromValues(0, 0, 0),
  dimensions: vec3.fromValues(150, 150, 0),
  backgroundColor: 'rgba(1,1,255,1)'
})
const b2 = new Box({
  parent: b1,
  dimensions: vec3.fromValues(100, 100, 0),
  //position: vec3.fromValues(175, 0, 0),
  backgroundColor: 'rgba(1,255,1,1)'
})
const b3 = new Box({
  parent: b2,
  dimensions: vec3.fromValues(75, 75, 0),
  //position: vec3.fromValues(150, 0, 0),
  backgroundColor: 'rgba(255,1,1,1)'
})
const stageCamera = new Camera({
  parent: root,
  dimensions: vec3.fromValues(640, 480, 0),
  scale: vec3.fromValues(0.5, 0.5, 1),
  position: vec3.fromValues(0, 0, 0)
})
const viewportCamera = new Camera({
  dimensions: vec3.fromValues(640, 480, 0),
  position: vec3.fromValues(0, 0, 0)
})
const cameras = [stageCamera]
const scene = new SceneGraph(root, [b1, b2, b3, stageCamera])
const renderer = new Renderer
var count = 0
var activeCamera = viewportCamera

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
  else if (e.keyCode == KEYS.ESCAPE) {
    activeCamera = viewportCamera
  }
  else {}
}

document.body.addEventListener('keydown', handleKeyDown)

function render () {
  requestAnimationFrame(render)
  count++
  b1.rotation[2] += Math.PI / 1080
  b2.rotation[2] -= Math.PI / 720
  b3.rotation[2] -= Math.PI / 36
  viewportCamera.updateMatrices()
  renderer.render(STAGE, activeCamera, scene)
}

render()
