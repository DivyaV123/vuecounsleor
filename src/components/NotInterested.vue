<script setup>
import { computed, onBeforeMount, reactive, ref  } from 'vue'
import { mdiClose, mdiPlusBox, mdiMinusBox, mdiEmailPlusOutline,mdiEmail,mdiMicrophone,mdiBookEducation } from '@mdi/js'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import CardComponent from '@/components/CardComponent.vue'
import Level from '@/components/Level.vue'
import TextLink from '@/components/TextLink.vue'
import Overlay from '@/components/Overlay.vue'
import Field from "@/components/Field.vue";
import Control from "@/components/Control.vue";
import { themeStore } from "../stores/theme";
import dayjs from 'dayjs';
import { current } from 'tailwindcss/colors'
import ModalRemove from '@/components/ModalRemove.vue'
import {followupstore} from '../stores/followup'
import ShowHistory from '@/components/ShowHistory.vue'
const theme = themeStore();
const followup = followupstore();



const props = defineProps({
  notinterested:Boolean,
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

const propValues = reactive({
  id: 0,
  name: "",
});

const name =ref("")
const email =ref("")
const number =ref("")

const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*")
}
const recs = computed(() => props.notinterested);
const currentPage = ref(1);

const hasError = ref(false)
const perPage = 50;
const itemsCount =computed(()=>followup.notinterested_total)
const itemsPaginated = computed(() =>followup.notinterested);
const numPages = computed(() =>{ 
  if(itemsCount.value!=0){
    return Math.ceil(itemsCount.value / perPage)
  }
  });
const currentPageHuman = computed(() => currentPage.value);
const numShown = ref(10)
const pageLoading=ref(false)
const lightBorderStyle = computed(() => theme.lightBorderStyle)
const lightBgStyle = computed(() => theme.lightBgStyle)
const tableTrStyle = computed(() => theme.tableTrStyle)
const tableTrOddStyle = computed(() => theme.tableTrOddStyle)
const maxPages = ref(10);
const removedd = Array({id:null,name:""});

const pageChange = async (page) => {
    pageLoading.value = true
    currentPage.value = page+1;
    // if (searchQuery.value.length > 0) {
    //     await batchplan.getBatchPlanlist(page, searchQuery.value);
    // } else {
        await followup.getnotinterested(page,recs.value);
    // }
    pageLoading.value = false
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    })
    };
    const pagesList = computed(() => {
    const pagesList = [];
    let startPage;
    let endPage;
    if (currentPage.value < 1) {
        currentPage.value = 1;
    } else if (currentPage.value > numPages.value) {
        currentPage.value = numPages.value;
    }
    if (numPages.value <= maxPages.value) {
        startPage = 1;
        endPage = numPages.value;
    } else {
        let maxPagesBeforeCurrentPage = Math.floor(maxPages.value / 2);
        let maxPagesAfterCurrentPage = Math.ceil(maxPages.value / 2) - 1;
        if (currentPage.value <= maxPagesBeforeCurrentPage) {
        // current page near the start
        startPage = 1;
        endPage = maxPages.value;
        } else if (currentPage.value + maxPagesAfterCurrentPage >= numPages.value) {
        // current page near the end
        startPage = numPages.value - maxPages.value + 1;
        endPage = numPages.value;
        } else {
        // current page somewhere in the middle
        startPage = currentPage.value - maxPagesBeforeCurrentPage;
        endPage = currentPage.value + maxPagesAfterCurrentPage;
        }
    }
    return Array.from(Array(endPage + 1 - startPage).keys()).map(
        (i) => startPage + i
    );
    });

let history = ref([])
const isHistory = ref(false)
const onHistory =async(data)=>{
  history.value=data;
  isHistory.value=true;
}
const onShowRemovedd = (id,name) => {
      propValues.id = id;
    propValues.name=name;
    isModalRemove.value = true;
};

const isModalRemove = ref(false)
const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}
const cancel = () => {
  confirmCancel('cancel')
  // location.reload()
  }

