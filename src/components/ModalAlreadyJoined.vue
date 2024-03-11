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
  number: "",
  numberDup: "",
  email: "",
  emailDup: "",
  comment: "",
})
const todayDate = () => {
  return dayjs().format("DD-MMM-YY hh:mm");
};
const validEmail = (email) => {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(mailformat)) {
    return true;
  } else {
    return false;
  }
};

const confirm = async () => {
  let valid = true
  let formValues = JSON.parse(JSON.stringify(formState))
  for (const key in formValues) {
    if (key === 'number') {
      let num = formValues[key].replace(/\s+/g, '')
      if (num.length < 10 || isNaN(num)) {
        valid = false;
        theme.pushMessage("Mobile number with valid number is required!");
      }
    }
    if (key === 'numberDup') {
      let num = formValues[key].replace(/\s+/g, '')
      if (num.length < 10 || isNaN(num)) {
        valid = false;
        theme.pushMessage("Repeat mobile number with valid number is required!");
      }
    }
    if (key === 'email' && !validEmail(formValues[key])) {
      valid = false;
      theme.pushMessage("Email with valid ID is required!");
    }
    if (key === 'emailDup' && !validEmail(formValues[key])) {
      valid = false;
      theme.pushMessage("Repeat Email with valid ID is required!");
    }
  }
  if (formValues['number'] !== formValues['numberDup']) {
    valid = false;
    theme.pushMessage("Mobile numbers are not matching");
  }
  if (formValues['email'] !== formValues['emailDup']) {
    valid = false;
    theme.pushMessage("Emails are not matching");
  }

  if (valid) {
    let formSubmit = {
      id : formState.id,
      details: {
        contact: formState.number,
        email: formState.email,
        comment: formState.comment
      },
      author: user.author.id,
      author_details: user.author
    }
    let response = await counselor.addAlreadyJoined(formSubmit)
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
          <field>
            <control v-model="formState.number" help="Number" placeholder="Number" :error="
              formState.number.replace(/\s+/g, '').length >= 10 && !isNaN(formState.number.replace(/\s+/g, ''))
                ? false
                : 'Mobile(Minimum 10 digits)'
            " />
          </field>
          <field>
            <control autocomplete="off" v-model="formState.numberDup" type="password" help="Repeat number"
              placeholder="Repeat number"  @paste.prevent :error="
                formState.numberDup.replace(/\s+/g, '').length >= 10 && !isNaN(formState.numberDup.replace(/\s+/g, ''))
                  ? false
                  : 'Repeat mobile(Minimum 10 digits)'
              " />
          </field>
          <field>
            <control v-model="formState.email" help="Email" placeholder="Email" :error="formState.email.length > 0 && validEmail(formState.email)
              ? false
              : 'Email'
            " />
          </field>
          <field>
            <control v-model="formState.emailDup" @paste.prevent help="Repeat email" placeholder="Repeat email" :error="formState.emailDup.length > 0 && validEmail(formState.emailDup)
              ? false
              : 'Repeat email'
            " />
          </field>
          <field>
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