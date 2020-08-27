# rehype-wrap-all

> Wrap matching elements with a given element

## Install

```sh
npm i -S rehype-wrap-all
```

## Usage

```js
const wrap = require('rehype-wrap-all')
const rehype = require('rehype')

rehype()
  .use(wrap, {/* options */})
  .process(/* html string */)
  .then(/* vfile */)
  .catch(/* handle any errors */)
```

## Options

### `wrap.selector`
#### `string`

Select elements to be wrapped. Expects a string selector that can be passed to hast-util-select ([supported selectors](https://github.com/syntax-tree/hast-util-select/blob/master/readme.md#support)).

### `wrap.wrapper`</h3>
#### `string`

Element to wrap around *`wrap.selector`*. Expects a string *`selector`* that can be parsed into html using hast-util-parse-selector ([see readme](https://github.com/syntax-tree/hast-util-parse-selector/blob/master/readme.md))

## Example

```sh
# dependencies

npm i unified to-vfile remark-parse remark-rehype vfile-reporter rehype-document rehype-stringify remark-wrap-all
```

```md
# example.md

table 1

| row | row | row |
| --- | --- | --- |

table 2

| row | row | row |
| --- | --- | --- |
```

```js
/* example.js */

'use strict'

const unified = require('unified')
const toVfile = require('to-vfile')
const remarkParse = require('remark-parse')
const remarkRehype = require('remark-rehype')
const vfileReporter = require('vfile-reporter')
const rehypeDocument = require('rehype-document')
const rehypeStringify = require('rehype-stringify')
const rehypeWrap = require('rehype-wrap-all')

const markdown = toVfile.readSync('./example.md')


unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDocument)
  .use(rehypeWrap, {selector:'table', wrapper: 'div.responsive-table'})
  .use(rehypeStringify)
  .process(markdown, (err, file) => {
    console.error(vfileReporter(err ||file))
    console.log(String(file))
  })
```

```html
<!—- output -—>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <p>table 1</p>
  <div class="responsive-table">
    <table>
      <tr>
        <td>row</td><td>row</td><td>row</td>
      </tr>
    </table>
  </div>
  <p>table 1</p>
  <div class="responsive-table">
    <table>
      <tr>
        <td>row</td><td>row</td><td>row</td>
      </tr>
    </table>
  </div>
</body>
</html>
```

## Acknowledgments

Rehype-wrap-all is an adaptation of Paul Zimmer [rehype-wrap](https://github.com/mrzmmr/rehype-wrap). It depends on a few great packages you should check out. 

- [hast-util-parse-selector](https://github.com/syntax-tree/hast-util-parse-selector) - used to parse a selector into an element. 
- [hast-util-select](https://github.com/syntax-tree/hast-util-select) - used to select an element to wrap. 
- [unist-util-visit](https://github.com/syntax-tree/unist-util-visit) - used to visit elements and their parent element.

## License

MIT &copy; Florent Bourgeois
