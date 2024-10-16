// conditional-node.js
import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Component from '../components/ConditionalComponent.vue'

export default Node.create({
  name: 'conditionalComponent',
  group: 'block',
  content: 'inline*',
  inline: false,
  atom: false,
  addAttributes() {
    return {
      conditions: {
        default: []
      }
    }
  },
  parseHTML() {
    return [
      {
        tag: 'conditional-component',
        getAttrs: (dom) => ({
          conditions: JSON.parse(dom.getAttribute('conditions'))
        })
      }
    ]
  },
  // ensure that when Tiptap serializes your node back to HTML, it uses JSON.stringify to correctly serialize the conditions object as a string.
  renderHTML({ HTMLAttributes }) {
    // Use JSON.stringify to serialize the conditions object/array
    return [
      'conditional-component',
      mergeAttributes({
        ...HTMLAttributes,
        conditions: JSON.stringify(HTMLAttributes.conditions)
      }),
      0
    ]
  },
  addNodeView() {
    return VueNodeViewRenderer(Component, {
      props: ({ node }) => ({
        conditions: node.attrs.conditions
      })
    })
  }
})
