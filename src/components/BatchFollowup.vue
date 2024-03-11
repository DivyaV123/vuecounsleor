
<script setup>
import { computed, ref ,reactive,onBeforeMount} from 'vue'
import { mdiCloseCircleOutline, mdiMagnify, mdiLifebuoy, mdiBookEducation, mdiPlusBox,mdiMicrophone, mdiEmail, mdiExclamationThick ,mdiFilter  } from '@mdi/js'
import ModalBox from '@/components/ModalBox.vue'
import CheckboxCell from '@/components/CheckboxCell.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { themeStore } from "../stores/theme"
import Icon from '@/components/Icon.vue'
import dayjs from 'dayjs';
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import { useRoute, useRouter } from 'vue-router'
import ModalRemove from '@/components/ModalRemove.vue'
import Modal from '@/components/ModalAcademics.vue'
import CheckRadioPicker from '@/components/CheckRadioPicker.vue'
import SharedData from "@/components/SharedData.vue"
import HelpRequest from "@/components/HelpRequest.vue"
import BatchNameModal from "@/components/BatchNameModal.vue"
import TotalCalled from "@/components/TotalCalled.vue"
import NotCalled from "@/components/NotCalled.vue"
import ComingList from "@/components/ComingList.vue"
import NotInterested from "@/components/NotInterested.vue"
import CallBackList from "@/components/CallBackList.vue"
import Joined from "@/components/Joined.vue"
import NotJoined from "@/components/NotJoined.vue"
import NextBatchList from "@/components/NextBatchList.vue"
import JoinedOther from "@/components/JoinedOther.vue"
import {followupstore} from '../stores/followup'


const followup = followupstore();
const route= useRoute();
const theme = themeStore();
const pageLoading =ref(false)
// Pagination
const perPage=50;
const itemsPaginated  = computed(() => followup.started)
const date_selected1 = ref(null);
const date_selected2 = ref(null);
const name =ref("")
const itemsCount = computed(() => followup.started_total)
const currentPage = ref(1)
const counselor = computed(() => followup.counselor)
let params=ref("")
const share = Array({id:null,name:"",branch:"",userid:""});
const help =Array({id:null,uid:""})
const author=Array({id:null})
let batchname =ref([])
let totalcalled =ref([])
let notcalled =ref([])
let coming =ref([])
let notinterested =ref([])
let callback = ref([])
let joined =ref([])
let notjoined =ref([])
let nextbatch = ref([])
let otherjoined = ref([])

const isBatchName=ref(false)
const isTotalCalled=ref(false)
const isNotCalled = ref(false)
const isComing =ref(false)
const isNotInterested =ref(false)
const isCallBack=ref(false)
const isJoined =ref(false)
const isNotJoined =ref(false)
const isNextBatch = ref(false)
const isOtherJoined = ref(false)


const onBatchName =async(data)=>{
  batchname.value=data;
  isBatchName.value=true;
}
const onTotalCalled =async(data)=>{
  totalcalled.value=data;
  isTotalCalled.value=true;
}
const onNotCalled =async(data)=>{
  notcalled.value=data;
  isNotCalled.value=true;
}
const onComing =async(data)=>{
  coming.value=data;
  isComing.value=true;
}
const onNotInterested =async(data)=>{
  notinterested.value=data;
  isNotInterested.value=true;
}
const onCallBack =async(data)=>{
  callback.value=data;
  isCallBack.value=true;
}
const onJoined =async(data)=>{
  joined.value=data;
  isJoined.value=true;
}
const onNotJoined =async(data)=>{
  notjoined.value=data;
  isNotJoined.value=true;
}
const onNextBatch =async(data)=>{
  nextbatch.value=data;
  isNextBatch.value=true;
}
const onOtherJoined =async(data)=>{
  otherjoined.value=data;
  isOtherJoined.value=true;
}

const onShare = async(id,name,branch,userid) => {
  share.id=id;
  share.name=name;
  share.branch=branch;
  share.userid=userid;
  isRegCodeStart.value = true;

};

const onReassign =async(id,name,value)=>{
  share.id=id;
  share.name=name;
  share.value=value;
  isRegCodeStart.value = true;

  let something = JSON.parse(JSON.stringify(counselor.value.counselors));
  let cns = []
  cns = something
  if(cns.length > 0){
    for(var p = 0; p < cns.length; p++){
      couns.value.push({name:cns[p].username, count:0,id:cns[p].id,other:counselor.value.other_enq})  
    }
  } 
  couns.value = []
}



const onHelp =async(id,uid)=>{
  help.id=id
  help.uid=uid
  isHelpCode.value=true;
}

