import fs from 'node:fs';
import path from 'node:path';
import { visit } from 'unist-util-visit';

const escapeHtml = (str) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export default function remarkInlineSvg(options = {}) {
  const { wrapperTag = 'span', wrapperClass = 'inline-svg' } = options;

  return (tree, file) => {
    const filePath = file?.path || file?.history?.[0];
    if (!filePath) {
      return;
    }

    const markdownDir = path.dirname(filePath);

    visit(tree, 'image', (node, index, parent) => {
      if (!parent || typeof index !== 'number') {
        return;
      }

      const rawUrl = node.url || '';
      if (!rawUrl || /^(https?:)?\/\//i.test(rawUrl)) {
        return;
      }

      const [resourcePath] = rawUrl.split(/[#?]/, 1);
      if (!resourcePath || path.extname(resourcePath).toLowerCase() !== '.svg') {
        return;
      }

      const absolutePath = path.isAbsolute(resourcePath) ? resourcePath : path.resolve(markdownDir, resourcePath);

      if (!fs.existsSync(absolutePath)) {
        return;
      }

      let svgContent = fs.readFileSync(absolutePath, 'utf8');
      svgContent = svgContent
        .replace(/<\?xml[\s\S]*?\?>/gi, '')
        .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
        .trim();

      if (!svgContent.startsWith('<svg')) {
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
  };
}
