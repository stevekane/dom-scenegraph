var test = require('tape')
var mat3 = require('gl-mat3')
var vec2 = require('gl-vec2')
var Node = require('../src/Node')

test('multiply point by localmatrix', function (t) {
  var n = new Node
  var n2 = new Node
  var p = vec2.fromValues(0, 0)
  var pTrans = vec2.create()
  var expected = vec2.fromValues(150, -150)

  n2.setParent(n)
  n.rotation = -Math.PI / 2
  n.scale[0] = 2
  n.position[0] = 100
  n.position[1] = 50
  n2.position[0] = 100
  n2.position[1] = 50
  n.updateMatrices()
  vec2.transformMat3(pTrans, p, n2.worldMatrix)
  t.same(pTrans, expected, 'translating vec2 works as expected')
  t.same(n2.worldPosition, expected, 'world position is correct')
  t.end()  
})
