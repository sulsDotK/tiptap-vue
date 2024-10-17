import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ElseIfConditionComponent from '../../components/conditional/ElseIfConditionalComponent.vue'

export default Node.create({
  name: 'elseIfCondition',
  group: 'block',
  content: 'inline*',
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
        tag: 'else-if-condition',
        getAttrs: (dom) => ({
          first: dom.getAttribute('first'),
          second: dom.getAttribute('second'),
          operator: dom.getAttribute('operator')
        })
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['else-if-condition', HTMLAttributes, 0]
  },
  addNodeView() {
    return VueNodeViewRenderer(ElseIfConditionComponent)
  }
})
