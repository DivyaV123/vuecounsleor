<script setup>
import { computed } from "vue";
import Icon from "@/components/Icon.vue";
import { themeStore } from "../stores/theme";
const theme = themeStore();

defineProps({
  icon: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
});

const darkMode = computed(() => theme.darkMode);
</script>

<template>
  <section class="px-6 sm:px-0 flex items-center justify-between">
    <div class="flex items-center justify-start">
      <icon v-if="icon" :path="icon" class="mr-3" />
      <h1 class="font-semibold">{{ title }}</h1>
    </div>
  </section>
</template>
