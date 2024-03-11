<script setup>
import { computed, onBeforeMount, reactive, ref ,watch } from 'vue'
import { mdiClose, mdiPlusBox, mdiMinusBox, mdiEmailPlusOutline } from '@mdi/js'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import CardComponent from '@/components/CardComponent.vue'
import Level from '@/components/Level.vue'
import TextLink from '@/components/TextLink.vue'
import Overlay from '@/components/Overlay.vue'
import Field from "@/components/Field.vue";
import ModalBox from '@/components/ModalBox.vue'
import { useRoute, useRouter } from 'vue-router'
import Control from "@/components/Control.vue";
import Multiselect from "@vueform/multiselect";
import {selectClasses} from "../selectcss"
import { themeStore } from "../stores/theme";
import dayjs from 'dayjs';
import { sessionStore } from "../stores/session";
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const user = sessionStore();
const theme = themeStore();
const route= useRoute();


const props = defineProps({
  history:Array,
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
let couns=ref([])
const getRecords = [];
const recs = computed(() => props.history);
const records = computed(() => {
  if(recs.value &&recs.value.Recs){
      for(var r of recs.value.Recs){
        for(var brnh of user.user.branches){
        for(var rec_br of r.branch){
        if (rec_br.id === brnh.id){
          getRecords.push(r);
        }
      }
    }
    }
    return getRecords
}

}
);
const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])
const tableTrStyle = computed(() => theme.tableTrStyle)
const tableTrOddStyle = computed(() => theme.tableTrOddStyle)


const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}

const currentPage = ref(0)
const hasError = ref(false)
const hasError1 = ref(false)
const isModalActive = ref(false)
const cardClassAddon = computed(() => hasError.value || hasError1.value ? 'animate-shake' : '')
const currentPageHuman = computed(() => currentPage.value+1);
const itemspaginated = computed(() =>
records.value.slice(
    perPage * currentPage.value,
    perPage * (currentPage.value + 1)
  )
  
);
const pagesList = computed(() => {
  const pagesList = [];
  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }
  return pagesList;
});

const cancel = () => {
  confirmCancel('cancel')
  //  location.reload()
  }

const pageChange = async (page) => {
    pageLoading.value = true
    currentPage.value = page+1;
    // if (searchQuery.value.length > 0) {
    //     await batchplan.getBatchPlanlist(page, searchQuery.value);
    // } else {
      
    // }
    pageLoading.value = false
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    })
    };

const pageLoading = ref(false)
const itemsCount = computed(() => records.value.length)  
const perPage =8;
const maxPages = ref(10);
const numPages = computed(() => Math.ceil(records.value.length / perPage));
</script>


<template>
  <overlay
  >
  <second-split :split="split" v-model="isModalActive" v-if="isModalActive==true" />
    <card-component
      class="shadow-lg w-full max-h-modal sm:w-4/5 md:w-3/5 z-50 overflow-y-scroll lg:w-4/5 xl:w-3/5"
      title="call record history"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      @header-icon-click="cancel"
    >
     
  <table>
    
    <thead>
      <tr>
       <th>Status</th>
      <th>Record</th>
      <!-- <th>Branch</th> -->
      <th>Duration</th>
      <th>Date and Time</th>
      
      </tr>
   
    </thead>
  <tbody>

      <tr
        v-for="(client, index) in itemspaginated"
        :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
<!-- {{ client }} -->
         <td data-label="Status">
         <small class="text-gray-500 dark:text-gray-300 capitalize" v-if="client.status!==null"> 
        {{client.status.name}} -{{client.status.substatus.name}}  
          </small>
          <!-- <small class="text-gray-500 dark:text-gray-300 capitalize" v-if="client.status!==null"> 
        {{client.status.name}} -{{client.status.substatus.name}}  
          </small>      -->
        </td>
        
 
    <td data-label="Recording">
       <small class="text-gray-500 dark:text-gray-300 capitalize"  >  
        <audio  :src="`https://gotest.qspiders.com/records/${client.record}`" controls controlsList="nodownload" >
        Your browser does not support the audio element.
              </audio>
          </small>   
        </td>

         <!-- <td data-label="Branch" v-if="client.branch===user.user.branches">
       <small class="text-gray-500 dark:text-gray-300 capitalize"  v-for="(client) in client.branch" :key="client.id" >  
     {{client.name}}
          </small>   
        </td> -->

  <td data-label="Duration">
       <small class="text-gray-500 dark:text-gray-300 capitalize"  >  
        {{client.duration}} 
          </small>   
        </td>

    <td data-label="Recording">
       <small class="text-gray-500 dark:text-gray-300 capitalize"  >  
        {{ dayjs(client.time).utc().format("DD-MMM-YY hh:mm") }}
          </small>   
        </td>
   
      </tr>
    </tbody>
  </table>
      <template #footer>
        
         <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
   <level mobile>
      <jb-buttons>
        <jb-button
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
         @click="currentPage = page "
        />
      </jb-buttons>
   
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </level>
  </div>
         
        
      </template>

       </card-component>
  </overlay>

    



</template>