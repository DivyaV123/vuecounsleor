<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
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

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}
const formState = reactive({
  id: props.id,
  agreed_date:"",
  comment: "",
})
const todayDate = () => {
  return dayjs().format("YYYY-MM-DD");
};

const confirm = async () => {
  let valid = true
  let formValues = JSON.parse(JSON.stringify(formState))
  for (const key in formValues) {
    // if (key === "agreed_date" && formValues[key].length === 0) {
    //   valid = false;
    //   theme.pushMessage("Agree date is required!");
    // }
  // if (key === "agreed_date" && formValues[key].length !== null) {
  //     const today = dayjs(new Date());
  //     const ag = dayjs(formValues[key]);
  //     if (ag.isBefore(today)) {
  //       valid = false;
  //       theme.pushMessage("Agreed date should be greater than today!");
  //     }
  //   }
  }
  if (valid) {
    await counselor.addToMe(formState)
    // theme.pushMessage("Successfully added already joined");
    confirmCancel('confirm')
  }
  else {
    theme.pushMessage("Form Error, please fill out mandatory fields")
  }

}

const cancel = () => confirmCancel('cancel')
</script>

<template>
  <overlay v-show="value" @overlay-click="cancel">
    <card-component v-show="value" :title="title" class="shadow-lg w-full max-h-modal md:w-3/5 z-50 overflow-y-scroll"
      :class="{ 'animate-shake': shake }" :header-icon="mdiClose" modal @header-icon-click="cancel">
      <div class="pl-4 space-y-3">
        <card-component>
          <!-- <field class="mt-2 mr-2">
            <control
              :error="formState.agreed_date.length > 0 ? false : true"
              v-model="formState.agreed_date"
              type="date"
              help="Student coming date (When ever student wants to join us)"
              :minDate="todayDate()"
            />
          </field> -->
          <field class="mr-2">
            <control v-model="formState.comment" type="textarea" help="Comments" />
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

<style >
input {
  color-scheme: dark;
}
</style>
