<template>
  <node-view-wrapper class="border border-1 m-2 p-1">
    <div class="flex items-start">
      <p>Conditional</p>
    </div>
    <div contenteditable="false">
      If {{ state.first }} {{ state.operator }}
      {{ state.second }}
    </div>
    <node-view-content class="content border border-red-100" />
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { computed } from 'vue'

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

const state = {
  first: 1,
  second: 2,
  operator: '>'
}
</script>
