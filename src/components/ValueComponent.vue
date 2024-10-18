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
import { NodeViewWrapper } from '@tiptap/vue-3'

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
</script>
