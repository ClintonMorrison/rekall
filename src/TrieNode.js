'use strict'

import util from './util'

class TrieNode {
  constructor (parent, labels) {
    this.childrenByLeadingChar = {}
    this.edgesByLeadingChar = {}
    this.labels = labels || {}
    this.parent = parent
  }

  _getChild (query) {
    const firstChar = util.getFirstElement(query)
    return this.childrenByLeadingChar[firstChar]
  }

  _getEdge (query) {
    const firstChar = util.getFirstElement(query)
    return this.edgesByLeadingChar[firstChar]
  }

  _matchUntilMismatch (pattern) {
    // Empty string matches anything
    if (!pattern) {
      return {
        lastNode: this,
        remainingPattern: ''
      }
    }

    // Check if first character matches leading character of any edge
    const edge = this._getEdge(pattern[0])
    if (!this._getChild(pattern[0])) {
      return {
        lastNode: this,
        remainingPattern: pattern
      }
    }

    // Check if whole edge matches patterns
    if (!util.startsWith(pattern, edge)) {
      return {
        lastNode: this,
        remainingPattern: pattern
      }
    }

    // Strip matched character and keep matching rest of pattern
    const remainingPattern = pattern.substring(edge.length)
    const child = this._getChild(pattern[0])

    return child._matchUntilMismatch(remainingPattern)
  }

  match (pattern) {
    const result = this._matchUntilMismatch(pattern)
    if (result.remainingPattern.length === 0) {
      return result.lastNode
    }

    if (result.lastNode.hasEdgeWithPrefix(result.remainingPattern)) {
      return result.lastNode._getChild(result.remainingPattern[0])
    }

    return null
  }

  leaves () {
    if (this.isLeaf()) {
      return [ this ]
    }

    let leaves = []
    for (const child of this.getChildren()) {
      leaves = child.leaves().concat(leaves)
    }

    return leaves
  }

  siblings () {
    if (!this.parent) {
      return []
    }

    this.parent.getChildren().map((node) => {
      return (node !== this)
    })
  }

  getChildren () {
    const children = []

    util.each(this.childrenByLeadingChar, (child) => {
      children.push(child)
    })

    return children
  }

  hasEdgeWithPrefix (prefix) {
    if (prefix.length === 0) {
      return false
    }

    if (!this._getEdge(prefix[0])) {
      return false
    }

    return util.startsWith(this._getEdge(prefix[0]), prefix)
  }

  _connectByEdge (childToConnect, edge) {
    if (!edge) {
      throw new Error('Cannot connect by empty edge')
    }

    const leadingChar = edge[0]

    if (this._getEdge(leadingChar)) {
      throw new Error('An edge with the leading character already exists')
    }

    this.childrenByLeadingChar[leadingChar] = childToConnect
    this.edgesByLeadingChar[leadingChar] = edge
    childToConnect.parent = this

    return childToConnect
  }

  add (str, labelsForLeaf) {
    const result = this._matchUntilMismatch(str)
    let node = result.lastNode
    if (result.remainingPattern.length > 0) {
      node = node._addChild(result.remainingPattern)
    }

    util.each(labelsForLeaf, (label) => {
      node.labels[label] = label
    })
  }

  _addChild (pattern) {
    const leadingChar = pattern[0]
    const existingEdge = this._getEdge(leadingChar) || ''

    // Split the edge into the prefix and the rest
    const prefixLength = util.getLengthOfCommonPrefix(existingEdge, pattern)
    const prefix = existingEdge.slice(0, prefixLength)
    const edgeRemainder = existingEdge.slice(prefixLength)
    const patternRemainder = pattern.slice(prefixLength)

    if (prefix && !edgeRemainder) {
      throw new Error('tried to add child where edge already had prefix')
    }

    if (prefix) {
      // Disconnect the child on the edge
      const oldChild = this._getChild(leadingChar)
      delete this.edgesByLeadingChar[leadingChar]
      delete this.childrenByLeadingChar[leadingChar]

      // Connect a new node by the prefix
      const newChild = this._connectByEdge(new TrieNode(), prefix)

      // Reconnect old node with the remainder
      newChild._connectByEdge(oldChild, edgeRemainder)

      // Add rest of path if some of the pattern is still unmatched
      if (patternRemainder) {
        return newChild._addChild(patternRemainder)
      }

      newChild.parent = this

      return newChild
    }

    // If no shared prefix, connect the new node with a new edge
    if (patternRemainder) {
      return this._connectByEdge(new TrieNode(), patternRemainder)
    }

    // Return current node if no pattern left
    return this
  }