let params = ref("")
const searchParams = async() => {
     let searchdata=""
      if(name.value || email.value ||number.value){ 
        if (name.value ) {
  searchdata+="&name=" +name.value
    ;}  
     if (email.value ) {
  searchdata+="&email=" +email.value
    ;}     
      if (number.value ) {
  searchdata+="&number=" +number.value
    ;}                 
 params = new URLSearchParams(searchdata).toString();
   let  copystring=searchdata
   currentPage.value=0
    await  followup.getnotinterested(currentPage.value,recs.value,params);
}
}

 const clear = async() => {
    params ='';
   name.value='';
    email.value='';
 number.value="";
    currentPage.value=0;
    await  followup.getnotinterested(currentPage.value,recs.value );
    }

const isModalActive = ref(false)

const notinterested=computed(()=>{
   return followup.notinterested  
})

onBeforeMount(async (page) => {
     pageLoading.value = true
  await followup.getnotinterested(currentPage.value-1,recs.value) 
     pageLoading.value = false 
})
</script>

<template>
  <div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>
  <overlay>
        <modal-remove
    v-if="isModalRemove"
    v-model="isModalRemove"
    :title="'Remove ' + propValues.name"
    :id="propValues.id"
    @confirm="confirmRefresh"
    has-cancel
  >
  </modal-remove>
  <!-- <modal-remove :removedd="removedd" v-model="isModalRemove" v-if="isModalRemove==true"/> -->
     <show-history  :history="history" v-model="isHistory" v-if="isHistory==true"/>
    <card-component
      class="shadow-lg w-full h-screen md:w-5/5 z-50 mt-14 overflow-y-scroll"
       title="Not Interested data" 
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
       <div class="flex justify-start w-full bg-gray-900 sticky top-[0px] z-[9] pb-2 pt-2">
    <jb-button
    @click = "isModalActive =! isModalActive"
    label="Filters"
    type="submit"
    color="info"
    class="pt-1 pb-1 pr-2 pl-2"
    :icon="mdiFilter"
    />
    </div>

     <aside
    id="aside-right"
    class="
      w-60
      pr-1.5
      fixed
      z-[9]
      h-screen
      lg:h-screen-menu
      top-0
      lg:top-14
      bg-white
      border-l border-gray-100
      overflow-y-scroll
      transition-position
      dark:bg-gray-900
      dark:border-gray-700
      dark:scrollbar-thumb-gray-600
      dark:scrollbar-track-gray-800
      right-0
    "
    v-if="isModalActive"
  >
    <div>
      <div class="
          md:rounded
          dark:bg-gray-900/70
          block
          bg-white
          border border-gray-100
          dark:border-gray-900
          mb-4
        "
      >
        <header
          class="
            flex
            items-stretch
            border-b border-gray-100
            dark:border-gray-700
          "
        >
          <p class="flex items-center py-3 grow font-bold px-6">
            Search List
          </p>
          <a @click="isModalActive = false" class="flex items-center py-3 px-4 justify-center cursor-pointer">
            <span class="inline-flex justify-center items-center w-6 h-6"  @click="cancelling()">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                class="inline-block"
              >
                <path
                  fill="currentColor"
                  d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                ></path></svg>
              </span
            ></a>
        </header>
        <field label="Search Name" class="ml-[5px]">  
         <input type=text v-model="name"   class="border border-success bg-gray-800 w-full h-[35px] rounded pl-1" placeholder="Enter name here" required />
         </field>

          <field label="Search Email" class="ml-[5px]">  
         <input type=text v-model="email"   class="border border-success bg-gray-800 w-full h-[35px] rounded pl-1" placeholder="Enter email here" required />
         </field>

          <field label="Search Number" class="ml-[5px]">  
         <input type=text v-model="number"   class="border border-success bg-gray-800 w-full h-[35px] rounded pl-1" placeholder="Enter number here" required />
         </field>

     
          <div class="grid grid-cols-1 last:mb-0 mb-2">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                class="
                  inline-flex
                  cursor-pointer
                  justify-center
                  items-center
                  whitespace-nowrap
                  ring-blue-700
                  focus:outline-none
                  transition-colors
                  duration-150
                  border
                  bg-emerald-600
                  text-white
                  border-emerald-700
                  hover:bg-emerald-700
                  focus:ring
                  rounded
                "
                @click="searchParams()"
                type="button"
              >
                <span class="pl-1 pr-1">Search</span></button>
              <button
                class="
                  inline-flex
                  cursor-pointer
                  justify-center
                  items-center
                  whitespace-nowrap
                  ring-blue-700
                  focus:outline-none
                  transition-colors
                  duration-150
                  border
                  bg-red-600
                  text-white
                  border-red-700
                  hover:bg-red-700
                  focus:ring
                  rounded
                "
                @click="clear()"
                type="button"
              >
                <span class="pl-1 pr-1">Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>
   
  </aside> 
  <div v-if="itemsCount>0"><div class="space-y-3 ">
      <table>
    <thead class="sticky top-[48px] z-[1] bg-gray-900">
      <tr>
      <th>Name</th>
        <th>Academic</th>
        <th>Mobile No.</th>
        <th> Email</th>
        <th>Courses -- Branch</th>
        <!-- <th>Branch</th> -->
        <th>Timing </th>
        <th>Call<br/> Count</th>
        <th>Status</th>
        <th>DOE</th>
       <th>Remove</th>

      </tr>
    </thead>

      <tbody>
     
      <tr
        v-for="(client, index) in itemsPaginated"
        :key="client"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
  
         <td data-label="Name">
              <small
            class="text-gray-500 dark:text-gray-300 font-semibold "
          >
     {{ client.name }}   <span v-if="client.enquiry.enquiree_name">({{ client.enquiry.enquiree_name }})</span>
          </small> 
        </td>
