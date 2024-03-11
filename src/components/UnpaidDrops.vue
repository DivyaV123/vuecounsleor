<script setup>
import { computed, reactive, ref } from "vue";
import {
  mdiPlusBox,
  mdiMicrophone,
  mdiSwapHorizontal,
  mdiAccountPlus,
  mdiEmail
} from "@mdi/js";
import ModalBox from "@/components/ModalBox.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import ModalNumberRecord from "@/components/ModalNumberRecord.vue";
import ModalCourse from "@/components/ModalCourse.vue";
import ModalAddDropComment from "@/components/ModalAddDropComment.vue";
import DropoutRecords from "@/components/DropoutRecords.vue"
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import Popper  from "vue3-popper";
import { sessionStore } from "../stores/session";


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
    if(counselor.unpaidDrops && counselor.unpaidDrops.items){
        return counselor.unpaidDrops.items
    } 
}
);
const itemsCount = computed(() => {
    if(counselor.unpaidDrops && counselor.unpaidDrops.total){
        return counselor.unpaidDrops.total
    } 
}
);


const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*");
};

const confirmRefresh = async () => {
  pageLoading.value = true
  if(currentPage.value!=0){
    await counselor.getUnpaidDropouts(currentPage.value-1);
  }  
  pageLoading.value = false
};
const propValues = reactive({
  id: 0,
  name: "",
  highest_degree: {},
  courses: [],
  commentdata:""
});

const isModalRecordActive = ref(false);

const openRecordModal = (number, name) => {
  isModalRecordActive.value = true;
  propValues.id = number; 
  propValues.name = name;
};

const isRecordModal = ref(false)
const record = Array({"id":null,
  "name":null,"enqid":null})
const openRecord = (id,name,enqid) => {
      record.id = id,
      record.name = name,
      record.enqid=enqid
      isRecordModal.value = true
    };

const isModalStatusActive = ref(false);

const openStatusModal = (id, name) => {
  isModalStatusActive.value = true;
  propValues.id = id;
  propValues.name = name;
  propValues.commentdata="dropout enq"

};  

const isModalCourseActive = ref(false);

