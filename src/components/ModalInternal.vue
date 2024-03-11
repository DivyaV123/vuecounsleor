<script setup>
import { computed, reactive, ref, onMounted  } from 'vue'
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
const counselor = counselorStore();
const theme = themeStore();

onMounted(async () => {
  await counselor.getBranches()
});
const branches = computed(() => counselor.branches);


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
  name: "",
  description: "",
  number: "",
  branch: [],
})
const todayDate = () => {
  return dayjs().format("DD-MMM-YY hh:mm");
};

const confirm = async() => {
  let valid = true
  let formValues = JSON.parse(JSON.stringify(formState))
  for (const key in formValues) {
    if(key === 'name' && (formValues[key].length === 0)){
      valid = false;
      theme.pushMessage("Name is required");
   } 
   if(key === 'number'){
     let num = formValues[key].replace(/\s+/g, '')
      if(num.length < 10 || isNaN(num)){
      valid = false;
      theme.pushMessage("Mobile number with valid number is required!");
      }
   } 
    if(key === 'branch' && (formValues[key].length === 0)){
      valid = false;
      theme.pushMessage("Branch is required");
   } 
   }
   if(valid){
   let response = await counselor.addInternal(formValues)
  //  theme.pushMessage("Successfully added internal number");
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
          v-model="formState.name"
          help="Name"
          placeholder="Name"
          :error="
            formState.name.length > 0 
              ? false
              : 'Name is required'
          "
        />
        </field>
         <field >
         <control
          v-model="formState.number"
          :icon-left="mdiPhone"
          help="Mobile"
          placeholder="Mobile"
          :error="
            formState.number.replace(/\s+/g, '').length >= 10 && !isNaN(formState.number.replace(/\s+/g, ''))
              ? false
              : 'Mobile(Minimum 10 digits)'
          "
        />
        </field>
        <field 
        help="Select Branch(es)"
        :error="formState.branch.length !== 0 ? false : true">
        <Multiselect
            v-model="formState.branch"
            mode="multiple"
            :options="branches"
            valueProp="id"
            placeholder="Select branch"
            label="name"
            searchable
            trackBy="name"
            :classes="selectClasses"
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