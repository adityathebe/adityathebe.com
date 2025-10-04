const fs = require('fs');
const path = require('path');
const visit = require('unist-util-visit');

const escapeHtml = (str) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

module.exports = ({ markdownAST, markdownNode, getNode, reporter }, pluginOptions = {}) => {
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
    const rawUrl = node.url || '';
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
    const altText = node.alt ? escapeHtml(node.alt) : '';
    if (altText) {
      attributes.push('role="img"');
      attributes.push(`aria-label="${altText}"`);
    }

    const html = attributes.length
      ? `<${wrapperTag} ${attributes.join(' ')}>${svgContent}</${wrapperTag}>`
      : `<${wrapperTag}>${svgContent}</${wrapperTag}>`;

    parent.children[index] = {
      type: 'html',
      value: html,
    };
  });

  return markdownAST;
};
