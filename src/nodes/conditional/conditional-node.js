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
  addAttributes() {
    return {
      id: { default: '' }
    }
  },
  parseHTML() {
    return [
      {
        tag: 'conditional-component',
        getAttrs: (dom) => ({
          id: dom.getAttribute('id')
        })
      }
    ]
  },
  renderHTML() {
    return ['conditional-component', 0] // The 0 here means it will render its content
  },
  addNodeView() {
    return VueNodeViewRenderer(ConditionalComponent, {
      // This allows the parent (your editor setup) to handle emitted events
      props: ['node', 'getPos', 'editor'],

      // Listen to events emitted from ConditionalComponent.vue
      on: {
        edit: (conditionId) => {
          // Implement the logic you want to trigger when "edit" is emitted
          console.log(`Editing condition with ID: ${conditionId}`)
          // Call your `handleEdit` or any other function here
        }
      }
    })
  }
})
