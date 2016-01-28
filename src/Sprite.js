var Node = require('./Node')

module.exports = Sprite

function Sprite (props) {
  props = props || {}
  Node.call(this, props)
  this.Type = 'Sprite'
  this.src = props.src || ''
}

Sprite.prototype = Object.create(Node.prototype)
