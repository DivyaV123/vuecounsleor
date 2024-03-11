<script setup>
import { computed, ref, reactive } from "vue";
import {
  mdiPlusBox,
  mdiMicrophone,
  mdiAccountPlus,
  mdiLifebuoy,
} from "@mdi/js";
import ModalBox from "@/components/ModalBox.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import ModalEnquiryRecord from "@/components/ModalEnquiryRecord.vue";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";
import Popper  from "vue3-popper";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import { sessionStore } from "../stores/session";
import MoalEscComment from "@/components/MoalEscComment.vue";
const theme = themeStore();
const router = useRouter();
const counselor = counselorStore();
const user = sessionStore();
// const props = defineProps({
//   enqs: Array,
//   checkable: Boolean,
//   perPage: {
//     type: Number,
//     default: 25,
//   },
// });

dayjs.extend(utc)

const lightBorderStyle = computed(() => theme.lightBorderStyle);

const lightBgStyle = computed(() => theme.lightBgStyle);

const tableTrStyle = computed(() => theme.tableTrStyle);

const tableTrOddStyle = computed(() => theme.tableTrOddStyle);

const darkMode = computed(() => theme.darkMode);

const checkable = ref(false);
const pageLoading = ref(false)

const itemsPaginated = computed(() => {
    if(counselor.esclatedToMe && counselor.esclatedToMe.items){
        return counselor.esclatedToMe.items
    } 
}
);

const itemsCount = computed(() => {
    if(counselor.esclatedToMe && counselor.esclatedToMe.total){
        return counselor.esclatedToMe.total
    } 
}
);
const isModalComment= ref(false);
const commentmodal =(id,name)=>{
  isModalComment.value=true;
  propValues.commentid=id;
  propValues.commentname=name
  propValues.commentdata="EscToMe enq"

}
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


const propValues = reactive({
  id: 0,
  name: "",
  commentid:"",
  commentname:"",
  commentdata:""
});

const isModalRecordActive = ref(false);

const openRecordModal = (id, name) => {
  isModalRecordActive.value = true;
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

const maskNumber = (number) => {
  if(number){
  return number.replace(/\d(?=\d{4})/g, "*");
}};
const addEnquiry = () => {
  router.push("/add-enquiry");
};

const pageChange = async (page) => {
  pageLoading.value = true
  currentPage.value = page + 1;
  await counselor.getEscalatedToMe(page);
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

const confirmRefresh = async () => {
  pageLoading.value = true
  await counselor.getEscalatedToMe(currentPage.value-1);
  pageLoading.value = false
};

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });

  return newArr;
};
</script>

