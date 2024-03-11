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
  course: "",
  institute: "",
  // comment: "",
})
const todayDate = () => {
  return dayjs().format("DD-MMM-YY hh:mm");
};

const confirm = async () => {
  let valid = true
  let formValues = JSON.parse(JSON.stringify(formState))
  for (const key in formValues) {
    if (key === 'course' && (formValues[key].length === 0)) {
      valid = false;
      theme.pushMessage("Course is required");
    }
    if (key === 'institute' && (formValues[key].length === 0)) {
      valid = false;
      theme.pushMessage("Institute is required");
    }
  }
  if (valid) {
    let formSubmit = {
      id : formState.id,
      details: {
        course: formState.course,
        institute: formState.institute
      },
      author: user.author.id,
      author_details: user.author
    }
    let response = await counselor.addJoinedSomewhere(formSubmit)
    // if (response) {
    //   theme.pushMessage(response.message);
    // }
    // theme.pushMessage("Successfully added joined somewhere");
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
            <control v-model="formState.course" help="Course" placeholder="Course" :error="
              formState.course.length > 0
                ? false
                : 'Course is required'
            " />
          </field>
          <field>
            <control v-model="formState.institute" help="Institute" placeholder="Institute" :error="
              formState.institute.length > 0
                ? false
                : 'Institute is required'
            " />
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