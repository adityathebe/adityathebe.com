// @ts-check
const fs = require('fs');
const path = require('path');

/**
 * @typedef {Object} ImageNode
 * @property {string} type
 * @property {string} url
 * @property {string} [alt]
 */

/**
 * @typedef {Object} HtmlNode
 * @property {string} type
 * @property {string} value
 */

const escapeHtml = (str) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

module.exports = async ({ markdownAST, markdownNode, getNode, reporter }, pluginOptions = {}) => {
  const { visit } = await import('unist-util-visit');
  const fileNode = getNode(markdownNode.parent);
  if (!fileNode || !fileNode.absolutePath) {
    reporter && reporter.warn('remark-inline-svg: unable to determine file path for markdown node.');
    return;
  }

  const markdownDir = path.dirname(fileNode.absolutePath);
  const wrapperTag = pluginOptions.wrapperTag || 'span';
  const wrapperClass = pluginOptions.wrapperClass || 'inline-svg';

  visit(markdownAST, 'image', (node, index, parent) => {
    if (!parent) return;
    const imageNode = /** @type {ImageNode} */ (node);
    const rawUrl = imageNode.url || '';
    if (!rawUrl || /^(https?:)?\/\//i.test(rawUrl)) {
      return;
    }
    const [resourcePath] = rawUrl.split(/[#?]/, 1);
    if (!resourcePath || path.extname(resourcePath).toLowerCase() !== '.svg') {
      return;
    }

    const absolutePath = path.isAbsolute(resourcePath)
      ? resourcePath
      : path.resolve(markdownDir, resourcePath);

    if (!fs.existsSync(absolutePath)) {
      reporter && reporter.warn(`remark-inline-svg: could not locate SVG file at ${absolutePath}`);
      return;
    }

    let svgContent = fs.readFileSync(absolutePath, 'utf8');
    svgContent = svgContent
      .replace(/<\?xml[\s\S]*?\?>/gi, '')
      .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
      .trim();

    if (!svgContent.startsWith('<svg')) {
      reporter && reporter.warn(`remark-inline-svg: file ${absolutePath} does not appear to contain an <svg> root element.`);
      return;
    }

    const attributes = [];
    if (wrapperClass) {
      attributes.push(`class="${escapeHtml(wrapperClass)}"`);
    }
    const altText = imageNode.alt ? escapeHtml(imageNode.alt) : '';
    if (altText) {
      attributes.push('role="img"');
      attributes.push(`aria-label="${altText}"`);
    }

    const html = attributes.length
      ? `<${wrapperTag} ${attributes.join(' ')}>${svgContent}</${wrapperTag}>`
      : `<${wrapperTag}>${svgContent}</${wrapperTag}>`;

    /** @type {HtmlNode} */
    const htmlNode = {
      type: 'html',
      value: html,
    };
    parent.children[index] = htmlNode;
  });

  return markdownAST;
};
