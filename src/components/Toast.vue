<template>
  <div v-if="visible" class="toast" :class="{ show: shown }">{{ message }}</div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const shown = ref(false)
const message = ref('')

let timer = null

function show(msg, duration = 2000) {
  if (timer) clearTimeout(timer)
  message.value = msg
  visible.value = true
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { shown.value = true })
  })
  timer = setTimeout(() => {
    shown.value = false
    setTimeout(() => { visible.value = false }, 300)
  }, duration)
}

// Global event bus
window.__showToast = show
</script>
