<script setup>
import { computed, reactive, ref } from "vue";
import {
  mdiMinusBox
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
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";

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

const currentPage = ref(0);

const checkedRows = ref([]);

const perPage = 25;
const checkable = ref(false);
const pageLoading = ref(false)
const itemsPaginated = computed(() => counselor.reminders);
const itemsCount = computed(() => counselor.remindersCount);


const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*");
};

const confirmRefresh = async () => {
  pageLoading.value = true
  await counselor.getReminders();
  pageLoading.value = false
};
const propValues = reactive({
  id: 0,
  name: "",
  highest_degree: {},
  courses: [],
});

const isModalRecordActive = ref(false);

const removeReminder = async (id) => {
  if (confirm("Do you really want to remove the reminder?")) {
    pageLoading.value = true

    await counselor.removeReminder({ id: id })
    await counselor.getReminders()
    pageLoading.value = false
    // theme.pushMessage("Successfully removed reminder");
  }
};

const isModalStatusActive = ref(false);

const openStatusModal = (id, name) => {
  isModalStatusActive.value = true;
  propValues.id = id;
  propValues.name = name;
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
  await counselor.getReminders(page);
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
    <thead class="sticky top-[56px] z-[9] bg-gray-900">
      <tr>
        <th v-if="checkable" />
        <th>Title</th>
        <th>Description</th>
        <th>Student contact</th>
        <th>Date Time</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(client, index) in itemsPaginated" :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
        <checkbox-cell v-if="checkable" @checked="checked($event, client)" />
        <td>
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.title }}
          </small>
        </td>
        <td>
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.description }}
          </small>
        </td>
        <td data-label="Contact">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            <a class="" :href="'tel:' + client.number">
              {{(client.number)}}
                <!-- // maskNumber(client.number) -->
            </a>
          </small>
        </td>
        <td>
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.rdate }}
          </small>
        </td>
        <td>
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            <jb-button color="info" :icon="mdiMinusBox" label="Remove" outline small class="mr-1"
              @click="removeReminder(client.id)">
            </jb-button>
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
