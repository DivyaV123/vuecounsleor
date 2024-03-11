<script setup>
import Icon from '@/components/Icon.vue'

defineProps({
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  desktopIconOnly: Boolean,
  updateMark: {
    type: String,
    default: null
  }
})
</script>

<template>
  <icon
    :path="icon"
    class="transition-colors"
    :update-mark="updateMark"
  />
  <span
    class="px-1 transition-colors text-orange-400"
    :class="{'lg:hidden':desktopIconOnly}"
  >{{ label }}</span>
</template>
<style>
  .router-link-active span{
    color:#fff !important;
  
  }
</style>
