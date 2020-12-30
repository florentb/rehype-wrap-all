/*
 * Dependencies
 */
const visit = require('unist-util-visit')
const { selectAll } = require('hast-util-select')
const parseSelector = require('hast-util-parse-selector')

function transform(tree, { selector, wrapper = 'div' }) {
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

/*
 * Attacher
 */
module.exports = (allOptions) => {
  /*
   * Transformer
   */
  return (tree) => {
    if (allOptions == null) {
      throw new TypeError('Expected a `string` or an `array` as options')
    }

    if (Array.isArray(allOptions)) {
      allOptions.forEach(options => {
        transform(tree, options)
      })
    } else {
      transform(tree, allOptions)
    }
  }
}
