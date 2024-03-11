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
  mdiAccountBadgeOutline,
  mdiSwapHorizontal
} from "@mdi/js";
import ModalBox from "@/components/ModalBox.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import ModalOnline from "@/components/ModalOnline.vue";
import ModalChangeStatus from "@/components/ModalChangeStatus.vue";
import ModalNumberRecord from "@/components/ModalNumberRecord.vue";
import ModalEnquiryRecord from "@/components/ModalEnquiryRecord.vue";
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

const perPage = 25;
const checkable = ref(false);
const pageLoading = ref(false)
const lightBorderStyle = computed(() => theme.lightBorderStyle);

const lightBgStyle = computed(() => theme.lightBgStyle);

const tableTrStyle = computed(() => theme.tableTrStyle);

const tableTrOddStyle = computed(() => theme.tableTrOddStyle);

const darkMode = computed(() => theme.darkMode);

const itemsPaginated = computed(() => {
    if(counselor.needOnline && counselor.needOnline.items){
        return counselor.needOnline.items
    } 
}
);
const itemsCount = computed(() => {
    if(counselor.needOnline && counselor.needOnline.total){
        return counselor.needOnline.total
    } 
}
);

const confirmRefresh = async () => {
  pageLoading.value = true
  await counselor.getNeedOnline();
  pageLoading.value = false
};
const propValues = reactive({
  sid: 0,
  id: 0,
  name: "",
  enquiry: false,
  highest_degree: {},
  courses: [],
  record:[]
});

const isModalStatusActive = ref(false);

// const openStatusModal = (client) => {
//   if (client.enquiry && client.enquiry.name) {
//     propValues.name = client.enquiry.name;
//     propValues.enquiry = true
//   }
//   else {
//     propValues.name = client.number;
//     propValues.enquiry = false
//   }
//   isModalStatusActive.value = true;
//   propValues.id = client.id;

// };


const openStatusModal = (id, name) => {
  isModalStatusActive.value = true;
  propValues.id = id;
  propValues.name = name;
};

const isModalOnlineActive = ref(false);

const openOnlineModal = (id, name, courses, sid) => {
  isModalOnlineActive.value = true;
  propValues.id = id;
  propValues.name = name;
  propValues.courses = courses;
  propValues.sid = sid;
};

const isModalRecordActive = ref(false);

const openRecordModal = (number, name) => {
  isModalRecordActive.value = true;
  propValues.id = number;
  propValues.name = name;
};



const enquiryRecordModal = (number, name,record) => {
  isEnquiryRecordActive.value = true;
  propValues.id = number;
  propValues.name = name;
  propValues.record=record;
};

const isEnquiryRecordActive = ref(false);


const currentPage = ref(0);

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

const currentPageHuman = computed(() => currentPage.value + 1);

