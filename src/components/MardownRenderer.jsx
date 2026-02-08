import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

const ensureAbsoluteUrls = () => (tree) => {
  visit(tree, 'element', (node) => {
    if (node.tagName === 'a' && node.properties && node.properties.href) {
      const href = node.properties.href;
      if (!href.startsWith('http://') && !href.startsWith('https://')) {
        node.properties.href = 'https://' + href;
      }
    }
  });
};

const MarkdownRenderer = ({ content, additionalClass }) => (
  <MDEditor.Markdown
    source={content}
    style={{ whiteSpace: 'pre-wrap' }}
    className={`bg-transparent ${additionalClass || 'text-black'}`}
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[
      rehypeRaw,
      ensureAbsoluteUrls,
      () => (tree) => {
        visit(tree, 'element', (node) => {
          if (node.tagName === 'a' && node.properties && node.properties.href) {
            node.properties.target = '_blank';
            node.properties.rel = 'noopener noreferrer';
          }
        });
      }
    ]}
  />
);

export default MarkdownRenderer;
