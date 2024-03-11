<script setup>
import { computed, onBeforeMount, reactive, ref  } from 'vue'
import { mdiClose, mdiPlusBox, mdiMinusBox, mdiEmailPlusOutline ,mdiPound, mdiUsbFlashDrive} from '@mdi/js'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import CardComponent from '@/components/CardComponent.vue'
import Level from '@/components/Level.vue'
import TextLink from '@/components/TextLink.vue'
import Overlay from '@/components/Overlay.vue'
import Field from "@/components/Field.vue";
import ModalBox from '@/components/ModalBox.vue'
import Control from "@/components/Control.vue";
import { themeStore } from "../stores/theme";
import dayjs from 'dayjs';
import { current } from 'tailwindcss/colors'
import {followupstore} from '../stores/followup'
const theme = themeStore();
const followup = followupstore();

const props = defineProps({
  help:Array,
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
const hasError = ref(false)
const perPage=25;
// const hrfoc=computed(()=>{
//    return rigid.hrfoc  
// })

const recs = computed(() => props.help);

// const accept =Array({id:null,bid:null,uid:null,count:null})
const reject =Array ({id:null})
const onAccept =async(id,from,count,cid)=>{
   await followup.acceptrequest({"bpid":recs.value.id,"id":cid,"to":id,"from":from,"count":count,"accept":"yes"})
   await followup.gethelprequest(recs.value.id) 
}

const onReject =async(id,from,count,cid)=>{
  await followup.acceptrequest({"bpid":recs.value.id,"id":cid,"to":id,"from":from,"count":count,"accept":"no"})
  await followup.gethelprequest(recs.value.id) 
}
const lightBorderStyle = computed(() => theme.lightBorderStyle)
const isRejectCode=ref(false)
const isAcceptCode=ref(false)
// const itemsCount = computed(() => rigid.hrfoc_total)
// const numPages = computed(() => Math.ceil(itemsCount.value / perPage))

const help = computed(() => followup.help_req);

const currentPage = ref(1)
const numShown = ref(10)
const isModalActive2=ref(false)
const isModalActive=ref(false)
const showreject = ref(true)
const showaccept = ref(true)
const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])
const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}
const cancel = async() => {
  confirmCancel('cancel')
   await followup.getFollowup()
 }


const pageLoading=ref(false)
const form={
comment:"",
}

const pageChange = (page) => {
currentPage.value = page;
// rigid.gethrfoc(page,recs.value.id)  
  pageLoading.value = false
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
};


// const pagesList = computed(() => {
//   const pagesList = []
//   for (let i = 1; i <= numPages.value; i++) {
//      const num = Math.min(numShown.value,numPages.value);
//       let first = currentPage.value - Math.floor(num / 2);
//       first = Math.max(first, 1);
//       first = Math.min(first, numPages.value - num + 1);

//       return [...Array(num)].map((k,i) => i + first)
//   }
//   return pagesList
// })

// const confirm =async(id,count) =>{  
//   await followup.acceptrequest({"bpid":recs.value.bid,"to":recs.value.id,"from":parseInt(recs.value.uid),"count":recs.value.count,"accept":"yes"})
//   // ,comment:form.comment
//   theme.pushMessage("Accept data succesfully")
//   cancel()
// }

onBeforeMount(async (page) => {
  await followup.gethelprequest(recs.value.id)    
})
</script>

<template>
  
 <overlay>
    <card-component
      class="shadow-lg w-full max-h-modal md:w-3/5 z-50 overflow-y-scroll"
       title="Help Request data" 
      :header-icon="mdiClose"
      @header-icon-click="cancel"
    >
      <div class="pl-5 space-y-6 ">
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4 sm:gap-3"  v-for="(client, index) in help" :key="index"  >

     <field  label="Counselor name"> 
    <h1 class=" border-1 dark:bg-gray-800 rounded  text-white text-lg cursor-not-allowed text-center h-[40px] leading-8 ">{{client.name}}</h1> 
     </field>

       <field label="Counselor count">
          <h1 class="h-[40px] leading-8  cursor-not-allowed text-center border-1 dark:bg-gray-800 rounded  text-white text-lg  ">
          {{client.count}}
          </h1>
          </field>

          <div  class="lg:mt-7 mt-0" >
        <div v-if="client.status===1">
         <jb-button
    label="Accept"
      color="info"
        class="pt-[6px] pb-[6px] mt-1"
       @click="onAccept(client.to,client.from,client.count,client.id)" />
    
<span>
       <jb-button
       label="Reject"
       color="danger"
      class="ml-2 pt-[6px] pb-[6px] mt-1"
        @click="onReject(client.to,client.from,client.count,client.id)"/>
</span>
        </div>

     <jb-button
       v-else-if="client.status===2"
    label="Accepted"
    color="info"
    class=" w-[70px] h-[30px]"
 />

    <jb-button
     v-else-if="client.status===3"
    label="Rejected"
    color="danger"
    class=" w-[70px] h-[30px]"  
 />

  <jb-button
   v-else-if="client.status===4"
    label="Accepted and moved"
    color="success"
    class=" w-[180px] h-[30px]"
 />
     <jb-button
     v-else
       label="no enq left for split"
    class="bg-gray-600   w-[280px] h-[30px]"
    />
  </div>
      </div>
      </div>

       <!-- <div
    :class="lightBorderStyle"
    class="p-3 lg:px-6 border-t dark:border-gray-800"
  >
    <level mobile>
      <jb-buttons glue>
        <jb-button
          v-for="page in pagesList"
          :key="page" 
          :active-soft="page === currentPage"
          :label="page"
          addon
          :outline="darkMode"
          small
          no-focus-ring
          @click="pageChange(page)"
          class="ml-2"
        />
      </jb-buttons>
      <small>Page {{ currentPage }} of {{ numPages }}</small>
    </level>
  </div> -->
    </card-component>
  </overlay>
<!-- <accept :accept="accept"  v-model="isAcceptCode" v-if="isAcceptCode==true" /> -->
<!-- <reject :reject="reject"  v-model="isRejectCode" v-if="isRejectCode==true"/> -->
  <!--  -->
 <!-- <modal-box
      v-model="isModalActive"
      >
     <overlay>
        <card-component
      class="shadow-lg w-full max-h-modal md:w-3/5 z-50"
       title="Reject data" 
      :header-icon="mdiClose"
      @header-icon-click="acceptcancel"
    >
      <div class="pl-5 space-y-6">

 <field label="Reject Reason"> 
        <control
          type="textarea"
        placeholder="Comments"
        v-model="form.comment"
          />
      </field>
</div>
      <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button
              label="save"
              color="info"
              @click="Rejectcancel"
            />
          
            <jb-button
              label="Cancel"
              :color="danger"
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
  
  </modal-box>



  <modal-box
      v-model="isModalActive2"
      >
     <overlay>
        <card-component
      class="shadow-lg w-full max-h-modal md:w-3/5 z-50"
       title="Accept data" 
      :header-icon="mdiClose"
      @header-icon-click="cancel"
    >
      <div class="pl-5 space-y-6">

 <field label="Accept Reason"> 
        <control
          type="textarea"
        placeholder="Comments"
        v-model="form.comment"
          />
      </field>
</div>
      <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button
              label="save"
              color="info"
              @click="confirm"
            />
          
            <jb-button
              label="Cancel"
              :color="danger"
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
  
  </modal-box>-->


</template>