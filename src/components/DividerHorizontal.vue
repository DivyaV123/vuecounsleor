<script setup>
import { computed } from 'vue'
import { themeStore } from '@/stores/theme'

const props = defineProps({
  navBar: Boolean
})

const mainStore = themeStore()

const lightBorderStyle = computed(() => mainStore.lightBorderStyle)
</script>

<template>
  <hr
    :class="[lightBorderStyle, props.navBar ? 'hidden lg:block lg:my-0.5 dark:border-gray-700' : 'my-1 -mx-1 dark:border-gray-800']"
    class="border-t"
  >
</template>
