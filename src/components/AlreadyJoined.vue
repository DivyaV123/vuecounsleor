<script setup>
import { computed, reactive, ref } from "vue";
import {
  mdiEye,
  mdiTrashCan,
  mdiLifebuoy,
  mdiBookEducation,
  mdiPlusBox,
  mdiMicrophone,
  mdiEmail,
  mdiExclamationThick,
  mdiAccountSearch,
} from "@mdi/js";
import ModalBox from "@/components/ModalBox.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import ModalNumberRecord from "@/components/ModalNumberRecord.vue";
import ModalEnquiryRecord from "@/components/ModalEnquiryRecord.vue";
import ModalChangeStatus from "@/components/ModalChangeStatus.vue";
import ModalAlreadyJoined from "@/components/ModalAlreadyJoined.vue";
import ModalCourse from "./ModalCourse.vue";
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const theme = themeStore();
const router = useRouter();
const counselor = counselorStore();

// const props = defineProps({
//   enqs: Array,
//   enqsCount: Number,
//   checkable: Boolean,
//   perPage: {
//     type: Number,
//     default: 25,
//   },
// });

const perPage = 50;
const checkable = ref(false);
const pageLoading = ref(false)
const lightBorderStyle = computed(() => theme.lightBorderStyle);

const lightBgStyle = computed(() => theme.lightBgStyle);

const tableTrStyle = computed(() => theme.tableTrStyle);

const tableTrOddStyle = computed(() => theme.tableTrOddStyle);

const darkMode = computed(() => theme.darkMode);

const itemsPaginated = computed(() => {
  if(counselor.alreadyJoined && counselor.alreadyJoined.items){
      return counselor.alreadyJoined.items
  } 
}
);
const itemsCount = computed(() => {
  if(counselor.alreadyJoined && counselor.alreadyJoined.total){
      return counselor.alreadyJoined.total
  } 
}
);

const confirmRefresh = async () => {
  pageLoading.value = true
  await counselor.getAlreadyJoined();
  pageLoading.value = false
};
const propValues = reactive({
  id: 0,
  name: "",
  enquiry: false,
  highest_degree: {},
  courses: [],
});

const isModalAJActive = ref(false);

const openAJModal = (id, name) => {
  isModalAJActive.value = true;
  propValues.id = id;
  propValues.name = name;
};


const isModalStatusActive = ref(false);

const openStatusModal = (id, name) => {
  isModalStatusActive.value = true;
  propValues.id = id;
  propValues.name = name;
};

const isModalRecordActive = ref(false);

const openRecordModal = (number, name) => {
  isModalRecordActive.value = true;
  propValues.id = number;
  propValues.name = name;
};



const enquiryRecordModal = (number, name) => {
  isEnquiryRecordActive.value = true;
  propValues.id = number;
  propValues.name = name;
};

const isEnquiryRecordActive = ref(false);

const currentPage = ref(1);

const checkedRows = ref([]);

const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*");
};
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
  await counselor.getAlreadyJoined(page);
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


const update=reactive({
  id:"",
  name:""
})
const isModalCourseActive = ref(false);

const openCourseModal = (id, name) => {
  isModalCourseActive.value = true;
  update.id = id;
  update.name = name;
};


</script>

<template>
  <modal-change-status v-if="isModalStatusActive" v-model="isModalStatusActive"
    :title="'Change status of ' + propValues.name" :id="propValues.id"
    @confirm="confirmRefresh" has-cancel>
  </modal-change-status>
  <modal-already-joined v-if="isModalAJActive" v-model="isModalAJActive"
    :title="'Add already joined of ' + propValues.name" :id="propValues.id" @confirm="confirmRefresh" has-cancel>
  </modal-already-joined>
    <modal-number-record v-if="isModalRecordActive" v-model="isModalRecordActive"
    :title="'Call record details of ' + propValues.name" :id="propValues.id" has-cancel>
  </modal-number-record>
  <modal-enquiry-record v-if="isEnquiryRecordActive" v-model="isEnquiryRecordActive"
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
        <th class="text-center">Contact</th>
        <th class="text-center">Audio</th>
        <th class="text-center">Status</th>
        <th class="text-center">Call Duration</th>
        <th class="text-center">DateTime</th>
        <!-- <th>Actions</th> -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="(client, index) in itemsPaginated" :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
        <checkbox-cell v-if="checkable" @checked="checked($event, client)" />
                <td data-label="Contact" class="text-center">
          <small class="text-gray-500 dark:text-gray-300">
            <a class="" :href="'tel:' + client.CallRecord.name">
              {{client.CallRecord.code+(client.CallRecord.name)}}
              <!-- // maskNumber(client.CallRecord.name) -->
            </a>
            &nbsp;
          </small>
        </td>
        <td data-label="Audio" class="text-center">
          <small v-if="client.CallRecord.record" class="text-gray-500 dark:text-gray-300 font-semibold">
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
        <td data-label="Status" class="text-center">
          <span class="pr-2">
          <small v-if="client.CallRecord.status" class="text-gray-400 dark:text-gray-300 font-semibold">
            {{client.CallRecord.status.name}}
          </small>
          <small v-else class="text-gray-400 dark:text-gray-400 font-semibold">No status</small>
          </span>
          <small class="text-gray-300 dark:text-gray-200">
          <jb-button label="Change status" color="info" small class="mr-1 mb-1" @click="openStatusModal(client.CallRecordID, client.CallRecord.name)" />
          </small>
        </td>

     

        <td data-label="Call Duration" class="text-center">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.CallRecord.duration }}
          </small>
        </td>
        <td data-label="DateTime" class="text-center">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ dayjs(client.CallRecord.time).utc().format("DD-MMM-YY hh:mm A") }}
          </small>
        </td>

        <!-- <td data-label="Actions">
          <small class="text-gray-500 dark:text-gray-300">
            <jb-button label="Already joined" color="orange" @click="openAJModal(client.CallRecordID, client.CallRecord.name)" small class="mr-1 mb-1" />
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