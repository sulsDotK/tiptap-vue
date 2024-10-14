<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="modal-overlay absolute inset-0 bg-gray-800 opacity-50"></div>
    <div class="bg-white rounded-lg shadow-lg p-6 z-10 w-1/3">
      <h2 class="text-lg font-semibold mb-4">Add Conditional Block</h2>
      <div class="flex flex-col">
        <div class="flex mb-4 gap-4">
          <span>If &nbsp;</span>
          <!-- <label class="text-sm font-medium text-gray-700">Field 1:</label> -->
          <v-select v-model="field1" :options="fields" class="w-48" placeholder="Select" />
          <select v-model="operator" class="border border-gray-300 rounded-md w-32">
            <option value="">Select an operator</option>
            <option value="=">=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value=">=">&ge;</option>
            <option value="<=">&le;</option>
          </select>
          <v-select v-model="field2" :options="fields" class="w-48" placeholder="Select a field" />
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Field 2:</label>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Operator:</label>
      </div>
      <div class="flex justify-end">
        <button
          @click="cancel"
          class="mr-2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          @click="add"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

// Vue.component('v-select', vSelect)

// Props
defineProps({
  fields: {
    type: Array,
    required: true
  }
})

// Emits
const emit = defineEmits(['add', 'cancel'])

// State
const field1 = ref(null)
const field2 = ref(null)
const operator = ref('')

// Methods
const add = () => {
  emit('add', { first: field1.value, second: field2.value, operator: operator.value })
  resetFields()
}

const cancel = () => {
  resetFields()
  emit('cancel')
}

const resetFields = () => {
  field1.value = null
  field2.value = null
  operator.value = ''
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
