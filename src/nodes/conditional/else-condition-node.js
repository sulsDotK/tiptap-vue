import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ElseConditionComponent from '../../components/conditional/ElseConditionalComponent.vue'

export default Node.create({
  name: 'elseCondition',
  group: 'block',
  content: 'inline*',
  inline: false,
  atom: false,
  selectable: false, // Cannot select individual ifCondition
  // addAttributes() {
  //   return {
  //     content: { default: '' }
  //   }
  // },
  parseHTML() {
    return [
      {
        tag: 'else-condition'
        // getAttrs: (dom) => ({
        //   content: dom.getAttribute('content')
        // })
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['else-condition', HTMLAttributes, 0]
  },
  addNodeView() {
    return VueNodeViewRenderer(ElseConditionComponent)
  }
})
