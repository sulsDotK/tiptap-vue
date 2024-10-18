<template>
  <node-view-wrapper class="m-2 rounded-2xl border border-gray-300">
    <div class="flex justify-between bg-blue-500 text-white px-2">
      <p class="w-full p-2">Conditional Logic</p>
      <button @click="editConditionalLogic">Edit</button>
    </div>
    <node-view-content />
    <!-- This will house if, else-if, and else blocks -->
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import { defineProps, defineEmits } from 'vue'
</script>