<template>
<MoalEscComment
    v-if="isModalComment"
    v-model="isModalComment"
    :title="'Add comment ' + propValues.commentname"
    :id="propValues.commentid"
    :commentdata="propValues.commentdata"
    @confirm="confirmRefresh"
    has-cancel
 />

  <modal-enquiry-record v-if="isModalRecordActive" v-model="isModalRecordActive"
    :title="'Call record details of ' + propValues.name" :id="propValues.id" has-cancel>
  </modal-enquiry-record>
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
        <th>Contact</th>
        <th>Course</th>
        <th>Branch</th>
        <th>Reason</th>
        <th>Audio</th>
        <th>Escalated by</th>
        <th>Comment</th>
        <th>DOE & Time</th>
         <th>Actions</th> 
        <!-- <th>Level</th> -->
        <!-- <th>Actions</th> -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="(client, index) in itemsPaginated" :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
        <checkbox-cell v-if="checkable" @checked="checked($event, client)" />
        <td data-label="Name">
          <small v-if="client.Enquiry" class="text-yellow-400 font-semibold">
            <!-- {{ maskNumber(client.enquiry_name) }} -->
            {{ client.Enquiry.name }}
            <span v-if="client.Enquiry.enquiry && client.Enquiry.enquiry.enq_for_someone === true">({{ client.Enquiry.enquiry.enquiree_name }})</span>
          </small>
        </td>
        <td data-label="Contact">
          <span v-if="client.Enquiry.contact && client.Enquiry.contact.length > 0">
          <span v-for="(contact, i) in client.Enquiry.contact" :key="i">
            <small class="text-gray-500 dark:text-gray-300">
              <a class="" :href="'tel:' + contact.code + contact.number">
                {{contact.code + contact.number}}
                  <!-- // maskNumber(contact.code + contact.number) -->
              </a>
              &nbsp;
            </small>
          </span>
          </span>
          <span v-else>
            <span v-if="client.CallRecord && client.CallRecord.name">
              <small class="text-gray-500 dark:text-gray-300">
              <a class="" :href="'tel:' + client.CallRecord.code + client.CallRecord.name">
                {{(client.CallRecord.code + client.CallRecord.name)}}
                  <!-- // maskNumber(client.CallRecord.code + client.CallRecord.name) -->
              </a>
              </small>
            </span>
          </span>
        </td>
        <td data-label="Course">
          <span v-for="(course, i) in client.Enquiry.courses" :key="i">
            <small v-if="course.course" class="text-gray-500 dark:text-gray-300">
              {{ course.course.name }} <br />
            </small>
          </span>
        </td>
        <td data-label="Branch">
          <span v-for="(branch, i) in client.Enquiry.courses" :key="i">
            <small v-if="branch.branch" class="text-gray-500 dark:text-gray-300">
              {{ branch.branch.name }} &nbsp;
            </small>
          </span>
        </td>
        <td data-label="Reason">
          <small v-if="client.escalations && client.escalations.reason" class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.escalations.reason.name }} <span v-if="client.escalations.comments"> - {{client.escalations.comments}} </span>
          </small>
        </td>
        <td data-label="Audio">
          <small
            v-if="client.CallRecord && client.CallRecord.record"
            class="text-gray-500 dark:text-gray-300 font-semibold"
          >
            <audio
              :src="`https://gotest.qspiders.com/records/${client.CallRecord.record}`"
              controls
              controlsList="nodownload"
              class="w-60 h-8 mx-auto"
            >
              Your browser does not support the audio element.
            </audio>
          </small>
        </td>
        <!-- <td data-label="Record">
          <jb-button :label="client.record" color="info" :icon="mdiMicrophone" small
            @click="openRecordModal(client.enquiry, client.enquiry_name)" />
        </td> -->
        <td data-label="Escalated by">
          <small v-if="client.author" class="text-teal-400 font-semibold">
            {{ client.author.name }}
          </small>
        </td>
    
        <td data-label="Comments">      
            <small class="text-gray-200 dark:text-gray-300" v-if="client.comments">
              <Popper hover placement="left">
              <button @mouseover="datahover(user.user.branches,client.comments)" >Hover</button>
              <template #content >
                <span v-if="commentdata&&commentdata.length">
                <p class="pb-1"  v-for="(com, i) in returndata" :key="i">
                  {{ com.comment }} by <span class="italic text-orange-500">{{ com.authorname }}</span> added on <span class="italic text-orange-500">{{ dayjs(com.date).format("DD-MM-YY hh:mm A") }}</span>
                </p>
              </span>
                <span v-else>
                 <span class="italic text-orange-500">no comments</span>
                </span>
              </template>
            </Popper>
          </small>
        </td>

        <td data-label="DOE">
          <small class="text-teal-400 font-semibold" v-if="client.Enquiry&&client.Enquiry.id!=0">
            {{ dayjs(client.Enquiry.created).format("DD-MMM-YY hh:mm A") }}
          </small>
           <small class="text-teal-400 font-semibold" v-else>
           {{ dayjs(client.CallRecord.time).utc().format("DD-MMM-YY hh:mm A") }}
          </small>
        </td>

        <td data-label="Actions">
          <span >
              <jb-button
                label="Comment"
                color="orange"
                small
                outline
                @click="commentmodal(client.id, client.Enquiry.name)"
                class="mr-1 mb-1 text-gray-300 text-xs py-1 hover:bg-transparent"
              />
            </span>
        </td>
        <!-- <td data-label="Level">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.escalated_level }}
          </small>
        </td> -->
        <!-- <td data-label="Actions">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            <jb-button label="Add Enquiry" color="info" :icon="mdiAccountPlus" small @click="addEnquiry" />
          </small>
        </td> -->
      </tr>
    </tbody>
  </table>
  <div :class="lightBorderStyle" class="p-3 lg:px-6 border-t dark:border-gray-800 sticky bg-[#151D2B] bottom-0 z-[9]">
    <level mobile>
      <jb-buttons>
        <jb-button v-for="page in pagesList" :key="page" :active-soft="page === currentPage" :label="page" addon
          :outline="darkMode" small no-focus-ring @click="pageChange(page)" />
      </jb-buttons>
      <small>Page {{ currentPage }} of {{ numPages }}</small>
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