const onAuthor =async(id)=>{
  author.id=id
  isAuthorCode.value=true;
}



let couns=ref([])
const numPages = computed(() => Math.ceil(itemsCount.value / perPage))
 const currentPageHuman = computed(() => currentPage.value );
const lightBorderStyle = computed(() => theme.lightBorderStyle)
const lightBgStyle = computed(() => theme.lightBgStyle)
const tableTrStyle = computed(() => theme.tableTrStyle)
const tableTrOddStyle = computed(() => theme.tableTrOddStyle)
const darkMode = computed(() => theme.darkMode)
const checkedRows = ref([])
const isHelpCode=ref(false)
const isAuthorCode=ref(false)
const maxPages = ref(10);

const pageChange = async (page) => {
    pageLoading.value = true
    currentPage.value = page+1;
 
        await followup.getFollowup(page,params);
    
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


const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*")
}

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}

const remove = (arr, cb) => {
  const newArr = []
  arr.forEach(item => {
    if (!cb(item)) {
      newArr.push(item)
    }
  })
  return newArr
}




const searchParams = async() => {
     let searchdata=""
  if(name.value || date_selected1.value|| date_selected2.value ){ 
   if (name.value ) {
  searchdata+="&name=" +name.value
    }  
                  
  if (date_selected1.value) {
searchdata += "&from="+dayjs(date_selected1.value).format("YYYY-MM-DD");
}
if(date_selected2.value){
searchdata += "&to="+dayjs(date_selected2.value).format("YYYY-MM-DD");
}
 params = new URLSearchParams(searchdata).toString();
   let copystring=searchdata
   currentPage.value=0
  await  followup.getFollowup(currentPage.value,params);
}
}


 const clear = async() => {
    params ='';
   name.value='',
    date_selected1.value = '';
    date_selected2.value = ''
    currentPage.value=0;
    await  followup.getFollowup(currentPage.value,params);
    }



onBeforeMount(async () => {
   pageLoading.value = true
await followup.getFollowup(currentPage.value-1)
   theme.setPageTitle("Followup Started")
    pageLoading.value = false
})

const setPage=ref(false)
const isRegCodeStart =ref(false)
const isModalActive =ref(false)

</script>

<template>

