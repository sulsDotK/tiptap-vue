<template>
  <node-view-wrapper class="m-2 rounded-2xl border border-gray-300">
    <div class="flex items-start">
      <p class="bg-blue-500 w-full text-white p-2">Conditional Logic</p>
    </div>
    <node-view-content />
    <!-- This will house if, else-if, and else blocks -->
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
</script>
