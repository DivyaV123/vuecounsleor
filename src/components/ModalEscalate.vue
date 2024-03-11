<script setup>
import { computed, reactive, ref, onBeforeMount  } from 'vue'
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
import { sessionStore } from "../stores/session";

const counselor = counselorStore();
const theme = themeStore();
const user = sessionStore();
const bid=ref([])
onBeforeMount(async () => {
  await counselor.getBCounselors();
  await counselor.getEReasons();
  if(user.user&&user.user.branches){
    for(let i=0;i<user.user.branches.length;i++){
     bid.value.push(user.user.branches[i].id) 
    }
  }
  await counselor.getEscUsers(bid.value.join(),user.user.uid);

});
const user_list = ref([])
const reasons = computed(() => counselor.eReasons.items);
const users = computed(() => counselor.EscUsers);

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

const formState= reactive({
  enquiry:props.id,
  reason: null,
  to: null,
  comment: ""
})

const confirm = async() => {
  let valid = true
  let formValues = JSON.parse(JSON.stringify(formState))
  for (const key in formValues) {
     if(key === 'reason' && formValues[key] === null){
    valid= false
     theme.pushMessage("Reason is required!")
   } 
   if(key === 'to' && formValues[key] === null){
    valid= false
    theme.pushMessage("Esclated to is required!")
   } 
   }
   if(valid){
    let formSubmit = {
      enquiry:props.id,
      escalations: {
        reason: formValues.reason,
        comments: formValues.comment
      },
      to: formValues.to,
      author: user.author,
      }
   let response = await counselor.submitEscalate(formSubmit)
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
      class="shadow-lg w-full max-h-modal md:w-3/4 lg:w-3/5 z-50"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
      <div class="pl-4 space-y-3">
        <card-component>
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 mt-2 mr-2">
        <field>
          <control
          v-model="formState.reason"
          :options="reasons"
          help="Escalate Reason"
          :error="formState.reason !== null ? false : 'Escalate Reason'"
        />
         </field>
        <field>
        <control
          v-model="formState.to"
          :options="users"
          help="Escalation To"
          :error="formState.to !== null ? false : 'Escalation To'"
        />
        </field>
        <field
          label="Comments"
        >
          <control
            v-model="formState.comment"
            type="textarea"
            placeholder="Comments"
          />
        </field>
        
      </div>
        </card-component>
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