<!-- {{client.education==null}} -->
   <td data-label="Academics">
          <span v-if="client.education">
            <span v-if="client.education.percentage !== null">
            <jb-button
              v-if="client.education.percentage"
              color="success"
              :icon="mdiBookEducation"
              class="mr-1 cursor-default"
              small
            />
            <jb-button
              v-else
              color="danger"
              :icon="mdiBookEducation"
              small
              class="mr-1"
            />
          </span>
          <span v-if="client.education.stream_object !== null">
            <small
              v-if="client.education.name"
              class="text-gray-500 dark:text-gray-300"
            >
              {{ client.education.name.shortname }},
            </small>
            <small
              v-if="client.education.stream_object"
              class="text-gray-500 dark:text-gray-300"
            >
              {{ client.education.stream_object.shortname }}
            </small>
          </span>
          <span v-if="client.education.stream_object == null">
            <small class="text-gray-500 dark:text-gray-300">
              <jb-button
                color="info"
                outline
                :icon="mdiBookEducation"
                small
              />
            </small>
          </span>
          </span>
        </td>
       
       <td  data-label="Mobile"  >   
      <span v-for="(client1, index1) in client.contact" :key="index1%2===1" >
          <small class="text-gray-500 dark:text-gray-300 capitalize" v-if="client1.code && client1.number">
          <a class="" :href="'tel:' + client1.code + client1.number">
            {{ client1.code + client1.number }}
                <!-- {{maskNumber(client1.code + client1.number)}} -->
         </a>
          &nbsp;
           </small>
            <small class="text-gray-500 dark:text-gray-300 capitalize" v-else>
           </small>
          </span>
          </td>
        

        <td  data-label="Course-Mode of class-Agreed date">
            <span
         v-for="(client2, index1) in client.email"
        :key="index1%2===1">
           <small
            class="text-gray-500 dark:text-gray-300 ">
           <a class=""
                :href="'mailto:' +   client2.email">  
                <jb-button
            color="warning"
            :icon="mdiEmail"
            small
                 />
                  <!-- {{client2.email}} -->
        </a>
        &nbsp;
           </small>
          </span> 
        </td>
    <td  data-label="Courses" v-if=" client.courses&&client.other_courses">
        <small v-for="(client3, index1) in  client.courses"
        :key="index1%2===1"  class="text-gray-500 dark:text-gray-300 capitalize text-base"> 
        <small v-if="client3.course">
          <span >{{client3.course.name}}</span> -- <span class="text-emerald-400"> {{client3.branch.name }}</span>
          <br/>
          </small>
             &nbsp;
         </small>    
        </td>
          <td  data-label="Courses" v-if="client.courses===null">
            <small
         v-for="(client3, index1) in  client.other_courses"
        :key="index1%2===1"  class="text-gray-500 dark:text-gray-300 capitalize text-base"
          > 
          <span >{{client3.course.name}}</span> -- <span class="text-emerald-400"> {{client3.branch.name }}</span>
      <br/>
             &nbsp;
            </small>    
         </td>

              <td  data-label="Courses" v-else-if=" client.other_courses===null">
        <small v-for="(client3, index1) in  client.courses"
        :key="index1%2===1"  class="text-gray-500 dark:text-gray-300 capitalize text-base"> 
        <small v-if="client3.course">
          <span >{{client3.course.name}}</span> -- <span class="text-emerald-400"> {{client3.branch.name }}</span>
          <br/>
          </small>
             &nbsp;
         </small>    
        </td>
