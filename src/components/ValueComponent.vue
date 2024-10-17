<template>
  <NodeViewWrapper
    data-node-view-wrapper="true"
    class="inline bg-blue-200 text-blue-500 rounded-2xl px-2 py-[2px]"
  >
    <span contenteditable="false" class="">
      <span v-pre>{{</span> {{ props.node.attrs.value }} <span v-pre>}}</span>
    </span>
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
import { defineProps, ref } from 'vue'

// export default {
//   components: {
//     NodeViewWrapper,
//     NodeViewContent
//   },

//   props: nodeViewProps,
//   methods: {
//     increase() {
//       this.updateAttributes({
//         count: this.node.attrs.count + 1
//       })
//     }
//   }
// }
// const props = defineProps < NodeViewProps > {}

const selectedOption = ref('')
const count = ref(0)

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  updateAttributes: {
    type: Function,
    required: true
  }
})

const increaseCount = () => {
  props.updateAttributes({
    count: props.node.attrs.count + 1
  })
}
</script>
