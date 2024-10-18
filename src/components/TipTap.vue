<template>
  <div class="flex">
    <div class="w-1/5">
      Fields: <br />
      <pre>{{ JSON.stringify(fields, null, 2) }}</pre>
    </div>
    <div class="mx-auto max-w-4xl my-8">
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
      <div v-html="finalizedHtml" class="border border-gray-500 min-h-4"></div>
      <br />
      <div>Ref value: {{ state }}</div>
    </div>
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
      :existingCondition="selectedCondition"
      @save="handleSaveConditionalLogic"
      @cancel="showConditionalModal = false"
    />
  </div>

  <!-- <div>json Ref value: {{ jsonState }}</div> -->
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ValueComponent from '../nodes/value-node.js'
import ConditionalNode from '../nodes/conditional/conditional-node.js'
import IfNode from '../nodes/conditional/if-condition-node.js'
import ElseIfNode from '../nodes/conditional/else-if-condition-node.js'
import ElseNode from '../nodes/conditional/else-condition-node.js'
import ComparisonModal from './ComparisonModal.vue'
import { v4 as uuidv4 } from 'uuid'
import ConditionalComponent from './conditional/ConditionalComponent.vue'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

const commandBarButtonClass = 'bg-cyan-600 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded'
const commandBarActiveClass = 'bg-cyan-800 rounded'