<!-- 
        <td  data-label="Branch" v-if="client.courses===null">
            <small
        v-for="(client3, index1) in  client.other_courses"
        :key="index1%2===1"  class="text-gray-500 dark:text-gray-300 capitalize"
          > 
         <span v-if="client3.branch">
          {{client3.branch.name }}
          <br/>
    
             &nbsp;
         </span>
            </small>    
         </td>
            <td  data-label="Branch" v-else>
            <small
        v-for="(client3, index1) in  client.courses"
        :key="index1%2===1"  class="text-gray-500 dark:text-gray-300 capitalize"
          > 
         <span v-if="client3.branch">
          {{client3.branch.name}}
       <br/>
             &nbsp;
         </span>
            </small>    
         </td> -->

    <td  data-label="Timing" v-if=" client.enquiry &&client.enquiry.flexi_timing===false" >   
            <small  v-for="(client5, index1) in client.enquiry.time_slot"
        :key="index1%2===1"
            class="text-gray-500 dark:text-gray-300 capitalize"
          >
         rigid- {{client5.name}}
           </small>
        </td> 
        <td  data-label="Timing" v-else> 
          <small>  
        flexi- {{client.enquiry.class_timing.name}}
          </small>
      </td>  

   
<td  data-label="Call Count" v-if="client.records &&  client.records.length ">         
     <jb-button :icon="mdiMicrophone"  color="info" :label="client.records.length" small  @click="onHistory(client)"/>
    </td>
<td v-else>  <jb-button :icon="mdiMicrophone" small/></td>

     <td data-label="Status">
          <small v-if="client.records?.length > 0" class="text-gray-400 dark:text-gray-300 font-semibold">
            <span v-if="client.records.slice(-1)[0].status">{{client.records.slice(-1)[0].status.name}}- {{client.records.slice(-1)[0].status.substatus.name}} 
            </span>
            <span v-else class="text-gray-400 dark:text-gray-400 font-semibold">No status</span>
          </small>
        </td>
     
      <td data-label="DOE">
        <small>
 {{client.created.substr(0, 10)}} 
        </small> 
      </td>

       <td data-label="Remove">
       <jb-button label="Remove"  color="danger" small @click="onShowRemovedd(client.id,client.name)"/>
      </td>  
      </tr>
      </tbody>
  </table>
 </div>


   <div
   :class="lightBorderStyle"
        class="p-3 lg:px-6 border-t dark:border-gray-800"
      >
        <level mobile>
          <jb-buttons glue>
            <jb-button
              v-for="page in pagesList"
              :class="currentPage === page ? 'bg-gray-500' : ''"
              :key="page"
              :active-soft="page === currentPage"
              :label="page"
              addon
              :outline="darkMode"
              small
              no-focus-ring
              @click="currentPage != page ? pageChange(page - 1) : ''"
            />
          </jb-buttons>
          <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
        </level>
      </div>
      </div>
       <div v-else class="text-2xl text-red-800 text-center">Record Not Found</div> 
  
    </card-component>
  </overlay>
</template>