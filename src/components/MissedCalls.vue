<script setup>
import { computed, reactive, ref } from "vue";
import {
  mdiPlusBox,
  mdiMicrophone,
  mdiSwapHorizontal,
  mdiAccountPlus,
} from "@mdi/js";
import ModalBox from "@/components/ModalBox.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
// import MissCallRecord from "./MissCallRecord.vue";
import DropoutRecords from "@/components/DropoutRecords.vue"
import ModalNumberRecord from "@/components/ModalNumberRecord.vue";
import ModalChangeStatus from "@/components/ModalChangeStatus.vue";
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import { sessionStore } from "../stores/session";
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";
import dayjs from "dayjs";
import ModalMsclcomment from "@/components/ModalMsclcomment.vue"
import utc from 'dayjs/plugin/utc'
import Popper  from "vue3-popper";

dayjs.extend(utc)
const theme = themeStore();
const router = useRouter();
const counselor = counselorStore();
const user = sessionStore();

const lightBorderStyle = computed(() => theme.lightBorderStyle);

const lightBgStyle = computed(() => theme.lightBgStyle);

const tableTrStyle = computed(() => theme.tableTrStyle);

const tableTrOddStyle = computed(() => theme.tableTrOddStyle);

const darkMode = computed(() => theme.darkMode);

const items = computed(() => props.enqs);

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const checkable = ref(false);
const pageLoading = ref(false)

const itemsPaginated = computed(() => {
    if(counselor.missedCalls && counselor.missedCalls.items){
        return counselor.missedCalls.items
    } 
}
);
const itemsCount = computed(() => {
    if(counselor.missedCalls && counselor.missedCalls.total){
        return counselor.missedCalls.total
    } 
}
);

const isModalComment= ref(false);

const commentmodal =(id,name)=>{
  isModalComment.value=true;
  propValues.commentid=id;
  propValues.commentname=name,
  propValues.commentdata="online enq"
}

const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*");
};

const confirmRefresh = async () => {
  pageLoading.value = true
  await counselor.getMissedCalls(currentPage.value-1);
  pageLoading.value = false
};
const propValues = reactive({
  id: 0,
  name: "",
  highest_degree: {},
  courses: [],
  records: [],
  commentid:"",
  commentname:"",
  commentdata:""
});

const isModalRecord = ref(false);

const openRecordModal = (id, name,records) => {
  isModalRecord.value = true;
  propValues.id = id;
  propValues.name = name;
  propValues.records = records;
};

const isModalStatusActive = ref(false);

const openStatusModal = (id, name) => {
  isModalStatusActive.value = true;
  propValues.id = id;
  propValues.name = name;
};



// Pagination
const perPage = 50;
const currentPage = ref(1);
const checkedRows = ref([]);
const maxPages = ref(10);

const numPages = computed(() =>{ 
  if(itemsCount.value!=0){
    return Math.ceil(itemsCount.value / perPage)
  }
  });

const currentPageHuman = computed(() => currentPage.value);

const pageChange = async (page) => {
  pageLoading.value = true
  currentPage.value = page + 1;
  await counselor.getMissedCalls(page);
  pageLoading.value = false
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
};

const pagesList = computed(() => {
  let startPage;
  let endPage;
  if (currentPage.value < 1) {
    currentPage.value = 0;
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

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });

  return newArr;
};


const bdata=ref(false)
const commentdata=ref([])
const returndata=ref([])

const datahover=async(a,b)=>{
  commentdata.value=[]
  returndata.value=[]
  a.filter(set=>{
    if( b.details){
    b.details.filter(branch=>{
      if(branch.author.branches){
        branch.author.branches.filter(data=>{
          if(data.id==set.id){
            if( branch.role==='counselor'){
              commentdata.value.push(branch)
             
            }
            // data=[]
            
          }
          // 
          branch=[]
        })
      }
    })
  }
  })
 
  const reversedKeys = Object.keys(commentdata.value).reverse();
  reversedKeys.forEach(key => {
    returndata.value.push(commentdata.value[key])
});

}

</script>

<template>
    <!-- <miss-call-record v-if="isModalRecord" v-model="isModalRecord"
    :title="'Call record details of ' + propValues.name" :id="propValues.id" :records="propValues.records"
    @confirm="confirmRefresh" has-cancel>
  </miss-call-record> -->
  <dropout-records v-if="isModalRecord" v-model="isModalRecord"
    :title="'Call record details of ' + propValues.name" :id="propValues.id"  :name="propValues.name" has-cancel>
  </dropout-records>
  
   <modal-msclcomment
    v-if="isModalComment"
    v-model="isModalComment"
    :title="'Add comment ' + propValues.commentname"
    :id="propValues.commentid"
    :commentdata="propValues.commentdata"
    @confirm="confirmRefresh"
    has-cancel
  >
  </modal-msclcomment>
