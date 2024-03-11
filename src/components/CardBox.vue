<script setup>
import { mdiPlusCircle, mdiChevronUp, mdiChevronDown } from '@mdi/js'
import { themeStore } from '@/stores/theme'
import { computed, ref, useSlots } from 'vue'
import BaseIcon from '@/components/BaseIcon.vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  headerIcon: {
    type: String,
    default: null
  },
  hasTable: Boolean,
  empty: Boolean,
  smallerPadding: Boolean,
  flex: Boolean,
  flexRow: Boolean,
  form: Boolean,
  hoverable: Boolean,
  modal: Boolean,
  hasShadow: Boolean,
  collapsible: Boolean,
  collapsibleHeaderClass: {
    type: String,
    default: 'cursor-pointer'
  },
  collapsedClass: {
    type: String,
    default: 'hidden'
  },
  rounded: {
    type: String,
    default: 'md:rounded-xl'
  }
})

const emit = defineEmits(['header-icon-click', 'submit'])

const mainStore = themeStore()

const slots = useSlots()

const headerFooterBorder = `${mainStore.lightBorderStyle} dark:border-gray-700`

const headerBorder = 'border-b'

const submit = e => {
  emit('submit', e)
}

const is = computed(() => props.form ? 'form' : 'div')

const componentClass = computed(() => {
  const base = [
    props.rounded,
    mainStore.lightBorderStyle,
    props.modal ? 'dark:bg-gray-900' : 'dark:bg-gray-900/70'
  ]

  if (props.flexRow) {
    base.push('flex flex-row')
  } else if (props.flex || footer.value) {
    base.push('flex flex-col')
  } else {
    base.push('block')
  }

  if (props.hasShadow) {
    base.push('shadow-2xl')
  }

  if (props.hoverable) {
    base.push('hover:shadow-lg transition-shadow duration-500')
  }

  return base
})

const header = computed(() => slots.header && !!slots.header())

const footer = computed(() => slots.footer && !!slots.footer())

const collapsed = ref(true)

const computedCollapsed = computed(() => props.collapsible ? collapsed.value : false)

const headerIconClick = e => {
  emit('header-icon-click', e)
}

const headerClick = () => {
  if (props.collapsible) {
    collapsed.value = !collapsed.value
  }
}

const computedHeaderIcon = computed(() => {
  if (props.headerIcon) {
    return props.headerIcon
  }

  if (props.collapsible) {
    return collapsed.value ? mdiChevronDown : mdiChevronUp
  }

  return null
})
</script>

<template>
  <component
    :is="is"
    :class="componentClass"
    class="bg-white border dark:border-gray-900"
    @submit="submit"
  >
    <header
      v-if="header"
      :class="[headerBorder, headerFooterBorder, collapsible ? collapsibleHeaderClass : '', { 'p-4': !hasTable && !smallerPadding, 'py-4 px-2': smallerPadding }]"
      @click.prevent="headerClick"
    >
      <slot
        name="header"
        :collapsed="computedCollapsed"
        :icon="computedHeaderIcon"
      />
    </header>
    <header
      v-else-if="title"
      class="flex items-stretch"
      :class="[headerBorder, headerFooterBorder, { 'cursor-pointer': collapsible }]"
      @click.prevent="headerClick"
    >
      <p
        class="flex items-center py-1 grow font-bold"
        :class="[smallerPadding || icon ? 'px-1' : 'px-2']"
      >
        <BaseIcon
          v-if="icon"
          :path="icon"
          class="mr-1"
        />
        {{ title }}
      </p>
      <a
        v-if="computedHeaderIcon"
        class="flex items-center py-1 px-2 justify-center cursor-pointer"
        @click.prevent="headerIconClick"
      >
        <BaseIcon :path="computedHeaderIcon" />
      </a>
    </header>
    <div
      v-if="empty"
      class="text-center py-24 lg:py-12 text-gray-500 dark:text-gray-400"
    >
      <div class="mb-6">
        No items to show&hellip;
      </div>
      <div>
        <BaseButton
          :icon="mdiPlusCircle"
          label="Add first item"
        />
      </div>
    </div>
    <div
      v-else
      :class="[computedCollapsed ? collapsedClass : null, { 'p-2': !hasTable && !smallerPadding, 'py-4 px-2': smallerPadding, 'flex-1': flex || flexRow || footer }]"
    >
      <slot />
    </div>
    <div
      v-if="footer"
      :class="[headerFooterBorder, computedCollapsed ? collapsedClass : null]"
      class="p-1 border-t items-center justify-center content-center"
    >
      <slot name="footer" />
    </div>
  </component>
</template>