const editor = useEditor({
  extensions: [
    StarterKit,
    ValueComponent,
    ConditionalNode.extend({
      addNodeView() {
        return VueNodeViewRenderer(ConditionalComponent, {
          props: {
            // Pass down any additional props if needed
          },
          // Listen to emitted events from the component
          on: {
            edit: () => {
              console.log('Edit event emitted')
            } // Handle the 'edit' event
          }
        })
      }
    }),
    IfNode,
    ElseIfNode,
    ElseNode
  ],
  editorProps: {
    attributes: {
      class:
        'border border-gray-400 p-4 min-w-48 max-h-96 min-h-48 overflow-y-auto outline-none max-w-none'
    }
  },
  // content: ` <conditional-component><if-condition first="client.intendsWorks" second="delayedSettlement.fee" operator=">"><strong>If condional logic</strong></if-condition><else-if-condition first="client.intendsWorks" second="client.intendsWorks" operator=">"><em>adasadasdasdaadadadad</em><br><value-component value="asd"></value-component></else-if-condition><else-condition>dasdasdasdasdadaad<br></else-condition></conditional-component>`,
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
const selectedCondition = ref(null)

const fields = {
  'claims.clause711Value': 3,
  'client.intendsWorks': true,
  'delayedSettlement.fee': 45,
  landAddress: null,
  delayedSettlementInterestRate: 5,
  'claims.7.1.1value': 5
  // Other fields...
}

onMounted(() => {
  editor.value.on('transaction', ({ editor }) => {
    // Listen to custom events from node views
    editor.view.dom.addEventListener('edit', (event) => {
      debugger
      handleEdit(event.detail)
    })
  })
})

onBeforeUnmount(() => {
  editor.value.destroy()
})

const setSelectedCondition = (id) => {
  const html = editor.getHtml()
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const conditionalComponent = doc.querySelector(`conditional-component[id="${id}"]`)
  if (conditionalComponent) {
    const ifCondition = conditionalComponent.querySelector('if-condition')
    const elseIfConditions = conditionalComponent.querySelectorAll('else-if-condition')
    const elseCondition = conditionalComponent.querySelector('else-condition')

    selectedCondition.value = {
      id,
      ifCondition: {
        first: ifCondition.getAttribute('first'),
        second: ifCondition.getAttribute('second'),
        operator: ifCondition.getAttribute('operator'),
        content: ifCondition.innerHTML
      },
      elseIfConditions: Array.from(elseIfConditions).map((elseIf) => ({
        first: elseIf.getAttribute('first'),
        second: elseIf.getAttribute('second'),
        operator: elseIf.getAttribute('operator'),
        content: elseIf.innerHTML
      })),
      elseCondition: elseCondition ? elseCondition.innerHTML : null
    }
  }
}

const updateConditionalComponent = (condition) => {
  const html = editor.value.getHtml()
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const conditionalComponent = doc.querySelector(`conditional-component[id="${condition.id}"]`)

  if (conditionalComponent) {
    // Update if-condition
    const ifCondition = conditionalComponent.querySelector('if-condition')
    ifCondition.setAttribute('first', condition.ifCondition.first)
    ifCondition.setAttribute('second', condition.ifCondition.second)
    ifCondition.setAttribute('operator', condition.ifCondition.operator)
    ifCondition.innerHTML = condition.ifCondition.content

    // Remove existing else-if conditions
    const existingElseIfConditions = conditionalComponent.querySelectorAll('else-if-condition')
    existingElseIfConditions.forEach((elseIf) => elseIf.remove())

    // Add new else-if conditions
    condition.elseIfConditions.forEach((elseIf) => {
      const newElseIf = doc.createElement('else-if-condition')
      newElseIf.setAttribute('first', elseIf.first)
      newElseIf.setAttribute('second', elseIf.second)
      newElseIf.setAttribute('operator', elseIf.operator)
      newElseIf.innerHTML = elseIf.content
      conditionalComponent.appendChild(newElseIf)
    })

    // Update else-condition
    let elseCondition = conditionalComponent.querySelector('else-condition')
    if (condition.elseCondition) {
      if (!elseCondition) {
        elseCondition = doc.createElement('else-condition')
        conditionalComponent.appendChild(elseCondition)
      }
      elseCondition.innerHTML = condition.elseCondition
    } else if (elseCondition) {
      elseCondition.remove()
    }

    editor.value.commands.setContent(doc.body.innerHTML)
  }
}

const handleSaveConditionalLogic = (condition) => {
  if (condition.id) {
    updateConditionalComponent(condition)
  } else {
    addConditionalComponent(condition)
  }
  selectedCondition.value = null
  showConditionalModal.value = false
}

function addValueComponent() {
  editor.value.commands.insertContent({
    type: 'value-component',
    attrs: { value: userInput.value }
  })
}

const showConditionalPrompt = () => {
  showConditionalModal.value = true
}

function openEditModal(id) {
  setSelectedCondition(id)
  showConditionalPrompt()
}

function addConditionalComponent(condition) {
  const id = uuidv4()
  const content = [
    {
      type: 'ifCondition',
      attrs: {
        first: condition.if.first,
        second: condition.if.second,
        operator: condition.if.operator
      }
    },
    ...condition.elseIf.map((cond) => ({
      type: 'elseIfCondition',
      attrs: {
        first: cond.first,
        second: cond.second,
        operator: cond.operator
      }
    })),
    condition.else
      ? {
          type: 'elseCondition',
          content: [
            {
              type: 'text',
              text: condition.else.content
            }
          ]
        }
      : null
  ].filter(Boolean) // Filter out null values if there's no else block

  console.log(content)

  // Insert the parent conditionalComponent first
  editor.value.commands.insertContent({
    type: 'conditionalComponent',
    attrs: { id, onEdit: (id) => openEditModal(id) },
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

const transformIfComponent = (node) => {
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

const transformElseIfComponent = (node) => {
  return transformIfComponent(node) // Same logic for else-if
}

const transformElseComponent = (node) => {
  const div = document.createElement('div')

  // Always render content for else
  node.childNodes.forEach((child) => {
    const transformedChild = transformNode(child)
    if (transformedChild) {
      div.appendChild(transformedChild)
    }
  })

  return div
}

const transformConditionalComponent = (node) => {
  let hasRendered = false // Track if any condition is satisfied
  const div = document.createElement('div')

  node.childNodes.forEach((child) => {
    if (hasRendered) return // Skip after first condition is satisfied

    if (child.tagName.toLowerCase() === 'if-condition') {
      const transformedChild = transformIfComponent(child)
      if (transformedChild) {
        div.appendChild(transformedChild)
        hasRendered = true
      }
    } else if (child.tagName.toLowerCase() === 'else-if-condition') {
      const transformedChild = transformElseIfComponent(child)
      if (transformedChild) {
        div.appendChild(transformedChild)
        hasRendered = true
      }
    } else if (child.tagName.toLowerCase() === 'else-condition') {
      const transformedChild = transformElseComponent(child)
      if (transformedChild) {
        div.appendChild(transformedChild)
      }
    }
  })

  return div
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
    const tagName = node.tagName.toLowerCase()

    if (tagName === 'conditional-component') {
      return transformConditionalComponent(node)
    } else if (tagName === 'if-condition') {
      return transformIfComponent(node)
    } else if (tagName === 'else-if-condition') {
      return transformElseIfComponent(node)
    } else if (tagName === 'else-condition') {
      return transformElseComponent(node)
    } else if (tagName === 'value-component') {
      return transformValueComponent(node)
    }
  } else if (node.nodeType === Node.TEXT_NODE) {
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
