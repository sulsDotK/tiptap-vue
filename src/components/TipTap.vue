<template>
  <div class="container mx-auto max-w-4xl my-8">
    <section
      v-if="editor"
      class="buttons flex items-center flex-wrap gap-x-4 border-t border-l border-r border-gray-400 p-4"
    >
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="[commandBarButtonClass, { [commandBarActiveClass]: editor.isActive('bold') }]"
      >
        Bold
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="[commandBarButtonClass, { [commandBarActiveClass]: editor.isActive('italic') }]"
      >
        Italic
      </button>
      <button
        @click="editor.chain().focus().setHardBreak().run()"
        :disabled="!editor.can().chain().focus().setHardBreak().run()"
        :class="commandBarButtonClass"
      >
        Line break
      </button>
      <button @click="showValuePrompt" :class="commandBarButtonClass">Add value</button>
      <button @click="showConditionalPrompt" :class="commandBarButtonClass">Add condition</button>
    </section>
    <editor-content :editor="editor" />
    <br />
    <div>Final: {{ finalizedHtml }}</div>
    <br /><br />
    <h1 class="text-xl">Rendered Html:</h1>
    <div v-html="finalizedHtml" class="border border-gray-500"></div>
    <br />
    <div>Ref value: {{ state }}</div>
  </div>
  <div>
    <!-- <button
      @click="showConditionalModal = true"
      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      Open Modal
    </button> -->

    <ComparisonModal
      v-if="showConditionalModal"
      :fields="Object.keys(fields)"
      @add="handleAddConditionalLogic"
      @cancel="showConditionalModal = false"
    />
  </div>

  <!-- <div>json Ref value: {{ jsonState }}</div> -->
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { ref, computed } from 'vue'
import ValueComponent from '../nodes/value-node.js'
import ConditionalNode from '../nodes/conditional/conditional-node.js'
import IfNode from '../nodes/conditional/if-condition-node.js'
import ElseIfNode from '../nodes/conditional/else-if-condition-node.js'
import ElseNode from '../nodes/conditional/else-condition-node.js'
import ComparisonModal from './ComparisonModal.vue'

const commandBarButtonClass = 'bg-cyan-600 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded'
const commandBarActiveClass = 'bg-cyan-800 rounded'

const editor = useEditor({
  extensions: [StarterKit, ValueComponent, ConditionalNode, IfNode, ElseIfNode, ElseNode],
  editorProps: {
    attributes: {
      class:
        'border border-gray-400 p-4 min-w-48 max-h-96 min-h-48 overflow-y-auto outline-none max-w-none'
    }
  },
  content: ` <conditional-component><if-condition first="client.intendsWorks" second="delayedSettlement.fee" operator=">"><strong>If condional logic</strong></if-condition><else-if-condition first="client.intendsWorks" second="client.intendsWorks" operator=">"><em>adasadasdasdaadadadad</em><br><value-component value="asd"></value-component></else-if-condition><else-condition>dasdasdasdasdadaad<br></else-condition></conditional-component>`,
  onUpdate: ({ editor }) => {
    // console.log(editor.getHTML())
    // state.value = editor.getHTML()
    jsonState.value = editor.getJSON()
  },
  onContentError: ({ error }) => {
    // The editor content does not match the schema.
    console.log(error)
  }
})

const userInput = ref('')

const state = computed(() => editor.value?.getHTML())
const jsonState = ref()
const showConditionalModal = ref(false)

const fields = {
  'claims.clause711Value': 3,
  'client.intendsWorks': true,
  'delayedSettlement.fee': 45,
  landAddress: null,
  delayedSettlementInterestRate: 5,
  'claims.7.1.1value': 5
  // Other fields...
}

function handleAddConditionalLogic(conditions) {
  console.log('Selected conditions:', conditions)
  showConditionalModal.value = false
  addConditionalLogic(conditions)
}

function addValueComponent() {
  editor.value.commands.insertContent({
    type: 'value-component',
    attrs: { value: userInput.value }
  })
}

function addConditionalLogic(conditions) {
  const content = [
    {
      type: 'ifCondition',
      attrs: {
        first: conditions.if.first,
        second: conditions.if.second,
        operator: conditions.if.operator
      }
    },
    ...conditions.elseIf.map((cond) => ({
      type: 'elseIfCondition',
      attrs: {
        first: cond.first,
        second: cond.second,
        operator: cond.operator
      }
    })),
    conditions.else
      ? {
          type: 'elseCondition',
          content: [
            {
              type: 'text',
              text: conditions.else.content
            }
          ]
        }
      : null
  ].filter(Boolean) // Filter out null values if there's no else block

  console.log(content)

  // Insert the parent conditionalComponent first
  editor.value.commands.insertContent({
    type: 'conditionalComponent',
    content
  })
}

const showValuePrompt = () => {
  const input = prompt('Please enter something:')
  if (input !== null) {
    userInput.value = input
    addValueComponent()
  }
}

const showConditionalPrompt = () => {
  // const input = prompt('Please enter something:')
  // if (input !== null) {
  //   userInput.value = input
  //   addCondition()
  // }
  showConditionalModal.value = true
}

const evaluateCondition = (first, second, operator) => {
  const ops = {
    '>': (a, b) => a > b,
    '>=': (a, b) => a >= b,
    '<': (a, b) => a < b,
    '<=': (a, b) => a <= b,
    '===': (a, b) => a === b,
    '!==': (a, b) => a !== b
  }
  return ops[operator] ? ops[operator](first, second) : false
}

const transformConditionalComponent = (node) => {
  const first = Number(node.getAttribute('first'))
  const second = Number(node.getAttribute('second'))
  const operator = node.getAttribute('operator')

  if (evaluateCondition(first, second, operator)) {
    const div = document.createElement('div')

    // Transform children of the conditional component
    node.childNodes.forEach((child) => {
      const transformedChild = transformNode(child)
      if (transformedChild) {
        div.appendChild(transformedChild) // Append transformed children to the div
      }
    })

    return div
  } else {
    return null // Remove node if condition is false
  }
}

const transformValueComponent = (node) => {
  const key = node.getAttribute('value')
  const span = document.createElement('span')
  span.textContent = fields[key] || '' // Replace with field value

  return span
}

const transformNode = (node) => {
  // Check if the node is an element or a text node
  if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName.toLowerCase() === 'conditional-component') {
      return transformConditionalComponent(node)
    } else if (node.tagName.toLowerCase() === 'value-component') {
      return transformValueComponent(node)
    }
  } else if (node.nodeType === Node.TEXT_NODE) {
    // Handle text nodes by creating a text node
    return document.createTextNode(node.textContent)
  }

  // Recursively transform children for other nodes
  const clone = node.cloneNode(false) // Shallow copy without children
  node.childNodes.forEach((child) => {
    const transformedChild = transformNode(child)
    if (transformedChild) clone.appendChild(transformedChild) // Append only if not null
  })
  return clone
}

const parseAndTransformHTML = (htmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const body = doc.body

  // Transform body
  const transformedBody = transformNode(body)

  // Create a new div with ProseMirror class
  const wrapperDiv = document.createElement('div')
  wrapperDiv.classList.add('ProseMirror')

  // Append the transformed body to the new div
  wrapperDiv.appendChild(transformedBody)

  // Convert transformed DOM back to HTML string
  return wrapperDiv.outerHTML
}

const finalizedHtml = computed(() => {
  return parseAndTransformHTML(state.value)
})
</script>
