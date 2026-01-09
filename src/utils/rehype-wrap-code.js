import { visit } from 'unist-util-visit';

export default function rehypeWrapCode() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || typeof index !== 'number') {
        return;
      }

      if (node.tagName !== 'pre') {
        return;
      }

      const codeChild = node.children?.find(
        (child) => child.type === 'element' && child.tagName === 'code' && child.properties?.className
      );
      if (codeChild && !node.properties?.className) {
        node.properties = node.properties || {};
        node.properties.className = codeChild.properties.className;
      }

      if (
        parent.type === 'element' &&
        parent.tagName === 'div' &&
        Array.isArray(parent.properties?.className) &&
        parent.properties.className.includes('gatsby-highlight')
      ) {
        return;
      }

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['gatsby-highlight'],
        },
        children: [node],
      };
    });
  };
}
