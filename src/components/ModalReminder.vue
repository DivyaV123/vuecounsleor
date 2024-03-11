<script setup>
import { computed, reactive, ref  } from 'vue'
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
import dayjs from "dayjs";
const counselor = counselorStore();
const theme = themeStore();


const props = defineProps({
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
const formState= reactive({
  title: "",
  description: "",
  number: "",
  reminder_date: "",
})
const todayDate = () => {
  return dayjs().format("DD-MMM-YY hh:mm");
};

const confirm = async() => {
  let valid = true
  let formValues = JSON.parse(JSON.stringify(formState))
  for (const key in formValues) {
    if(key === 'title' && (formValues[key].length === 0)){
      valid = false;
      theme.pushMessage("Title is required");
   } 
   if(key === 'number' && formValues[key].length > 0 ){
     let num = formValues[key].replace(/\s+/g, '')
      if(num.length < 10 || isNaN(num)){
      valid = false;
      theme.pushMessage("Mobile number with valid number is required!");
      }
   } 
    if(key === 'reminder_date' && (formValues[key].length === 0)){
      valid = false;
      theme.pushMessage("Reminder date is required");
   } 
   }
   if(valid){
   let response = await counselor.setReminder(formValues)
    // theme.pushMessage("Successfully added reminder");
   confirmCancel('confirm')
   }
   else{
  theme.pushMessage("Form Error, please fill out mandatory fields")   
   }

}

const cancel = () => confirmCancel('cancel')
</script>

<template>
  <overlay
    v-show="value"
    @overlay-click="cancel"
  >
    <card-component
      v-show="value"
      :title="title"
      class="shadow-lg w-full max-h-modal md:w-3/5 z-50 overflow-y-scroll"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
      <div class="pl-4 space-y-3">
        <card-component>
        <field >
        <control
          v-model="formState.title"
          help="Title"
          placeholder="Title"
          :error="
            formState.title.length > 0 
              ? false
              : 'Title is required'
          "
        />
        </field>
         <field >
         <control
          v-model="formState.number"
          :icon-left="mdiPhone"
          help="Mobile"
          placeholder="Mobile"
        />
        </field>
        <field>
        <control
            :error="
             formState.reminder_date.length > 0 ? false : true
            "
            v-model="formState.reminder_date"
            type="datetime-local"
            help="Reminder date"
            :minDate="todayDate()"
          />
          </field>
            <field>
        <control
            v-model="formState.description"
            type="textarea"
            help="Description"
          />  
      </field>
        </card-component>
      </div>

      <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button
              :label="buttonLabel"
              :color="button"
              @click="confirm"
            />
            <jb-button
              v-if="hasCancel"
              label="Cancel"
              :color="button"
              outline
              @click="cancel"
            />
          </jb-buttons>

          <text-link
            :label="textLinkLabel"
            :icon="textLinkIcon"
          />
        </level>
      </template>
    </card-component>
  </overlay>
</template>