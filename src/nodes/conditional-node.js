import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import Component from '../components/ConditionalComponent.vue'

export default Node.create({
  name: 'conditionalComponent',
  group: 'block',
  // content: 'block+',
  content: 'inline*',
  inline: false,
  atom: false,
  addAttributes() {
    return {
      first: {
        default: 0
      },
      second: {
        default: 0
      },
      operator: {
        default: ''
      }
    }
  },
  parseHTML() {
    return [
      {
        tag: 'conditional-component',
        getAttrs: (dom) => ({
          first: dom.getAttribute('first'),
          second: dom.getAttribute('second'),
          operator: dom.getAttribute('operator')
        })
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['conditional-component', mergeAttributes(HTMLAttributes), 0]
  },
  addNodeView() {
    return VueNodeViewRenderer(Component, {
      // Pass the node attributes as props to your Vue component
      props: ({ node }) => ({
        first: node.attrs.first,
        second: node.attrs.second,
        operator: node.attrs.operator
      })
    })
  }
})
