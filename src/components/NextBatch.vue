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
import ModalNextBatch from "@/components/ModalNextBatch.vue";
import ModalChangeStatus from "@/components/ModalChangeStatus.vue";
import ModalNumberRecord from "@/components/ModalNumberRecord.vue";
import ModalEnquiryRecord from "@/components/ModalEnquiryRecord.vue";
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";

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

const itemsPaginated = computed(() => counselor.nextBatch);
const itemsCount = computed(() => counselor.nextBatchCount);

const confirmRefresh = async () => {
  pageLoading.value = true
  await counselor.getNextBatch();
  pageLoading.value = false
};
const propValues = reactive({
  id: 0,
  name: "",
  enquiry: false,
  highest_degree: {},
  courses: [],
});

const isNextBatchActive = ref(false);
const openNextBatchModal = (id, name, course) => {
  isNextBatchActive.value = true;
  propValues.id = id;
  propValues.name = name;
  propValues.courses = course;

};

const isModalStatusActive = ref(false);

const openStatusModal = (client) => {
  if (client.enquiry && client.enquiry.name) {
    propValues.name = client.enquiry.name;
    propValues.enquiry = true
  }
  else {
    propValues.name = client.number;
    propValues.enquiry = false
  }
  isModalStatusActive.value = true;
  propValues.id = client.id;

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
  await counselor.getNextBatch(page);
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
  <modal-next-batch v-if="isNextBatchActive" v-model="isNextBatchActive"
    :title="'Update Next Batch details of ' + propValues.name" :id="propValues.id" :courses="propValues.courses"
    @confirm="confirmRefresh" has-cancel>
  </modal-next-batch>
  <modal-change-status v-if="isModalStatusActive" v-model="isModalStatusActive"
    :title="'Change status of ' + propValues.name" :id="propValues.id" :enquiry="propValues.enquiry"
    @confirm="confirmRefresh" has-cancel>
  </modal-change-status>
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
  <table class="">
    <thead class="sticky top-0 z-[9] bg-gray-900">
      <tr>
        <th v-if="checkable" />
        <th>Name</th>
        <th>Contact</th>
        <th>Audio</th>
        <th>Course</th>
        <th>Record</th>
        <th>Email</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(client, index) in itemsPaginated" :key="client.enquiry.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
        <checkbox-cell v-if="checkable" @checked="checked($event, client)" />
        <td data-label="Name">
          <small class="font-semibold">
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
          </small>
        </td>
        <td data-label="Contact">
          <span v-for="(contact, i) in client.enquiry.contactnumber_set" :key="i">
            <small class="text-gray-500 dark:text-gray-300">
              <a class="" :href="'tel:' + contact.number">
                {{(contact.number)}}
                  <!-- // maskNumber(contact.number) -->
              </a>
              &nbsp;
            </small>
          </span>
        </td>
        <td>
          <small v-if="client.record" class="text-gray-500 dark:text-gray-300 font-semibold">
            <audio controls>
              <source :src="client.record.audio" type="audio/ogg" />
              Your browser does not support the audio tag.
            </audio>
          </small>
        </td>
        <td data-label="Course">
          <span v-for="(course, i) in client.enquiry.course" :key="i">
            <small class="text-gray-500 dark:text-gray-300">
              {{ course.name }} -
              <span v-if="client.enquiry.flexi_timing">{{ client.enquiry.class_timing }}</span>
              <span v-else class="text-orange-400" v-for="(ts, i) in client.enquiry.timeslot" :key="i">{{ ts.name }}
                &nbsp;</span>
              - {{ dayjs(course.agreed_date).format("DD-MMM-YY") }} <br />
            </small>
          </span>
        </td>
        <td data-label="Record">
          <button v-if="client.Enquiry && client.Enquiry.id" @click="enquiryRecordModal(client.enquiry.id, client.enquiry.name)">
            <icon :path="mdiMicrophone" size="21" class="text-sky-500 dark:text-sky-400 hover:text-sky-200 hover:dark:text-sky-200 hover:bg-slate-800 rounded-xl" />
          </button>
          <button v-else @click="openRecordModal(client.number, client.number)">
            <icon :path="mdiMicrophone" size="21" class="text-sky-500 dark:text-sky-400 hover:text-sky-200 hover:dark:text-sky-200 hover:bg-slate-800 rounded-xl" />
          </button>

          <!-- <jb-button v-if="client.enquiry && client.enquiry.id" :label="client.records" color="info"
            :icon="mdiMicrophone" small @click="enquiryRecordModal(client.enquiry.id, client.enquiry.name)" />
          <jb-button v-else :label="client.records" color="info" :icon="mdiMicrophone" small
            @click="openRecordModal(client.number, client.number)" /> -->
        </td>
        <td data-label="Email">
          <span class="mr-1" v-for="(email, i) in client.enquiry.emailid_set" :key="i">
            <small class="text-gray-500 dark:text-gray-300">
              <a class="" :href="'mailto:' + email.email">
                <jb-button color="warning" :icon="mdiEmail" small />
              </a>
            </small>
          </span>
        </td>
        <td data-label="Status">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.main_status_name }} -
            {{ client.sub_status_name }} -
            {{ client.comment }}
          </small>
        </td>
        <td data-label="Actions">
          <small class="text-gray-500 dark:text-gray-300">
            <jb-button label="Change agreed date" color="orange" small class="mr-1 mb-1"
              @click="openNextBatchModal(client.id, client.enquiry.name, client.enquiry.course)" />
            <jb-button label="Change status" color="info" small @click="openStatusModal(client)" class="mr-1 mb-1" />
          </small>
        </td>
      </tr>
    </tbody>
  </table>
  <div :class="lightBorderStyle" class="p-3 lg:px-6 border-t dark:border-gray-800">
    <level mobile>
      <jb-buttons>
        <jb-button v-for="page in pagesList" :key="page" :active-soft="page === currentPage" :label="page" addon
          :outline="darkMode" small no-focus-ring @click="pageChange(page)" />
      </jb-buttons>
      <small>Page {{ currentPage }} of {{ numPages }}</small>
    </level>
  </div>
</template>