const pageChange = async (page) => {
  pageLoading.value = true
  currentPage.value = page;
  await counselor.getNeedOnline(page);
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
  <modal-online v-if="isModalOnlineActive" v-model="isModalOnlineActive"
    :title="'Move course to online for ' + propValues.name" :id="propValues.id" :courses="propValues.courses"
    :sid="propValues.sid" @confirm="confirmRefresh" has-cancel>
  </modal-online>
  <modal-change-status v-if="isModalStatusActive" v-model="isModalStatusActive"
    :title="'Change status of ' + propValues.name" :id="propValues.id"
    @confirm="confirmRefresh" has-cancel>
  </modal-change-status>
  <!--  :enquiry="propValues.enquiry" -->
  <modal-number-record v-if="isModalRecordActive" v-model="isModalRecordActive"
    :title="'Call record details of ' + propValues.name" :id="propValues.id" has-cancel>
  </modal-number-record>
  <modal-enquiry-record v-if="isEnquiryRecordActive" v-model="isEnquiryRecordActive"
    :title="'Call record details of ' + propValues.name" :id="propValues.id" :records="propValues.record" has-cancel>
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
        <th class="text-center">Name</th>
        <th class="text-center">Contact</th>
        <th class="text-center">Audio</th>
        <th class="text-center">Course-Modeofclass</th>
        <th class="text-center">Timings</th>
        <th class="text-center">Record</th>
        <th class="text-center">Email</th>
        <th class="text-center">DOE & Time</th>
        <th class="text-center">Status</th>
        <th class="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(client, index) in itemsPaginated" :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
        <checkbox-cell v-if="checkable" @checked="checked($event, client)" />
        <td data-label="Name" class="text-center">
          <!-- <small class="font-semibold">
            <span v-if="
              client.enquiry.fresher_experienced &&
              client.enquiry.fresher_experienced.name === 'Experienced'
            " class="text-orange-400">
              {{ client.enquiry.name }}
              <span v-if="client.enquiry.enquiree_name">({{ client.enquiry.enquiree_name }})</span>
            </span>
            <span v-else-if="client.enquiry.experienced" class="text-sky-400">
              {{ client.enquiry.name }}
              <span v-if="client.enquiry.enquiree_name">({{ client.enquiry.enquiree_name }})</span>
            </span>
            <span v-else class="text-gray-500 dark:text-gray-300">
              {{ client.enquiry.name }}
              <span v-if="client.enquiry.enquiree_name">({{ client.enquiry.enquiree_name }})</span>
            </span>
          </small> -->
 
          <small v-if="client.Enquiry" class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.Enquiry.name }}
            <span v-if="client.Enquiry.enquiry && client.Enquiry.enquiry.enq_for_someone === true">({{ client.Enquiry.enquiry.enquiree_name }})</span>
          </small>
        </td>
        <td data-label="Contact" class="text-center">
          <span v-for="(contact, i) in client.Enquiry.contact" :key="i">
            <small class="text-gray-500 dark:text-gray-300">
              <a class="" :href="'tel:' + contact.code + contact.number">
                {{(contact.code + contact.number)}}
                  <!-- // maskNumber(contact.code + contact.number) -->
              </a>
              &nbsp;
            </small>
          </span>
        </td>
        <td data-label="Audio" class="text-center">
          <small
            v-if="client.record"
            class="text-gray-500 dark:text-gray-300 font-semibold"
          >
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
        <td data-label="Course" class="text-center">
          <span v-for="(course, i) in client.Enquiry.courses" :key="i">
            <small v-if="course.course" class="text-gray-100 dark:text-gray-200">
              {{ course.course.name }}
              <span class="text-lime-200"> - {{ course.mode_class.name }}</span>
              <!-- <span class="text-gray-500 dark:text-gray-300"> - {{ dayjs(course.agreed_date).format("DD-MMM-YY") }}</span> <br/> -->
            </small>
          </span>
        </td>
        <td data-label="Timings">
          <small v-if="client.Enquiry.enquiry">
            <span v-if="client.Enquiry.enquiry.class_timing" class="text-amber-100"> 
              {{ client.Enquiry.enquiry.class_timing.name }}
            </span>
            <span class="text-neutral-300" v-for="(ts, i) in client.Enquiry.enquiry.time_slot" :key="i">
              - {{ ts.name }} 
            </span>
          </small>
        </td>
        <td data-label="Record" class="text-center">
          <button v-if="client.Enquiry && client.Enquiry.id" @click="enquiryRecordModal(client.Enquiry.id, client.Enquiry.name,client.Enquiry.Recs)">
            <icon :path="mdiMicrophone" size="21" class="text-sky-500 dark:text-sky-400 hover:text-sky-200 hover:dark:text-sky-200 hover:bg-slate-800 rounded-xl" />
          </button>
          <button v-else @click="openRecordModal(client.number, client.number)">
            <icon :path="mdiMicrophone" size="21" class="text-sky-500 dark:text-sky-400 hover:text-sky-200 hover:dark:text-sky-200 hover:bg-slate-800 rounded-xl" />
          </button>

          <!-- <jb-button v-if="client.Enquiry && client.Enquiry.id" :label="client.records" color="info"
            :icon="mdiMicrophone" small @click="enquiryRecordModal(client.Enquiry.id, client.Enquiry.name,client.Enquiry.Recs)" />
          <jb-button v-else :label="client.records" color="info" :icon="mdiMicrophone" small
            @click="openRecordModal(client.number, client.number)" /> -->
        </td>

        <td data-label="Email" class="text-center">
          <span class="mr-1" v-for="(email, i) in client.Enquiry.email" :key="i">
            <small class="text-gray-500 dark:text-gray-300">
              <a class="" :href="'mailto:' + email.email">
                <jb-button color="warning" :icon="mdiEmail" small />
              </a>
            </small>
          </span>
        </td>
        <td data-label="Date of Enquiry" class="text-center">
          <small class="text-gray-500 dark:text-gray-300 font-semibold" v-if="client.Enquiry&&client.Enquiry.id!=0">
            {{ dayjs(client.Enquiry.created).format("DD-MMM-YY hh:mm A") }}
          </small>
        </td>
        <td data-label="Status" class="text-center">
          <small
            v-if="client.status"
            class="text-gray-500 dark:text-gray-300 font-semibold"
          >
            {{ client.status.name }} 
            <span v-if="client.status.substatus"> - {{client.status.substatus.name}} </span>
            <!-- <span v-if="client.status.comment"> - {{client.status.comment}}</span> -->
          </small>
          <small v-else class="text-gray-400 dark:text-gray-400">No status</small>
        </td>
        <td data-label="Actions" class="text-center">
          <small class="text-gray-500 dark:text-gray-300 capitalize flex justify-center gap-1 flex-wrap">
            <jb-button 
              @click="openOnlineModal(client.Enquiry.id, client.Enquiry.name, client.Enquiry.courses)"
              label="Switch Online" class="font-bold" color="cyan" :icon="mdiAccountBadgeOutline" small />
            <jb-button 
            @click="openStatusModal(client.id, client.name)" label="Change Status" class="font-bold" color="orange" :icon="mdiSwapHorizontal" small />
          </small>
        </td>
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