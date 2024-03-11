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
import TitleSubBar from "@/components/TitleSubBar.vue";
import { counselorStore } from "../stores/counselor";
import Control from "@/components/Control.vue";
import { themeStore } from "../stores/theme";
import Multiselect from "@vueform/multiselect";
import { selectClasses } from "../selectcss";
import { sessionStore } from "../stores/session";
import dayjs from "dayjs";

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
  company: "",
  salary: "",
  hr: "",
  // comment: "",
})
const todayDate = () => {
  return dayjs().format("DD-MMM-YY hh:mm");
};

const confirm = async () => {
  let valid = true
  let formValues = JSON.parse(JSON.stringify(formState))
  for (const key in formValues) {
    if (key === 'company' && (formValues[key].length === 0)) {
      valid = false;
      theme.pushMessage("Company is required");
    }
    if (key === 'salary' && (formValues[key].length === 0)) {
      valid = false;
      theme.pushMessage("Salary is required");
    }
  }
  if (valid) {
    let formSubmit = {
      id : formState.id,
      details: {
        Company: formState.company,
        salary: formState.salary,
        hr: formState.hr
      },
      author: user.author.id,
      author_details: user.author
    }
    let response = await counselor.addGotJob(formSubmit)
    // theme.pushMessage("Successfully added got job");
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
          <field>
            <control v-model="formState.company" help="Company" placeholder="Company" :error="
              formState.company.length > 0
                ? false
                : 'Company is required'
            " />
          </field>
          <field>
            <control v-model="formState.salary" help="Salary" placeholder="Salary" :error="
              formState.salary.length > 0
                ? false
                : 'Salary is required'
            " />
          </field>
          <field>
            <control v-model="formState.hr" help="HR" placeholder="HR" />
          </field>

          <!-- <field>
            <control v-model="formState.comment" type="textarea" help="Comments" />
          </field> -->
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