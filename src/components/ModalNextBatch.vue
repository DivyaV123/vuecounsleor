<script setup>
import { computed, reactive, ref, onBeforeMount  } from 'vue'
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
import Multiselect from "@vueform/multiselect";
import {selectClasses} from "../selectcss"
import { themeStore } from "../stores/theme"
import dayjs from "dayjs";
const counselor = counselorStore();
const theme = themeStore();

onBeforeMount(async () => {
  // await counselor.getCourseValues();
});
const todayDate = () => {
  return dayjs().format("YYYY-MM-DD");
};


// const courses = computed(() => counselor.courses);
// const modeclass = computed(() => counselor.modeclass);
// const branches = computed(() => counselor.branches);

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
  },
  courses:{
    type: Array,
    default: []
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
  sid:props.id,
  course: null,
  agreed_date:""

})


const confirm = async() => {
  let valid = true
  let formValues = JSON.parse(JSON.stringify(formState))
  for (const key in formValues) {
    if (key === "course" && formValues[key] === null) {      
      valid = false
      theme.pushMessage("Please select course")   
   }
   if (key === "agreed_date" && formValues[key].length === 0) {      
      valid = false
      theme.pushMessage("Please add agreed date")   
   }
  }
   if(valid){
   let response = await counselor.updateAgreedDate(formValues)
   theme.pushMessage("Agreed date has been updated")   
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
        <title-sub-bar title="Regular Course" />
    <card-component>
      <field>
        <field help="Select Course">
          <Multiselect
            v-model="formState.course"
            :options="props.courses"
            valueProp="id"
            label="name"
            searchable
            trackBy="name"
            :classes="selectClasses"
          />
        </field>
        <field>
          <control v-model="formState.agreed_date" type="date" help="Agreed date" :minDate="todayDate()" />
        </field>
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
