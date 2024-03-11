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
import JbButtons from "@/components/JbButtons.vue";
import ModalEnquiryRecord from "@/components/ModalEnquiryRecord.vue";
import JbButton from "@/components/JbButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { themeStore } from "../stores/theme";
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";

const theme = themeStore();
const counselor = counselorStore();

// const props = defineProps({
//   enqs: Array,
//   checkable: Boolean,
//   perPage: {
//     type: Number,
//     default: 25,
//   },
// });

const lightBorderStyle = computed(() => theme.lightBorderStyle);

const lightBgStyle = computed(() => theme.lightBgStyle);

const tableTrStyle = computed(() => theme.tableTrStyle);

const tableTrOddStyle = computed(() => theme.tableTrOddStyle);

const darkMode = computed(() => theme.darkMode);

const perPage = 25;
const checkable = ref(false);
const pageLoading = ref(false)
const itemsPaginated = computed(() => counselor.esclatedByMe);
const itemsCount = computed(() => counselor.esclatedByMeCount);

const propValues = reactive({
  id: 0,
  name: "",
});

const isModalRecordActive = ref(false);

const openRecordModal = (id, name) => {
  isModalRecordActive.value = true;
  propValues.id = id;
  propValues.name = name;
};

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
  await counselor.getEscalatedByMe(page);
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
  <modal-enquiry-record
    v-if="isModalRecordActive"
    v-model="isModalRecordActive"
    :title="'Call record details of ' + propValues.name"
    :id="propValues.id"
    has-cancel
  >
  </modal-enquiry-record>

  <div
    v-if="checkedRows.length"
    class="bg-opacity-50 p-3 dark:bg-gray-800"
    :class="lightBgStyle"
  >
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm dark:bg-gray-700"
      :class="lightBgStyle"
    >
      {{ checkedRow.name }}
    </span>
  </div>
  <div v-if="pageLoading" wire:loading class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
	<div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
	<h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
	<p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
    </div>
    <table class="">
    <thead class="sticky top-[56px] z-[9] bg-gray-900">
      <tr>
        <th v-if="checkable" />
        <th>Name</th>
        <th>Contact</th>
        <th>Course</th>
        <th>Branch</th>
        <th>Reason</th>
        <th>Record</th>
        <th>Handled by</th>
        <th>Level</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(client, index) in itemsPaginated"
        :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
        <checkbox-cell v-if="checkable" @checked="checked($event, client)" />
        <td data-label="Name">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{(client.enquiry_name)}}
            <!-- {{ maskNumber(client.enquiry_name) }} -->
          </small>
        </td>
        <td data-label="Contact">
          <span v-for="(contact, i) in client.contact" :key="i">
            <small class="text-gray-500 dark:text-gray-300">
              <a class="" :href="'tel:' + contact.number">
                {{contact.number}}
                <!-- // maskNumber(contact.number) -->
              </a>
              &nbsp;
            </small>
          </span>
        </td>
        <td data-label="Course">
          <span v-for="(course, i) in client.course_enquiry" :key="i">
            <small class="text-gray-500 dark:text-gray-300">
              {{ course.name }} &nbsp;
            </small>
          </span>
        </td>
        <td data-label="Branch">
          <span v-for="(branch, i) in client.branches" :key="i">
            <small class="text-gray-500 dark:text-gray-300">
              {{ branch.display_name }} &nbsp;
            </small>
          </span>
        </td>
        <td data-label="Level">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.reason_name }}
          </small>
        </td>
        <td data-label="Record">
          <jb-button
            :label="client.record"
            color="info"
            :icon="mdiMicrophone"
            small
            @click="openRecordModal(client.enquiry, client.enquiry_name)"
          />
        </td>
        <td data-label="Handled by">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            <span v-if="client.attended">{{ client.author_name }}</span>
            <span v-else>Not handled</span>
          </small>
        </td>
        <td data-label="Level">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.escalated_level }}
          </small>
        </td>
      </tr>
    </tbody>
  </table>
  <div
    :class="lightBorderStyle"
    class="p-3 lg:px-6 border-t dark:border-gray-800"
  >
    <level mobile>
      <jb-buttons>
        <jb-button
          v-for="page in pagesList"
          :key="page"
          :active-soft="page === currentPage"
          :label="page"
          addon
          :outline="darkMode"
          small
          no-focus-ring
          @click="pageChange(page)"
        />
      </jb-buttons>
      <small>Page {{ currentPage }} of {{ numPages }}</small>
    </level>
  </div>
</template>