<!-- 
  <modal-number-record v-if="isModalRecordActive" v-model="isModalRecordActive"
    :title="'Call record details of ' + propValues.name" :id="propValues.id" has-cancel>
  </modal-number-record> -->
  <modal-change-status v-if="isModalStatusActive" v-model="isModalStatusActive"
    :title="'Change status of ' + propValues.name" :id="propValues.id" @confirm="confirmRefresh" has-cancel>
  </modal-change-status>

  <div v-if="checkedRows.length" class="bg-opacity-50 p-3 dark:bg-gray-800" :class="lightBgStyle">
    <span v-for="checkedRow in checkedRows" :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm dark:bg-gray-700" :class="lightBgStyle">
      {{ checkedRow.name }}
    </span>
  </div>
  <div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>
  <table class="mt-5">
    <thead class="sticky top-[71px] z-[1] bg-gray-900">
      <tr>
        <th v-if="checkable" />
        <th>Contact</th>
        <th>Time</th>
        <!-- <th>   <icon :path="mdiMicrophone" size="21"
              class="text-sky-500 dark:text-sky-400 hover:text-sky-200 hover:dark:text-sky-200 hover:bg-slate-800 rounded-xl" /></th> -->
        <th >Record</th>
        <th>Duration</th>
        <th>Status</th>
        <th>Comment</th>
        <th>Actions</th>
        <!-- <th>Escalation time left</th> -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="(client, index) in itemsPaginated" :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
        <checkbox-cell v-if="checkable" @checked="checked($event, client)" />
        <td data-label="Contact">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            <a class="" :href="'tel:' + client.code + client.name">
              {{(client.code + client.name)}}
              <span v-if="client.ename " class="text-red-300 font-semibold">({{ client.ename }})</span>
              <!-- // maskNumber(client.code + client.name) -->
            </a>
           
          </small>
        </td>
     
        <td data-label="Time">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ dayjs(client.time).utc().format("DD-MMM-YY hh:mm A") }}
          </small>
          
        </td>

        <td data-label="Record">
          <button @click="openRecordModal(client.id, client.name)">
            <icon :path="mdiMicrophone" size="21"
              class="text-sky-500 dark:text-sky-400 hover:text-sky-200 hover:dark:text-sky-200 hover:bg-slate-800 rounded-xl" />
          </button>
        </td>
         <!-- <td data-label="Record">
                <small

                  class="text-gray-500 dark:text-gray-300 font-semibold"
                >
                  <audio
                    :src="`https://gotest.qspiders.com/records/${client.record}`"
                    controls
                    controlsList="nodownload"
                    class="w-60 h-8"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </small>
              </td> -->
              <td data-label="Call Duration">
                <small class="text-gray-500 dark:text-gray-300 font-semibold">
                  {{ client.duration }}
                </small>
              </td>
              <td data-label="Status">
                <small
                  v-if="client.status&&client.status.name"
                  class="text-gray-500 dark:text-gray-300 font-semibold"
                >
                  {{ client.status.name }}
                  <span v-if="client.status.substatus&&client.status.substatus.name">
                    - {{ client.status.substatus.name }}
                  </span>
                  <!-- <span v-if="client.status.comment"> - {{client.status.comment}}</span> -->
                </small>
                <small
                  v-else
                  class="text-gray-400 dark:text-gray-400 font-semibold"
                  >No status</small
                >
              </td>
        <td data-label="Comments">  
          <!-- {{  client}}     -->
            <small class="text-gray-200 dark:text-gray-300" v-if="client">
              <Popper hover placement="left">
              <button @mouseover="datahover(user.user.branches,client)" >Hover</button>
              <template #content >

                <span v-if="commentdata&&commentdata.length">
               <p class="pb-1"  v-for="(com, i) in returndata" :key="i">
                  {{ com.message }} by <span class="italic text-orange-500">{{ com.author.name }}</span> 
                  <!-- added on <span class="italic text-orange-500">{{ com.date }}</span> -->
                </p>
              </span>
                <span v-else>
                 <span class="italic text-orange-500">no comments</span>
                </span>
              </template>
            </Popper>
          </small>
        </td>

        <td data-label="Actions" >
          <small class="text-gray-500 dark:text-gray-300 capitalize text-sm">
            <span >
              <jb-button
                label="Comment"
                color="orange"
                small
                outline
                @click="commentmodal(client.id, client.name)"
                class="mr-1 mb-1 text-gray-300 text-xs py-1 hover:bg-transparent"
              />
            </span>
          </small>
        </td>
        <!-- <td data-label="Escalation time left">
          <small v-if="dayjs(new Date()).diff(dayjs(client.time), 'day')" class="text-yellow-500  font-semibold">
          {{dayjs(new Date()).diff(dayjs(client.time), 'day')}} <span class="dark:text-gray-300">Days</span> 
          </small>
          <small v-else class="text-gray-500 dark:text-gray-300 font-semibold">
            {{dayjs(new Date()).diff(dayjs(client.time), 'hour')}} Hours
          </small>
        </td> -->
      </tr>
    </tbody>
  </table>
  <div :class="lightBorderStyle" class="p-3 lg:px-6 border-t dark:border-gray-800 sticky bg-[#151D2B] bottom-0 z-[9]">
    <level mobile>
      <jb-buttons>
        <jb-button v-for="page in pagesList" :key="page" :class="currentPage === page ? 'bg-gray-500' : ''" :active-soft="page === currentPage" :label="page" addon
          :outline="darkMode" small no-focus-ring @click="currentPage != page ? pageChange(page - 1) : ''" />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </level>
  </div>
</template>

<style>
:root {
   --popper-theme-background-color: #333333;
   --popper-theme-background-color-hover: #333333;
   --popper-theme-text-color: #ffffff;
   --popper-theme-border-width: 0px;
   --popper-theme-border-style: solid;
   --popper-theme-border-radius: 6px;
   --popper-theme-padding: 16px;
   --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
 }
</style>