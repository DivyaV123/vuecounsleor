<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'
import NavBarItem from '@/components/NavBarItem.vue'
import Icon from '@/components/Icon.vue'

defineProps({
  hasDivider: Boolean,
  hasDropdown: {
    type: Boolean,
    default: true,
  }
})

const isDropdownActive = ref(false)

const toggleDropdownIcon = computed(() => isDropdownActive.value ? mdiChevronUp : mdiChevronDown)

const toggle = () => {
  isDropdownActive.value = !isDropdownActive.value
}

const root = ref(null)

const forceClose = event => {
  if (!root.value.$el.contains(event.target)) {
    isDropdownActive.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', forceClose)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', forceClose)
})
</script>

<template>
  <nav-bar-item
    ref="root"
    type="block"
    :has-divider="hasDivider"
    :active="isDropdownActive"
    dropdown
    class="dropdown"
    @click="toggle"
  >
    <a class="flex items-center lg:py-0 py-2 px-2 lg:px-1 bg-gray-100 dark:bg-gray-800 lg:bg-transparent lg:dark:bg-transparent">
      <slot />
      <icon
        v-if="hasDropdown"
        :path="toggleDropdownIcon"
        class="hidden lg:inline-flex"
      />
    </a>
    <div
      class="text-sm border-gray-100 border-b lg:border-b-0 lg:border-gray-200 lg:border-t lg:bg-white lg:absolute
          lg:top-full lg:left-0 lg:min-w-full lg:w-[151px] lg:z-20 lg:shadow-md lg:rounded-b lg:dark:bg-gray-800
          dark:border-gray-700"
      :class="{'lg:hidden':!isDropdownActive}"
    >
      <slot name="dropdown" />
    </div>
  </nav-bar-item>
</template>
