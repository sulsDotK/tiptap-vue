<template>
  <node-view-wrapper>
    <div class="w-full bg-blue-200 min-h-10 flex items-center p-2">
      Else If: &nbsp;
      <span class="bg-green-200 rounded-2xl px-2 py-1 text-green-800 font-bold"
        >{{ state.first }} {{ state.operator }} {{ state.second }}</span
      >
    </div>
    <node-view-content class="min-h-8 p-2" />
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import { computed } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})

const state = computed(() => ({
  first: props.node.attrs.first,
  second: props.node.attrs.second,
  operator: props.node.attrs.operator
}))
</script>
