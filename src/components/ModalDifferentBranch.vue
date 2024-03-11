<script setup>
import { computed, reactive, ref, onBeforeMount } from 'vue'
import { mdiClose, mdiPlusBox, mdiMinusBox, mdiPhone } from '@mdi/js'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import CardComponent from '@/components/CardComponent.vue'
import Level from '@/components/Level.vue'
import TextLink from '@/components/TextLink.vue'
import Overlay from '@/components/Overlay.vue'
import Field from "@/components/Field.vue";
import { counselorStore } from "../stores/counselor";
import Control from "@/components/Control.vue";
import { themeStore } from "../stores/theme";
import dayjs from "dayjs";
import { sessionStore } from "../stores/session";
import Multiselect from "@vueform/multiselect";
import { selectClasses } from "../selectcss";

const counselor = counselorStore();
const theme = themeStore();
const user = sessionStore();

const props = defineProps({
  id: {
    type: Number,
  },
  title: {
    type: String,
    default: null
  },
  button: {
    type: String,
    default: 'info'
  },
  buttonLabel: {
    type: String,
    default: 'Add'
  },
  shake: Boolean,
  hasCancel: Boolean,
  textLinkLabel: {
    type: String,
    default: null
  },
  textLinkIcon: {
    type: String,
    default: null
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const obs = computed(() => {
  return counselor.otherBranch.items;
});

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}
const formState = reactive({
  id: props.id,
  branch:null
})
const todayDate = () => {
  return dayjs().format("DD-MMM-YY hh:mm");
};

const confirm = async () => {
  let valid = true
  let formValues = JSON.parse(JSON.stringify(formState))
  for (const key in formValues) {
    if (key === "branch" && formValues[key] === null) {
      valid = false;
      theme.pushMessage("Branch is required!");
    }
  }
  if (valid) {
    await counselor.moveBranch(formState)
    // theme.pushMessage("Successfully moved to different branch");
    confirmCancel('confirm')
  }
  else {
    theme.pushMessage("Form Error, please fill out mandatory fields")
  }

}

const cancel = () => confirmCancel('cancel')
onBeforeMount(async () => {
  await counselor.getOtherBranch();
});
</script>

<template>
  <overlay v-show="value" @overlay-click="cancel">
    <card-component v-show="value" :title="title" class="shadow-lg w-full max-h-modal md:w-3/5 z-50 overflow-y-scroll"
      :class="{ 'animate-shake': shake }" :header-icon="mdiClose" modal @header-icon-click="cancel">
      <div class="pl-4 space-y-3 mt-2 mb-2">
        <card-component>
          <field
           grouped
          help="Search branch"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 mr-2"
        >
        <!-- :error="educ.college_object!=null ? false : true" -->
        <Multiselect
            v-model="formState.branch"
            :options="obs"
            valueProp="id"
            :object="true"
            label="name"
            class="border-gray-400"
            searchable
            trackBy="name"
            :classes="selectClasses"
          />
        </field>
        </card-component>
      </div>

      <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button :label="buttonLabel" :color="button" @click="confirm" />
            <jb-button v-if="hasCancel" label="Cancel" :color="button" outline @click="cancel" />
          </jb-buttons>

          <text-link :label="textLinkLabel" :icon="textLinkIcon" />
        </level>
      </template>
    </card-component>
  </overlay>
</template>