  // Deletes this node from the tree and re-arranges
  // ancestors as needed to keep the trie compact
  removeAndPrune () {
    // TODO: add this methods
    const parent = this.getParent()

    const parentChildren = parent.getChildren()

    if (parentChildren.length <= 2) {
      parent.disconnectChild(this)
    }

    parent.compactIfPossible()
  }

  isLeaf () {
    for (const c in this.childrenByLeadingChar) {
      return false
    }

    return true
  }

  depth () {
    let depth = 0
    let maxDepth = 0

    if (this.isLeaf()) {
      return 0
    }

    util.each(this.getChildren(), (child) => {
      depth = 1 + child.depth()
      maxDepth = Math.max(depth, maxDepth)
    })

    return maxDepth
  }

  // Returns the number of nodes in the trie (counting root)
  size () {
    let total = 1

    if (this.isLeaf()) {
      return total
    }

    util.each(this.getChildren(), (child) => {
      total += child.size()
    })

    return total
  }

  prettyPrint (padding) {
    if (!padding) {
      padding = ''
    }

    const lines = ['']
    let isLastChild = false
    let index = 0

    for (const c in this.edgesByLeadingChar) {
      isLastChild = (index === (Object.keys(this.childrenByLeadingChar).length - 1))
      const arrow = isLastChild ? '└' : '├'
      let childPrefix = `${padding}${isLastChild ? ' ' : '|'}  `
      const child = this._getChild(c)
      const edge = this._getEdge(c)
      const labels = child.getLabels()
      const labelsText = labels.length > 0 ? ` [${labels.join(', ')}]` : ''
      const prettyPrintedChild = child.prettyPrint(childPrefix)
      lines.push(`${padding}${arrow}─ ${edge} ${labelsText}${prettyPrintedChild}`)
      index += 1
    }
    return lines.join('\n')
  }

  getLabels () {
    return this.constructor.getUniqueLabels([this])
  }

  hasLabel (label) {
    return !!(this.labels[label])
  }

  getParent () {
    return this.parent
  }

  // Gets the edge which connects this node to it's parent
  getParentEdge () {
    const parent = this.getParent()
    if (!parent) {
      return null
    }

    for (const char in parent.edgesByLeadingChar) {
      if (parent._getChild(char) === this) {
        return parent.edgesByLeadingChar[char]
      }
    }

    return null
  }

  // If this node has a lone child, collapse it into self to
  // keep trie compact
  compactIfPossible () {
    const children = this.getChildren()
    const parent = this.getParent()

    if (!parent) {
      return false
    }

    if (children.length !== 1) {
      return false
    }

    const loneChild = children[0]
    const loneChildEdge = loneChild.getParentEdge()
    this.disconnectChild(loneChild)

    // Append lone child edge to parent
    const parentEdge = this.getParentEdge()
    parent.edgesByLeadingChar[parentEdge[0]] = `${parentEdge}${loneChildEdge}`

    // Absorb lone child's children
    this.childrenByLeadingChar = loneChild.childrenByLeadingChar
    this.edgesByLeadingChar = loneChild.edgesByLeadingChar

    // Update children parent pointers
    for (const child in this.getChildren()) {
      child.parent = this
    }

    return true
  }

  disconnectChild (child) {
    const edge = child.getParentEdge()

    if (!edge) {
      throw new Error('child is not connected to parent')
    }

    delete this.childrenByLeadingChar[edge[0]]
    delete this.edgesByLeadingChar[edge[0]]
    child.parent = null
  }

  static getUniqueLabels (nodes) {
    const labels = {}

    util.each(nodes, (node) => {
      util.each(node.labels, (value, label) => {
        labels[label] = value
      })
    })

    return Object.values(labels)
  }
}

module.exports = TrieNode
