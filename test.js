'use strict';

const {test} = require('tap');
const rehype = require('rehype');
const unified = require('unified');
const remarkParse = require('remark-parse');
const remarkRehype = require('remark-rehype');
const rehypeStringify = require('rehype-stringify');
const wrapAll = require('.');

const markdown = `
| row |
| --- |

| row |
| --- |
`;

const process = (plugin, options, markdown) => {
  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(plugin, options)
    .use(rehypeStringify)
    .processSync(markdown);
};

test('rehype-wrap-all', t => {
  let vfile;

  t.test('should throw', it => {
    it.throws(
      () => {
        vfile = process(wrapAll, null, markdown);
      },
      /Expected a `string` as selector/,
      ' if no options are given'
    );

    it.throws(
      () => {
        vfile = process(wrapAll, { wrapper: 1 }, markdown);
      },
      /Expected a `string` as wrapper/,
      ' if wrapper is not a string'
    );

    it.throws(
      () => {
        vfile = process(wrapAll, { selector: 1 }, markdown);
      },
      /Expected a `string` as selector/,
      ' if selector is not a string'
    );
    it.end();
  });

  t.test('should not throw', it => {
    it.doesNotThrow(() => {
      vfile = process(wrapAll, { selector: 'table' }, markdown);

      it.ok(vfile.toString().length > 0, 'should process');
      it.ok(
        vfile.toString() ===
        [
          '<div><table>',
          '<thead>',
          '<tr>',
          '<th>row</th>',
          '</tr>',
          '</thead>',
          '<tbody>',
          '</tbody>',
          '</table></div>',
          '<div><table>',
          '<thead>',
          '<tr>',
          '<th>row</th>',
          '</tr>',
          '</thead>',
          '<tbody>',
          '</tbody>',
          '</table></div>',
        ].join('\n'),
        'should wrap tables with a div'
      );

      vfile = unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(markdown)
        .toString();

      const vfileWithBody = rehype()
        .use(wrapAll, { selector: 'table' })
        .processSync(vfile)
        .toString();

      it.ok(
        vfileWithBody ===
        [
          '<html><head></head><body><div><table>',
          '<thead>',
          '<tr>',
          '<th>row</th>',
          '</tr>',
          '</thead>',
          '<tbody>',
          '</tbody>',
          '</table></div>',
          '<div><table>',
          '<thead>',
          '<tr>',
          '<th>row</th>',
          '</tr>',
          '</thead>',
          '<tbody>',
          '</tbody>',
          '</table></div></body></html>'
        ].join('\n'),
        'should wrap tables with a div inside body'
      );

      vfile = process(
        wrapAll,
        {
          selector: 'table',
          wrapper: 'section'
        },
        markdown
      );

      it.ok(
        vfile.toString() ===
        [
          '<section><table>',
          '<thead>',
          '<tr>',
          '<th>row</th>',
          '</tr>',
          '</thead>',
          '<tbody>',
          '</tbody>',
          '</table></section>',
          '<section><table>',
          '<thead>',
          '<tr>',
          '<th>row</th>',
          '</tr>',
          '</thead>',
          '<tbody>',
          '</tbody>',
          '</table></section>',
        ].join('\n'),
        'should wrap tables with a section'
      );

    });
    it.end();
  });
  t.end();
});
