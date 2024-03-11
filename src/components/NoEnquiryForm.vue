<script setup>
import { computed, reactive, ref } from "vue";
import {
  mdiPlusBox,
  mdiMicrophone,
  mdiSwapHorizontal,
  mdiAccountPlus,
  mdiTextBoxEdit
} from "@mdi/js";
import ModalBox from "@/components/ModalBox.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import ModalNumberRecord from "@/components/ModalNumberRecord.vue";
import ModalChangeStatus from "@/components/ModalChangeStatus.vue";
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import ModalCourse from "@/components/ModalCourse.vue";
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";
import dayjs from "dayjs";

import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const theme = themeStore();
const router = useRouter();
const counselor = counselorStore();

const lightBorderStyle = computed(() => theme.lightBorderStyle);

const lightBgStyle = computed(() => theme.lightBgStyle);

const tableTrStyle = computed(() => theme.tableTrStyle);

const tableTrOddStyle = computed(() => theme.tableTrOddStyle);

const darkMode = computed(() => theme.darkMode);

const items = computed(() => props.enqs);

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const checkable = ref(false);
const pageLoading = ref(false);

const itemsPaginated = computed(() => {
  if(counselor.noEnquiryForms && counselor.noEnquiryForms.items){
      return counselor.noEnquiryForms.items
  } 
}
);
const itemsCount = computed(() => {
  if(counselor.noEnquiryForms && counselor.noEnquiryForms.total){
      return counselor.noEnquiryForms.total
  } 
}
);

const addEnquiry = (id) => {
  router.push({ path: "/add-enquiry", query: { rid: id } });
};

const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*");
};

const confirmRefresh = async () => {
  pageLoading.value = true
  await counselor.getNoEnquiryForm();
  pageLoading.value = false
};
const propValues = reactive({
  id: 0,
  name: "",
  highest_degree: {},
  courses: [],
  callid:0
});

const isModalRecordActive = ref(false);

const openRecordModal = (number) => {
  isModalRecordActive.value = true;
  propValues.id = number;
  // propValues.name = name;
};

const isModalCourseActive = ref(false);

const openCourseModal = (id, name,rid) => {
  isModalCourseActive.value = true;
  propValues.id = id;
  propValues.name = name;
  propValues.callid = rid;

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
  await counselor.getNoEnquiryForm(page);
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
</script>

<template>
  <modal-number-record v-if="isModalRecordActive" v-model="isModalRecordActive"
    :title="'Call record details of ' + propValues.id" :id="propValues.id" has-cancel>
  </modal-number-record>
  <modal-change-status v-if="isModalStatusActive" v-model="isModalStatusActive"
    :title="'Change status of ' + propValues.name" :id="propValues.id"
    @confirm="confirmRefresh" has-cancel>
  </modal-change-status>
  <modal-course v-if="isModalCourseActive" v-model="isModalCourseActive"
    :title="'Update course details of ' + propValues.name" :id="propValues.id" :rid="propValues.callid" @confirm="confirmRefresh" has-cancel>
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
        <th class="text-center">Contact</th>
        <th class="text-center">Audio</th>
        <th class="text-center">Records</th>
        <th class="text-center">Status</th>
        <!-- <th class="text-center">Update</th> -->
        <th class="text-center">Call Duration</th>
        <th class="text-center">DateTime</th>
        <th class="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(client, index) in itemsPaginated" :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
        <checkbox-cell v-if="checkable" @checked="checked($event, client)" />
        <td data-label="Contact" class="text-center">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            <a class="" :href="'tel:' + client.code + client.name">
              {{client.code + client.name  }}
              <!-- {{ maskNumber(client.code + client.name) }} -->
            </a>
          </small>
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
        <td data-label="Records" class="text-center">
          <button @click="openRecordModal(client.name)">
            <icon :path="mdiMicrophone" size="21" class="text-sky-500 dark:text-sky-400 hover:text-sky-200 hover:dark:text-sky-200 hover:bg-slate-800 rounded-xl" />
          </button>
        </td>
        <td data-label="Status" class="text-center">
          <small>
            <jb-button label="Change Status" color="cyan" class="font-bold" :icon="mdiSwapHorizontal" small
              @click="openStatusModal(client.id, client.name)" />
          </small>
        </td>
        
        <!-- <td data-label="Update" class="text-center">
              <small class="text-gray-500 dark:text-gray-300 font-semibold" >
               <jb-button
               v-if="client.EnquiryID!=null"
                color="warning"
                label="U"
                small 
                :icon="mdiTextBoxEdit"
                @click="openCourseModal(client.EnquiryID, client.name,client.id)"
              />
              <jb-button
               v-else
                color="danger"
                label="U"
                small 
                :icon="mdiTextBoxEdit"
                class="cursor-not-allowed"
              />
              </small>
            </td> -->
        <td data-label="Call Duration" class="text-center">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.duration }}
          </small>
        </td>
        <td data-label="DateTime" class="text-center">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ dayjs(client.time).utc().format("DD-MMM-YY hh:mm A") }}
          </small>
        </td>
       
        <td data-label="Actions" class="text-center">
          <small>
          <jb-button
               v-if="client.EnquiryID!=null"
                color="success"
                label="Update"
                small 
                :icon="mdiTextBoxEdit"
                class="font-semibold"
                @click="openCourseModal(client.EnquiryID, client.name,client.id)"
              />
            </small> 
          <small v-if="client.EnquiryID==null">    
            <jb-button label="Add Enquiry"  color="amber" :icon="mdiAccountPlus" class="font-semibold" small @click="addEnquiry(client.id)" />
          </small>
          <!-- <small v-else>
            <jb-button label="Add Enquiry" class="font-bold cursor-not-allowed" color="danger" :icon="mdiAccountPlus" small/>
          </small> -->
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