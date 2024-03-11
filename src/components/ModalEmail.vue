<script setup>
import { computed, reactive, ref  } from 'vue'
import { mdiClose, mdiPlusBox, mdiMinusBox, mdiMail } from '@mdi/js'
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
import validator from "email-validator"
import { themeStore } from "../stores/theme"
const counselor = counselorStore();
const theme = themeStore();


const props = defineProps({
  title: {
    type: String,
    default: null
  },
  id: {
    type: Number,
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
const email = ref([{ email: "" }]);

const addEmail = () => {
  email.value.push({ email: "" });
};
const removeEmail = () => {
  email.value.pop();
};


const formState= reactive({
  id:props.id,
  email: email,

})

const validEmail = (email) => {
// var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
if(/\s/g.test(email)||email){
  if(validator.validate(email)===true){
    return true
  }
  }
  else{
    return false
  }
}

const confirm = async() => {
  formState.email = email
  let valid = true
  let formValues = JSON.parse(JSON.stringify(formState))
  for (const key in formValues) {
    if(key === 'email'){
      formValues[key].forEach(element => {
      //  if(!validEmail(element.email)){
        if (/\s/g.test(element.email)||(validator.validate(element.email)===false)) {
         valid= false
         theme.pushMessage("Email with valid ID is required!")
       }
     });
   }  
   }
   var valueArr = formValues.email.map(function(item){ return item.email.replace(/\s+/g, "") });
   var isDuplicate = valueArr.some(function(item, idx){ 
    if(item){
      return valueArr.indexOf(item) != idx 
    }
      });
      if(isDuplicate==true){
        valid= false
        theme.pushMessage("Email is Already exists!")
    }
   if(valid){
   let response = await counselor.submitEmail(formValues)
   confirmCancel('confirm')
   }
   else{
  // theme.pushMessage("Form Error, please fill out mandatory fields")   
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
      class="shadow-lg w-full max-h-modal md:w-5/6 lg:w-3/4 xl:w-3/5 z-50 overflow-y-scroll h-52"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
      <div class="pl-4 space-y-3 mt-2 my-2">
        <div>
        <field grouped  >

        <control
        v-for="(mail, i) in email"
          :key="i"
          v-model="mail.email"
          :icon-left="mdiMail"
          class="padding-space"
          help="Email"
          :max="255"
          placeholder="Email"
          :error="!/\s/g.test(email[i].email) &&email[i].email.length > 0 && validEmail(email[i].email) ? false : 'Email not valid'"
        />
        <jb-button color="info" :icon="mdiPlusBox" @click="addEmail" small class="h-8 mt-1"/>
        <jb-button
          v-if="email.length > 1"
          color="danger"
          :icon="mdiMinusBox"
          @click="removeEmail"
          class="h-8 mt-1"
          small
        />
      </field>
        </div>
      </div>

      <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button
              :label="buttonLabel"
              :color="button"
              @click="confirm"
              class="pt-1 pb-1"
            />
            <jb-button
              v-if="hasCancel"
              label="Cancel"
              :color="button"
              outline
              @click="cancel"
              class="pt-1 pb-1"
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

<style>
.padding-space input {
    padding-left: 40px !important;
}
</style>
