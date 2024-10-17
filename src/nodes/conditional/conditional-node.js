import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ConditionalComponent from '../../components/conditional/ConditionalComponent.vue'

export default Node.create({
  name: 'conditionalComponent',
  group: 'block',
  content: 'ifCondition elseIfCondition* elseCondition?', // Allows one if, multiple else-if, and optional else
  inline: false,
  selectable: true,
  atom: false,
  parseHTML() {
    return [
      {
        tag: 'conditional-component'
      }
    ]
  },
  renderHTML() {
    return ['conditional-component', 0] // The 0 here means it will render its content
  },
  addNodeView() {
    return VueNodeViewRenderer(ConditionalComponent)
  }
})
