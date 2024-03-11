<script setup>
import { computed, onBeforeMount, reactive, ref  } from 'vue'
import { mdiClose, mdiPlusBox, mdiMinusBox, mdiEmailPlusOutline ,mdiPound} from '@mdi/js'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import CardComponent from '@/components/CardComponent.vue'
import Level from '@/components/Level.vue'
import TextLink from '@/components/TextLink.vue'
import Overlay from '@/components/Overlay.vue'
import Field from "@/components/Field.vue";
import Control from "@/components/Control.vue";
import { themeStore } from "../stores/theme";
import Multiselect from "@vueform/multiselect";
import {selectClasses} from "../selectcss";
import {followupstore} from '../stores/followup'
import dayjs from 'dayjs';
const theme = themeStore();
const followup = followupstore();

const props = defineProps({
 share:Array,
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

const couns=ref([{
  name:"", 
  count:0
}])

const recs = computed(() => props.share);
let share=recs.value.name
const name1=recs.value.var;

const itemsPaginated = computed(() => followup.share_couns)

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])
const currentPage = ref(1)
const pageLoading = ref(false)
const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}

const form=reactive({
counselor:"",
count:0

}) 
const confirmrefresh=async()=>{
await followup.getFollowup(currentPage.value-1)
  value.value = false
}

const cardClassAddon = computed(() => hasError.value ? 'animate-shake' : '')
const hasError = ref(false)
const hasError1 = ref(false)
const click=()=>{
  hasError.value=false,
  hasError1.value=false
}


const submit = async() => {
if(form.counselor===""){
     hasError.value = true;
  theme.pushMessage("counselor name is required")
}
else if(form.count===0){
     hasError1.value = true;
  theme.pushMessage("count is required")
}
else{
if(form.count <= share){
    await followup.sharedata({ "to":form.counselor,"count" : form.count,
    "bpid" : recs.value.id}) 
     if(followup.$state.share_data.message==="Successfully shared."){ 
      theme.pushMessage("shared data successfully");
      location.reload()
          }
   else{
     theme.pushMessage("Already shared to that particular counselor");
       confirmrefresh()
     }
   

    
  }
  else{
    theme.pushMessage("count is exceeded")

  
  }
}

  
}


const cancel = async() => {
  confirmCancel('cancel')
 await followup.getFollowup()
}


onBeforeMount(async (page) => {
await followup.getsharecounselor(recs.value.branch)

})


</script>

<template>
  <overlay
  >
    <card-component
       :title="` Share Data`" 
      class="shadow-lg w-full max-h-modal md:w-4/5 z-50 lg:w-1/2"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
<!-- v-if="counselor.myenq" -->
 <div >You can share only =  {{share}} data</div>
 <!-- <div v-else>you can share only ===  {{counselor.other}} data</div> -->
 
      <span >
 
    <div class="sm:grid-cols-2 grid-cols-1 gap-2 grid m-3">
        <field label="Counselor name" vertical :error="hasError" help="This field is required" >
        <Multiselect class="border border-success h-9" v-model="form.counselor" :options="itemsPaginated"
          :reduce="(name) => name" placeholder="Search counselor here" name="name" label="name" :error="hasError"  
          valueProp="id" searchable trackBy="name" :classes="selectClasses" @click="click"/>
      </field>
   
       <field label="Counselor count" :error="hasError1"  help="This field is required"  >
          <control
          :error="hasError1"
          :icon-left="mdiPound"
          v-model="form.count"
         type=number
          min="0"
          @click="click"
          class="h-9"
       />
      </field>
      </div>
      
      </span>
      <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button
              label="Share"
              color="info"
              @click="submit"
            />
            
          </jb-buttons>

          <text-link

          />
        </level>
      </template>
    </card-component>
  </overlay>
</template>

