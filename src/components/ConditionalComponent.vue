<template>
  <node-view-wrapper class="m-2 rounded-2xl border border-gray-300">
    <div class="flex items-start">
      <p class="bg-blue-500 w-full text-white p-2">Conditional</p>
    </div>
    <div contenteditable="false" class="p-2 bg-blue-200 w-full">
      If
      <span class="bg-green-300 rounded-2xl px-2 py-1"
        >{{ state.first }} {{ state.operator }} {{ state.second }}</span
      >
    </div>
    <node-view-content class="min-h-8 p-2" />
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
import { defineProps, ref, computed } from 'vue'

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

const state = computed(() => ({
  first: props.node.attrs.first,
  second: props.node.attrs.second,
  operator: props.node.attrs.operator
}))
// const state = computed(() => JSON.parse(props.node.attrs.value))

const increaseCount = () => {
  props.updateAttributes({
    count: props.node.attrs.count + 1
  })
}
</script>
