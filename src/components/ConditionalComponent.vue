<template>
  <node-view-wrapper class="m-2 rounded-2xl border border-gray-300">
    <div class="flex items-start">
      <p class="bg-blue-500 w-full text-white p-2">Conditional</p>
    </div>
    <div contenteditable="false" class="w-full">
      <div v-for="(condition, index) in state.conditions" :key="index" class="w-full">
        <div v-if="condition.type === 'if'" class="w-full bg-blue-200 min-h-10">
          If
          <span class="bg-green-300 rounded-2xl px-2 py-1">
            {{ condition.first }} {{ condition.operator }} {{ condition.second }}
          </span>
        </div>
        <div v-else-if="condition.type === 'else if'" class="w-full bg-blue-200 min-h-10">
          Else If
          <span class="bg-green-300 rounded-2xl px-2 py-1">
            {{ condition.first }} {{ condition.operator }} {{ condition.second }}
          </span>
        </div>
        <div v-else class="w-full bg-blue-200 min-h-10">
          <div class="bg-red-300 rounded-2xl px-2 py-1">Else</div>
        </div>
        <node-view-content class="min-h-8 p-2" />
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
import { defineProps, computed } from 'vue'

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
  conditions: props.node.attrs.conditions || []
}))
</script>
