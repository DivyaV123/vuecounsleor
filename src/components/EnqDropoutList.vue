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
import CheckRadioPicker from '@/components/CheckRadioPicker.vue'
import ModalNumberRecord from "@/components/ModalNumberRecord.vue";
import ModalEnquiryRecord from "@/components/ModalEnquiryRecord.vue";
import ModalChangeStatus from "@/components/ModalChangeStatus.vue";
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import { counselorStore } from "../stores/counselor";
import { sessionStore } from "../stores/session";
import Icon from "@/components/Icon.vue";
import ModalComment from "@/components/ModalComment.vue"
import DropoutRecords from "@/components/DropoutRecords.vue"
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import Popper  from "vue3-popper";
import Field from "@/components/Field.vue";
import ModalMsclcomment from "@/components/ModalMsclcomment.vue"
import Control from "@/components/Control.vue";

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
    if(counselor.enq_dropout && counselor.enq_dropout.items){
        return counselor.enq_dropout.items
    } 
}
);

const itemsCount = computed(() => {
    if(counselor.enq_dropout && counselor.enq_dropout.total){
        return counselor.enq_dropout.total
    } 
}
);

const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*");
};

const confirmRefresh = async () => {
  pageLoading.value = true
  // await counselor.getEnqDropout(currentPage.value-1);
  // if(s){
  // await counselor.getEnqDropout(currentPage.value-1,s);
  //   }
  //   else{
      await counselor.getEnqDropout(currentPage.value-1);
    // }
  // if(itemsPaginated&&itemsPaginated.value.length==0){
  // await counselor.getCallBack(currentPage.value-1);
  // }
  pageLoading.value = false 
};
const propValues = reactive({
  id: 0,
  name: "",
  enquiry: false,
  highest_degree: {},
  courses: [],
  records: [],
});

const isModalStatusActive = ref(false);

const openStatusModal = (id, name) => {
  // if (client.enquiry && client.enquiry.name) {
  //   propValues.name = client.enquiry.name;
  //   propValues.enquiry = true
  // }
  // else {
  //   propValues.name = client.number;
  //   propValues.enquiry = false
  // }
  isModalStatusActive.value = true;
  // propValues.id = client.id;
  propValues.id = id;
  propValues.name = name;
  propValues.commentdata="dropout enq"

};
const isModalRecordActive = ref(false);
const isModalComment= ref(false);
const isModaldropoutComment= ref(false);


const commentmodal =(id,name)=>{
  isModalComment.value=true;
  propValues.commentid=id;
  propValues.commentname=name;
  propValues.commentdata="dropout enq"
}

const dropoutcomment=(id,name)=>{
  isModaldropoutComment.value=true;
  propValues.commentid=id;
  propValues.commentname=name;
  propValues.commentdata="Dropout comment"
}

const openRecordModal = (id, name) => {
  // if (records) {
  isModalRecordActive.value = true;
  propValues.id = id;
    propValues.name = name;
  // } else {
  //   theme.pushMessage("No record Found!");
  // }
};
const radioOptions = { 1: "Yes", 2: "No" }
const enquiryRecordModal = (number, name) => {
  isEnquiryRecordActive.value = true;
  propValues.id = number;
  propValues.name = name;
};

function showName(name, courses){
  if(courses){
    let brs = user.author.branches
  for(var i = 0;i < courses.length;i++){
  let found = false
  found = brs.some(el => el.id === courses[i].branch.id);
    if(found){
      return "("+name+")"
    }
  }   
  }
}

const isEnquiryRecordActive = ref(false);

const search = ref('')
const name = ref('')
const main_status = [{"id":1,"name":"Enquiry"},{"id":2,"name":"Follow up"}]

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

var s = ""
const pageChange = async (page) => {
  pageLoading.value = true
  currentPage.value = page + 1;
      // if(search.value) {
      //   s += "&main_status="+search.value.id
      // }
      // if(name.value) {
      //   s += "&name="+name.value
      // }
  await counselor.getEnqDropout(page);
  pageLoading.value = false
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
};
const confirm = async() => {
  if(search.value || name.value){
      pageLoading.value = true
      var s = ""
      if(search.value) {
        s += "&main_status="+search.value.id
      }
      if(name.value) {
        s += "&name="+name.value
      }
      await counselor.getEnqDropout(0,s);
      pageLoading.value = false
  }
}
const clear = async() => {
  if(search.value || name.value){
      pageLoading.value = true
      search.value = ''
      name.value = ''
      currentPage.value=0
      await counselor.getEnqDropout(0);
      pageLoading.value = false
  }
  
}
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


const commentdata=ref([])
const returndata=ref([])

