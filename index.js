/*
 * Dependencies
 */
const visit = require('unist-util-visit')
const { selectAll } = require('hast-util-select')
const parseSelector = require('hast-util-parse-selector')

/*
 * Attacher
 */
module.exports = (options) => {
  options = options || {}
  const selector = options.selector
  const wrapper = options.wrapper || 'div'

  /*
   * Transformer
   */
  return (tree) => {
    if (typeof wrapper !== 'string') {
      throw new TypeError('Expected a `string` as wrapper')
    }

    if (typeof selector !== 'string') {
      throw new TypeError('Expected a `string` as selector')
    }

    for (const match of selectAll(selector, tree)) {
      visit(tree, match, (node, i, parent) => {
        const wrap = parseSelector(wrapper)
        wrap.children = [node]
        parent.children[i] = wrap
      })
    }
  }
}
