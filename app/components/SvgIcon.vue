<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" class="svg-icon">
    <path :d="path" fill="currentColor" />
  </svg>
</template>

<script setup>
defineProps({
  path: { type: String, required: true },
  size: { type: Number, default: 24 }
})
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
