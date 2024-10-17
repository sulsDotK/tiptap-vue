<template class="mt-4">
  <node-view-wrapper>
    <div class="w-full bg-blue-200 min-h-10 flex items-center p-2">Else:</div>
    <node-view-content class="min-h-8 p-2" />
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

// const props = defineProps({
//   node: {
//     type: Object,
//     required: true
//   }
// })
</script>