const datahover=async(a,b)=>{
  commentdata.value=[]
  returndata.value=[]

const branchid=ref(null)
const setid=ref(null)
  b.filter(branch=>{
    if(branch.authorbranch){
      branch.authorbranch.filter(data=>{
        a.filter(set=>{
          if(data.id==set.id){
            if( branch.role=='counselor'){
              commentdata.value.push(branch)
              data=[],
              branch=[]
            }
          }
          })   
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
  <!-- <modal-number-record v-if="isModalRecordActive" v-model="isModalRecordActive"
    :title="'Call record details of ' + propValues.name" :id="propValues.id" has-cancel>
  </modal-number-record> -->
  <dropout-records v-if="isModalRecordActive" v-model="isModalRecordActive"
    :title="'Call record details of ' + propValues.name" :id="propValues.id"  :name="propValues.name" has-cancel>
  </dropout-records>
 
   
  <modal-msclcomment
    v-if=" isModaldropoutComment"
    v-model=" isModaldropoutComment"
    :title="'Add comment ' + propValues.commentname"
    :id="propValues.commentid"
    :commentdata="propValues.commentdata"
    @confirm="confirmRefresh"
    has-cancel
  >
  </modal-msclcomment>
  <modal-comment
    v-if="isModalComment"
    v-model="isModalComment"
    :title="'Add comment ' + propValues.commentname"
    :id="propValues.commentid"
    :commentdata="propValues.commentdata"
    @confirm="confirmRefresh"
    has-cancel
  >
  </modal-comment>
  <modal-enquiry-record v-if="isEnquiryRecordActive" v-model="isEnquiryRecordActive"
    :title="'Call record details of ' + propValues.name" :id="propValues.id" has-cancel>
  </modal-enquiry-record>
  <!-- <modal-change-status v-if="isModalStatusActive" v-model="isModalStatusActive"
    :title="'Change status of ' + propValues.name" :id="propValues.id"
    @confirm="confirmRefresh" has-cancel>
  </modal-change-status> -->

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


  <table class="mt-[10px]">
    <thead class="sticky top-[71px] z-[1] bg-gray-900">
      <tr>
        <th v-if="checkable" />
        <th >Contact</th>
        <th class="text-center">Audio</th>
        <!-- <th class="text-center">Status</th> -->
        <th class="text-center">Call Duration</th>
        <th class="text-center">Record</th>
        <th class="text-center">DateTime</th>
        <th class="text-center">Comments</th>
        <th class="text-center">Actions</th>
      </tr>
    </thead>
        <tbody>
      <tr v-for="(client, index) in itemsPaginated" :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
        <checkbox-cell v-if="checkable" @checked="checked($event, client)" />
        <td data-label="Contact">
          <small class="text-gray-500 dark:text-gray-300">
            <a class="" :href="'tel:' + client.code + client.name">
             {{client.code + client.name}}
             <span v-if="client.ename " class="text-red-300 font-semibold">{{ showName(client.ename, client.courses) }}</span>
              <!-- // maskNumber(client.code + client.name) -->
            </a>
            &nbsp;

          </small>
        </td>
        <td data-label="Audio" class="text-center">
          <small v-if="client.record" class="text-gray-500 dark:text-gray-300 font-semibold">
            <audio
              :src="`https://gotest.qspiders.com/records/${client.record}`"
              controls
              controlsList="nodownload"
              class="w-60 h-8 mx-auto"
            >
              Your browser does not support the audio element.
            </audio>
          </small>
        </td>
        <!-- <td data-label="Status" class="text-center">
          <span class="pr-2">
          <small v-if="client.status" class="text-gray-400 dark:text-gray-300 font-semibold">
            {{client.status.name}}
          </small>
          <small v-else class="text-gray-400 dark:text-gray-400 font-semibold">No status</small>
          </span>
          <small class="text-gray-300 dark:text-gray-200">
          <jb-button label="Change status" color="info" small class="mr-1 mb-1" @click="openStatusModal(client.id, client.name)" />
          </small>
        </td> -->
        <td data-label="Call Duration" class="text-center">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.duration }}
          </small>
        </td>

        <td data-label="Record" class="text-center">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            <button @click="openRecordModal(client.id, client.name)">
          <icon :path="mdiMicrophone" size="21" class="text-sky-500 dark:text-sky-400 hover:text-sky-200 hover:dark:text-sky-200 hover:bg-slate-800 rounded-xl" />
          </button>
          </small>
        </td>

        <td data-label="DateTime" class="text-center">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ dayjs(client.time).utc().format("DD-MMM-YY hh:mm A") }}
          </small>
        </td>

        <td data-label="Comments" class="text-center">
          <span class="text-gray-200 dark:text-gray-300" v-if="client.Enquiry.comment">
          <Popper hover placement="left">
            <button class="text-sm" @mouseover="datahover(user.user.branches,client.Enquiry.comment)" >Hover</button>
              <template #content>
                <span v-if="commentdata&&commentdata.length">
             
          
                <table class="bg-gray-900">
                <thead>
                  <th class=""><small>Name</small></th>
                  <th class=""><small>Comment</small></th>
                  <th class=""><small>Date</small></th>
                </thead>
                <tbody>
                  <tr
                    v-for="(cmt, index) in returndata"
                    :key="index"
                    :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
                  >
                  <!-- {{ cmt }} -->
                  <td data-label="Name" class="text-sm">{{ cmt.authorname }}</td>
                  <td data-label="Comment" class="text-sm text-orange-500">{{ cmt.comment }}</td>
                
                   <td data-label="Date">
                    <span class="text-sm">{{ dayjs(cmt.datetime).format('DD-MMM-YY hh:mm A') }}</span>
                  </td>
                  </tr>
                </tbody>
                </table>
              </span>
      <span v-else>
                 <span class="italic text-orange-500">no comments</span>
                </span>
              </template>
            </Popper>
            </span>
        </td>

        <td data-label="Actions" class="text-center">
          <small>
            <jb-button
                label="Comment"
                color="orange"
                small
                outline
                @click="commentmodal(client.Enquiry.id, client.name)"
                class="mr-1 mb-1 text-gray-300 text-xs py-1 hover:bg-transparent"
              />
          </small>
          &nbsp;
          <br/>
          <small class="mt-2">
            <jb-button
                label="Remove"
                color="danger"
                small
                @click="dropoutcomment(client.id, client.name)"
                class="mr-1 mb-1 text-white text-xs py-1 "
              />
          </small>
          </td>
        <!-- <td data-label="Actions">
          <small class="text-gray-300 dark:text-gray-200">
          <jb-button label="Follow Up" color="danger" small class="mr-1 mb-1"/>
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
  tbody tr:nth-child(even) {
  background-color: #151d2b !important;
}

tbody tr:hover{
  background-color: #303a49 !important;
}
  </style>