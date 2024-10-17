import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import IfConditionComponent from '../../components/conditional/IfConditionComponent.vue'

export default Node.create({
  name: 'ifCondition',
  group: 'block',
  content: 'inline*', // Makes it contain blocks of editable content
  inline: false,
  atom: false,
  selectable: false, // Cannot select individual ifCondition
  addAttributes() {
    return {
      first: { default: '' },
      second: { default: '' },
      operator: { default: '' }
    }
  },
  parseHTML() {
    return [
      {
        tag: 'if-condition',
        getAttrs: (dom) => ({
          first: dom.getAttribute('first'),
          second: dom.getAttribute('second'),
          operator: dom.getAttribute('operator')
        })
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['if-condition', HTMLAttributes, 0]
  },
  addNodeView() {
    return VueNodeViewRenderer(IfConditionComponent)
  }
})
