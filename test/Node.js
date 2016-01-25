var test = require('tape')
var mat4 = require('gl-mat4')
var vec3 = require('gl-vec3')
var Node = require('../src/Node')

test('multiply point by localmatrix', function (t) {
  var n = new Node
  var n2 = new Node
  var p = vec3.fromValues(0, 0, 0)
  var pTrans = vec3.create()
  var expected = vec3.fromValues(150, -50, 0)

  n2.setParent(n)
  n.rotation = -Math.PI / 2
  n.position[0] = 100
  n.position[1] = 50
  n2.position[0] = 100
  n2.position[1] = 50
  n.updateMatrices()
  vec3.transformMat4(pTrans, p, n2.worldMatrix)
  t.same(pTrans, expected, 'translating vec2 works as expected')
  t.same(n2.worldPosition, expected, 'world position is correct')
  t.end()  
})