<shared-data :share="share" v-model="isRegCodeStart" v-if="isRegCodeStart==true" />
<help-request   :help="help" v-model="isHelpCode" v-if="isHelpCode==true"/>
<author-shared  :author="author" v-model="isAuthorCode" v-if="isAuthorCode==true"/>
<batch-name-modal :batchname="batchname" v-model="isBatchName" v-if="isBatchName==true"/>
<total-called :totalcalled="totalcalled" v-model="isTotalCalled" v-if="isTotalCalled==true"/>
<not-called :notcalled="notcalled" v-model="isNotCalled" v-if="isNotCalled==true"/>
<coming-list :coming="coming" v-model="isComing" v-if="isComing==true"/>
<not-interested :notinterested="notinterested" v-model="isNotInterested" v-if="isNotInterested==true"/>
<call-back-list :callback="callback" v-model="isCallBack" v-if="isCallBack==true"/>
<joined :joined="joined"  v-model="isJoined" v-if="isJoined==true"/>
<not-joined :notjoined="notjoined"  v-model="isNotJoined" v-if="isNotJoined==true"/>
<next-batch-list :nextbatch="nextbatch"  v-model="isNextBatch" v-if="isNextBatch==true"/>
<joined-other :otherjoined="otherjoined" v-model="isOtherJoined"  v-if="isOtherJoined==true"/>
  <div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>



    <div class="flex justify-start w-full bg-[#151D2B] sticky top-[52px] z-[9] pb-2 pt-2">
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
      z-40
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
        
   

         
          <field label="Search batchplan Name" class="ml-[5px]">  
             <input type=text v-model="name"   class="border border-success bg-gray-800 w-full h-[35px] px-2 rounded" placeholder="Enter batchplan name here" required />
             </field>

          <div class="mb-4 ml-[5px]">
            <div class="relative">
              <field label="From Date">
            <control
                v-model="date_selected1"
                :icon-left="mdiCalendarRange"
                placeholder="Search by Date"
                type="date"  
                class="border-gray-600"        
            />
          </field>
            </div>
          </div>

          <div class="mb-4 ml-[5px]">
            <div class="relative">
             <field label="To Date">
            <control
                v-model="date_selected2"
                :icon-left="mdiCalendarRange"
                placeholder="Search by Date"
                type="date" 
                class="border-gray-600"   
            />
          </field>
            </div>
          </div>

          

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

    <!-- class="relative"
    class="bg-gray-900 sticky top-[55px] w-full z-50" -->
    <div v-if="itemsCount>0">
      <table >
        <thead class="sticky top-[95px] z-[9] bg-gray-900">
      <tr class="text-center">
    
        <th rowspan="2" class="text-center">Batch plan Name</th>
        <th rowspan="2" class="text-center">Date</th>
        <th rowspan="2" class="text-center">Assigned Enquires to me</th>
        <th rowspan="2" class="text-center">My Enq</th>
         <!-- <th rowspan="2">HRFOC</th>
        <th rowspan="2">Total Students</th> -->
        <th rowspan="2" class="text-center">Total Called</th>
        <th rowspan="2" class="text-center">Not Called</th>
        <th rowspan="2" class="text-center">Coming</th>
        <th rowspan="2" class="text-center">Not <br/>interested</th>
        <th rowspan="2" class="text-center">Call Back</th>
        <th rowspan="2" class="text-center">Next Batch</th>
      <th colspan="2" class="text-center">Joined  </th>
      <th rowspan="2" class="text-center">Not Joined  </th>
    
      </tr>
       <tr>
           <th class="text-center">Coming</th>
            <th class="text-center">Other Status</th>
      </tr> 
      
    </thead>
    <tbody>

      <tr
        v-for="(client, index) in itemsPaginated"
        :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">

      <td data-label="Batch plan Name" @click="data" class="text-center">
      <small class="text-gray-500 dark:text-gray-300 font-semibold pr-[10px] capitalize">
         <button  @click="onBatchName(client.id)" v-if="client.totalstudents>0" class="text-green-500 dark:text-green-300 font-semibold"> {{client.batchplan}} </button>
         <button  v-else> {{client.batchplan}} </button>
             <!-- <router-link :to="`/notstart1/` + `${client.id}` + `&` +`full` +`&`+`${redirect1}`"> -->   
            <!-- </router-link> -->
          </small>   
        </td>

        <td data-label="Batch Plan Date" class="text-center">
              <small
            class="text-gray-500 dark:text-gray-300 font-semibold pl-[10px] capitalize">
            {{client.Batchplan_date.substr(0, 10)}}
          </small>  
        </td>
     
         <td data-label="Assigned Enquires to me" class="text-center" >
          <!-- <small class="text-gray-500 dark:text-gray-300 font-semibold capitalize">
            {{client.hrfoc}}
          </small>
          <br> -->
          <jb-button
          v-if="client.hrfoc>0"
              :label="`HRFOC(${client.hrfoc})`"
              @click="onHelp(client.id,client.userid)"
             class="border bg-orange-500 text-white border-orange-500 hover:bg-orange-500 hover:border-orange-500 rounded-sm mx-2 px-3"
             small
            />
            <jb-button
          v-else
              :label="`HRFOC(${client.hrfoc})`"
             class="border bg-orange-500 text-white border-orange-500 hover:bg-orange-500 hover:border-orange-500 rounded-sm mx-2 px-3"
             small
            />
        </td>