const openCourseModal = (id, name) => {
  isModalCourseActive.value = true;
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
  currentPage.value = page + 1
  await counselor.getUnpaidDropouts(page)
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
const addEnquiry = (id,mail,contact) => {
  router.push({ path: "/add-enquiry", query: { id: id,name:"Dropout"} });
};


const commentdata=ref([])
const returndata=ref([])

const datahover=async(a,b)=>{
  commentdata.value=[]
  returndata.value=[]
const branchid=ref(null)
const setid=ref(null)
  b.filter(branch=>{
    if(branch.branches){
      branch.branches.filter(data=>{
        a.filter(set=>{
          if(data.id==set.id){
            if( branch.role=='counselor'){
              if(branch.type== "dropout enq"){
                commentdata.value.push(branch)
              // data=[],
              branch=[]
              }
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
  <modal-number-record v-if="isModalRecordActive" v-model="isModalRecordActive"
    :title="'Call record details of ' + propValues.name" :id="propValues.id" has-cancel>
  </modal-number-record>
  <dropout-records v-if="isRecordModal" v-model="isRecordModal"
    :title="'Call record details of ' + record.name" :id="record.id"  :record=record has-cancel>
  </dropout-records>
  <modal-add-drop-comment v-if="isModalStatusActive" v-model="isModalStatusActive"
    :title="'Add comment for ' + propValues.name" :id="propValues.id" :commentdata="propValues.commentdata" @confirm="confirmRefresh" has-cancel>
  </modal-add-drop-comment>
  <modal-course v-if="isModalCourseActive" v-model="isModalCourseActive"
    :title="'Add course details of ' + propValues.name" :id="propValues.id" @confirm="confirmRefresh" has-cancel>
  </modal-course>
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
        <th>Name</th>
        <th>Fresher/Exp</th>
        <th>Contact</th>
        <th>Course(s)</th>
        <th>Batch(es)</th>
        <th>Email</th>
        <th>Records</th>
        <th>Comment</th>
        <th>Actions</th>
        
      </tr>
    </thead>
    <tbody>
      <tr v-for="(client, index) in itemsPaginated" :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
        <checkbox-cell v-if="checkable" @checked="checked($event, client)" />
        <td data-label="Name" class="text-orange-500">
          {{ client.name }}
          <span v-if="client.enquiry_id">
            <jb-button class="ml-1" label="E" color="white" outline small/>
          </span>
        </td>
        <td data-label="Fresher/Exp">
          <small class="text-gray-500 dark:text-gray-300 font-semibold" v-if=" client.personaldetails &&client.personaldetails.fresherexp">
          {{ client.personaldetails.fresherexp.Name }}({{ client.personaldetails.highestyop }})
        </small>
        </td>
        <td data-label="Contact">
          <span class="mr-1" v-for="(num,i) in client.contact" :key="i">
          <small class="text-gray-500 dark:text-gray-100 font-semibold">
            <a class="" :href="'tel:' + num.code + num.number">
              {{(num.code + num.number)}}
            </a>
            <br/>
          </small>
          </span>
        </td>
        <td data-label="Course(s)">
          <jb-button v-if="client.enquiry_id" color="info" :icon="mdiPlusBox" outline small class="mr-1"
            @click="openCourseModal(client.enquiry_id, client.name)" />
          <span class="mr-1" v-for="(cr,i) in client.studentcourse" :key="i">
          <small  class="text-gray-500 dark:text-blue-300 font-semibold">
              {{ cr.name }}
              <br/>
              &nbsp;
          </small>
        </span>
        </td>
        <td data-label="Batch(es)">
          <span class="mr-1" v-for="(bt,i) in client.studentbatches" :key="i">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
              {{ bt.batchplan.name }}({{ bt.trainer.name }})
              <br/>
          </small>
          </span>
        </td>
        <td data-label="Email">
          <span class="mr-1" v-for="(email, i) in client.email" :key="i">
            <small class="text-gray-500 dark:text-gray-300 capitalize">
              <a class="" :href="'mailto:' + email.email">
                <jb-button color="warning" :icon="mdiEmail" small class="mt-1"/>
              </a>
            </small>
          </span>
        </td>
       
      
        <td data-label="Records" class="text-center">
          <button @click="openRecord(client.id, client.name, client.enquiry_id)" v-if="client.enquiry_id!=0&&client.records && client.records.length>0">
            <icon :path="mdiMicrophone" size="21" class="text-sky-500 dark:text-sky-400 hover:text-sky-200 hover:dark:text-sky-200 hover:bg-slate-800 rounded-xl" />
          </button>
          <button v-else>
            <icon :path="mdiMicrophone" size="21" class="cursor-not-allowed text-red-500 dark:text-red-400 hover:text-red-200 hover:dark:text-red-200 hover:bg-slate-800 rounded-xl" />
          </button>
        </td>
        <td data-label="Comments">
          <span class="text-gray-200 dark:text-gray-300" v-if="client.dropout_comments">
          <Popper hover placement="left">
            <button class="text-sm" @mouseover="datahover(user.user.branches,client.dropout_comments)" >Hover</button>
              <template #content>
                <span v-if="commentdata&&commentdata.length">
             
          
                <table class="bg-gray-900">
                <thead>
                  <th class=""><small>Name</small></th>
                  <th class=""><small>Reason</small></th>
                  <th class=""><small>Comment</small></th>
                  <th class=""><small>Date</small></th>
                </thead>
                <tbody>
                  <tr
                    v-for="(cmt, index) in returndata"
                    :key="index"
                    :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
                  >
                  <td data-label="Name" class="text-sm">{{ cmt.author.name }}</td>
                  <td data-label="Reason" class="text-sm">{{ cmt.dropdown.name }}</td>
                  <td data-label="Comment" class="text-sm text-orange-500">{{ cmt.comments }}</td>
                
                   <td data-label="Date">
                    <!-- <span  v-if="cmt.date.length>11">{{ dayjs(cmt.date).format('DD-MMM-YY hh:mm A') }}</span> -->
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
      
        <td data-label="Actions">
          <small>
            <jb-button label="Add Comment" color="success" class=" border border-green-700 text-neutral-100 hover:bg-green-700 font-medium" small @click="openStatusModal(client.id, client.name)" />
          </small>
          &nbsp;
          <br/>
          <small v-if="client.enquiry_id===0" >
            <jb-button label="Add Enquiry" color="orange"  class="font-bold mt-2" :icon="mdiAccountPlus" small @click="addEnquiry(client.id,client.email,client.contact)" />
          </small>
        </td>
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