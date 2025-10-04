const fs = require('fs');
const path = require('path');

module.exports = async ({ markdownAST, markdownNode }) => {
  // Dynamic import for ES module
  const { visit } = await import('unist-util-visit');
  
  // Visit all image nodes in the markdown AST
  visit(markdownAST, 'image', (node, index, parent) => {
    const { url, alt } = node;
    
    // Check if the image has an .svg extension
    if (url && url.endsWith('.svg')) {
      try {
        // Construct the full path to the SVG file
        // The SVG file should be in the same directory as the markdown file
        const markdownDir = path.dirname(markdownNode.fileAbsolutePath);
        const svgPath = path.resolve(markdownDir, url);
        
        // Check if the SVG file exists
        if (fs.existsSync(svgPath)) {
          // Read the SVG content
          const svgContent = fs.readFileSync(svgPath, 'utf8');
          
          // Create a new HTML node with the inline SVG
          const htmlNode = {
            type: 'html',
            value: svgContent
          };
          
          // Replace the image node with the HTML node
          parent.children[index] = htmlNode;
        }
      } catch (error) {
        console.warn(`Failed to inline SVG: ${url}`, error);
        // Keep the original image node if there's an error
      }
    }
  });

  return markdownAST;
};