import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import Component from '../components/ValueComponent.vue'

export default Node.create({
  name: 'value-component',
  group: 'inline',
  inline: true,
  atom: true,
  // content: '*',

  // Define the attributes that the variable node will hold
  addAttributes() {
    return {
      value: {
        default: ''
      }
    }
  },
  parseHTML() {
    return [
      {
        tag: 'value-component'
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['value-component', mergeAttributes(HTMLAttributes, { value: HTMLAttributes.value })]
  },
  addNodeView() {
    return VueNodeViewRenderer(Component)
  }
})
