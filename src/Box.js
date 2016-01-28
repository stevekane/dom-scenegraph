var Node = require('./Node')

module.exports = Box

function Box (props) {
  props = props || {}
  Node.call(this, props)
  this.Type = 'Box'
  this.text = props.text || ''
  this.backgroundColor = props.backgroundColor || 'white'
  this.color = props.color || 'black'
  this.fontSize = props.fontSize || 1
}

Box.prototype = Object.create(Node.prototype)
