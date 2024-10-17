<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="modal-overlay absolute inset-0 bg-gray-800 opacity-50"></div>
    <div class="bg-white rounded-lg shadow-lg p-6 z-10 w-1/2">
      <h2 class="text-lg font-semibold mb-4">Add Conditional Block</h2>

      <!-- If Block -->
      <div class="flex mb-4 gap-4">
        <span class="w-16">If&nbsp;</span>
        <div class="flex gap-4 w-full">
          <v-select
            v-model="ifCondition.field1"
            :options="fields"
            class="w-1/3"
            placeholder="Select field"
          />
          <v-select
            v-model="ifCondition.operator"
            :options="operators"
            class="w-1/3"
            placeholder="Select operator"
            label="label"
            :reduce="(option) => option.value"
          />
          <v-select
            v-model="ifCondition.field2"
            :options="fields"
            class="w-1/3"
            placeholder="Select field"
          />
        </div>
      </div>

      <!-- Else If Blocks -->
      <div
        v-for="(elseIfCondition, index) in elseIfConditions"
        :key="index"
        class="flex mb-4 gap-4"
      >
        <span class="w-16">Else If&nbsp;</span>
        <div class="flex gap-4 w-full">
          <v-select
            v-model="elseIfCondition.field1"
            :options="fields"
            class="w-1/3"
            placeholder="Select field"
          />
          <v-select
            v-model="elseIfCondition.operator"
            :options="operators"
            class="w-1/3"
            placeholder="Select operator"
            label="label"
            :reduce="(option) => option.value"
          />
          <v-select
            v-model="elseIfCondition.field2"
            :options="fields"
            class="w-1/3"
            placeholder="Select field"
          />
          <button
            @click="removeElseIf(index)"
            class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Remove
          </button>
        </div>
      </div>

      <!-- Add Else If Button -->
      <div class="flex mb-4">
        <button
          @click="addElseIf"
          class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-3 rounded"
        >
          Add Else If
        </button>
      </div>

      <!-- Else Block -->
      <div v-if="hasElseBlock" class="flex mb-4">
        <span class="w-16">Else&nbsp;</span>
        <input
          v-model="elseBlockContent"
          type="text"
          placeholder="Enter else content"
          class="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div class="flex mb-4">
        <button
          v-if="!hasElseBlock"
          @click="addElse"
          class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-3 rounded"
        >
          Add Else
        </button>
        <button
          v-else
          @click="removeElse"
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
        >
          Remove Else
        </button>
      </div>

      <!-- Buttons -->
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
const ifCondition = ref({ field1: null, field2: null, operator: '' })
const elseIfConditions = ref([])
const hasElseBlock = ref(false)
const elseBlockContent = ref('')

// Operators
const operators = ref([
  { label: '=', value: '=' },
  { label: '>', value: '>' },
  { label: '<', value: '<' },
  { label: '>=', value: '>=' },
  { label: '<=', value: '<=' }
])

// Methods
const addElseIf = () => {
  elseIfConditions.value.push({ field1: null, field2: null, operator: '' })
}

const removeElseIf = (index) => {
  elseIfConditions.value.splice(index, 1)
}

const addElse = () => {
  hasElseBlock.value = true
}

const removeElse = () => {
  hasElseBlock.value = false
  elseBlockContent.value = ''
}

const add = () => {
  const conditions = {}

  // Add the 'if' condition
  if (ifCondition.value) {
    conditions.if = {
      first: ifCondition.value.field1,
      second: ifCondition.value.field2,
      operator: ifCondition.value.operator
    }
  }

  conditions.elseIf = []

  // Add 'else if' conditions if any exist
  if (elseIfConditions.value.length > 0) {
    elseIfConditions.value.forEach((cond) => {
      conditions.elseIf.push({
        first: cond.field1,
        second: cond.field2,
        operator: cond.operator
      })
    })
  }

  // Add 'else' condition if it exists
  if (hasElseBlock.value) {
    conditions.else = {
      content: elseBlockContent.value
    }
  }

  emit('add', conditions)
  resetFields()
}

const cancel = () => {
  resetFields()
  emit('cancel')
}

const resetFields = () => {
  ifCondition.value = { field1: null, field2: null, operator: '' }
  elseIfConditions.value = []
  hasElseBlock.value = false
  elseBlockContent.value = ''
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