<!-- v-if="client.assigned_enq>0" -->
  <!-- <small v-if="client.other_count>0">
          <button class="border-2  bg-red-400 rounded-sm px-2 " style="margin-top:7px; margin-left:15px"  @click="onReassign(client.id,client.my_enq,couns)">reassign</button>
         </small>  -->
        
         <td data-label="My Enq" class="text-center">
          <small >
              <jb-button 
              v-if="client.totalstudents>0"
           :label="`${client.totalstudents}`"
            @click="onBatchName(client.id)" 
             color="info"
             outline
            small
            class="px-1 text-white"
            />
        <jb-button 
            v-else
           :label="`${client.totalstudents}`"
             color="info"
             outline
            small
            class="px-1 text-white cursor-not-allowed"
            />
          </small>
        </td>

         <td data-label="Total Called" class="text-center">
              <small>
            <jb-button 
            v-if="client.Calledcount>0"
           :label="`${client.Calledcount}`"
            @click="onTotalCalled(client.id)" 
             color="info"
             outline
            small
            class="px-1 text-white"
            />
        <jb-button 
            v-else
           :label="`${client.Calledcount}`"
             color="info"
             outline
            small
            class="px-1 text-white cursor-not-allowed"
            />
          </small>
        </td>

         <td data-label="Not Called" class="text-center">
              <small  v-if="client.notcalledcount>0">
                <jb-button 
           :label="`${client.notcalledcount}`"
            @click="onNotCalled(client.id)"
             color="info"
             outline
            small
            class="px-1 text-white"
            /><!-- <router-link :to="`/notstart1/` +`${client.id}` + `&`  +`not_called`+`&` + `${redirect1}`"> -->
            <br>
            <button class="border bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 rounded-sm px-3 mt-1" @click="onShare(client.id,client.notcalledcount,client.branch,client.userid)">share</button>
      </small>
           <small  v-else>
                <jb-button 
           :label="`${client.notcalledcount}`"
             color="info"
             outline
            small
            class="px-1 text-white cursor-not-allowed"
            />
             <br>
          
      </small>
    <!-- <button class="border bg-blue-600 mx-2 px-3"  style="margin-top:7px; margin-left:15px" @click="onAuthor(client.id)">shared</button> -->          
        </td>


         <td data-label="Coming" class="text-center">
         <small>
             <jb-button 
             v-if="client.coming_count>0"
           :label="`${client.coming_count}`"
            @click="onComing(client.id)"
             color="info"
             outline
            small
            class="px-1 text-white"
            /> 
               <jb-button 
             v-else
           :label="`${client.coming_count}`"
             color="info"
             outline
            small
            class="px-1 text-white cursor-not-allowed"
            />   
          </small>
        </td>

         <td data-label="Not interested" class="text-center">
          <small  class="text-gray-500 dark:text-gray-300 font-semibold capitalize pl-[24px] cursor-pointer"  >
          <jb-button 
             v-if="client.notintrested>0"
           :label="`${client.notintrested}`"
          @click="onNotInterested(client.id)"
             color="info"
             outline
            small
            class="px-1 text-white"
            /> 
               <jb-button 
             v-else
           :label="`${client.notintrested}`"
             color="info"
             outline
            small
            class="px-1 text-white cursor-not-allowed"
            />   
          </small> 
        </td>
        
         <td data-label="CB-NR-SW" class="text-center">
        <small>
          <jb-button 
             v-if="client.callback>0"
           :label="`${client.callback}`"
         @click="onCallBack(client.id)"
             color="info"
             outline
            small
            class="px-1 text-white"
            /> 
               <jb-button 
             v-else
           :label="`${client.callback}`"
             color="info"
             outline
            small
            class="px-1 text-white cursor-not-allowed"
            />            
          </small>        
        </td>

         <td data-label="Next Batch" class="text-center">
          <small>
            <jb-button 
             v-if=" client.Nextbatchcount >0"
           :label="`${ client.Nextbatchcount }`"
         @click="onNextBatch(client.id)"
             color="info"
             outline
            small
            class="px-1 text-white"
            /> 
               <jb-button 
             v-else
           :label="`${ client.Nextbatchcount }`"
             color="info"
             outline
            small
            class="px-1 text-white cursor-not-allowed"
            />    
          </small>     
        </td>

         <td data-label="coming" class="text-center">
              <small>
              <jb-button 
             v-if=" client.joined_count >0"
           :label="`${ client.joined_count }`"
          @click="onJoined(client.id)"
             color="info"
             outline
            small
            class="px-1 text-white"
            /> 
            <jb-button 
             v-else
           :label="`${client.joined_count }`"
             color="info"
             outline
            small
            class="px-1 text-white cursor-not-allowed"
            /> 
              </small>
          </td>

            <td data-label="other Status" class="text-center">
              <small>    
            <jb-button 
             v-if="client.joined_otherstatus>0"
           :label="`${ client.joined_otherstatus }`"
          @click="onOtherJoined(client.id)"
             color="info"
             outline
            small
            class="px-1 text-white"
            /> 
            <jb-button 
             v-else
           :label="`${client.joined_otherstatus }`"
             color="info"
             outline
            small
            class="px-1 text-white cursor-not-allowed"
            /> 
              </small>
             </td>

          <td data-label="Not Joined" class="text-center">
          <small>
          <jb-button 
             v-if="client.notjoined_count>0"
           :label="`${client.notjoined_count}`"
          @click="onNotJoined(client.id)"
             color="info"
             outline
            small
            class="px-1 text-white"
            /> 
            <jb-button 
             v-else
           :label="`${client.notjoined_count}`"
             color="info"
             outline
            small
            class="px-1 text-white cursor-not-allowed"
            /> 
          </small> 
         <!-- class="bg-blue-500 border-blue-500 hover:bg-blue-400 
               hover-border-blue-400 text-white rounded-sm border py-1 px-2 text-center"       -->
        </td>
      </tr>
    </tbody>

  </table>
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
    

</template>
