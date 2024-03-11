<script setup>
import { computed, ref, reactive } from "vue";
import { mdiLifebuoy, mdiPlusBox, mdiEmail } from "@mdi/js";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import JbButtons from "@/components/JbButtons.vue";
import ModalEnquiryRecord from "@/components/ModalEnquiryRecord.vue";
import ModalAcademics from "@/components/ModalAcademics.vue";
import JbButton from "@/components/JbButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
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

const checkable = ref(false);
const pageLoading = ref(false)

const itemsPaginated = computed(() => {
    if(counselor.noCallEnquiry && counselor.noCallEnquiry.items){
        return counselor.noCallEnquiry.items
    } 
}
);
const itemsCount = computed(() => {
    if(counselor.noCallEnquiry && counselor.noCallEnquiry.total){
        return counselor.noCallEnquiry.total
    } 
}
);

const confirmRefresh = async () => {
  pageLoading.value = true
  await counselor.getNoCallsEnquiry();
  pageLoading.value = false
};
// const propValues = reactive({
//   id: 0,
//   name: "",
//   highest_degree: {},
// });
// const isAcademicsActive = ref(false);

// const openAcademicModal = (id, name, highest_degree) => {
//   isAcademicsActive.value = true;
//   propValues.id = id;
//   propValues.name = name;
//   propValues.highest_degree = highest_degree;
// };

// const isModalRecordActive = ref(false);

// const openRecordModal = (id, name) => {
//   isModalRecordActive.value = true;
//   propValues.id = id;
//   propValues.name = name;
// };

const maskNumber = (number) => {
  if(number){
  return number.replace(/\d(?=\d{4})/g, "*");
}};

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
  await counselor.getNoCallsEnquiry(page);
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
  <table class="mt-5">
    <thead class="sticky top-[76px] z-[1] bg-gray-900">
      <tr>
        <th v-if="checkable" />
        <th>Name</th>
        <th>Contact</th>
        <th>Course-Modeofclass</th>
        <th>Timings</th>
        <th>Email</th>
        <th>DOE & Time</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(client, index) in itemsPaginated" :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
        <checkbox-cell v-if="checkable" @checked="checked($event, client)" />
        <td data-label="Name">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.name }}
            <span v-if="client.enquiry.enq_for_someone === true">({{ client.enquiry.enquiree_name }})</span>
          </small>
        </td>
        <td data-label="Contact">
          <span v-for="(contact, i) in client.contact" :key="i">
            <small class="text-gray-500 dark:text-gray-300 font-semibold">
              <a class="" :href="'tel:' + contact.code + contact.number">
                {{(contact.code + contact.number)}}
                  <!-- // maskNumber(contact.code + contact.number) -->
              </a>
              &nbsp;
            </small>
          </span>
        </td>
        <td data-label="Course">
          <span v-for="(course, i) in client.courses" :key="i">
            <small v-if="course.course" class="text-gray-100 dark:text-gray-200">
              {{ course.course.name }}
              <span class="text-lime-200"> - {{ course.mode_class.name }}</span>
            <br>
              <!-- <span class="text-gray-500 dark:text-gray-300"> - {{ dayjs(course.agreed_date).format("DD-MMM-YY") }}</span> <br/> -->
            </small>
          </span>
        </td>
        <td data-label="Timings">
          <small>
            <span v-if="client.enquiry && client.enquiry.class_timing" class="text-amber-100"> 
              {{ client.enquiry.class_timing.name }}
            </span>
            <span class="text-neutral-300" v-for="(ts, i) in client.enquiry.time_slot" :key="i">
              - {{ ts.name }} 
            </span>
          </small>
        </td>
        <td data-label="Email">
          <span class="mr-1" v-for="(email, i) in client.email" :key="i">
            <small class="text-gray-500 dark:text-gray-300">
              <a class="" :href="'mailto:' + email.email">
                <jb-button color="warning" :icon="mdiEmail" small />
              </a>
            </small>
          </span>
        </td>
        <td data-label="Date of Enquiry">
          <small class="text-gray-400 dark:text-gray-300 text-xs">
            {{ dayjs(client.created).format("DD-MMM-YY hh:mm A") }}
          </small>
        </td>
      </tr>
    </tbody>
  </table>
  <div :class="lightBorderStyle" class="p-3 lg:px-6 border-t dark:border-gray-800 sticky bg-[#151D2B] bottom-0 z-[9]">
    <level mobile>
      <jb-buttons>
        <jb-button v-for="page in pagesList" :key="page" :active-soft="page === currentPage" :label="page" addon
          :outline="darkMode" small no-focus-ring @click="pageChange(page-1)" />
      </jb-buttons>
      <small>Page {{ currentPage }} of {{ numPages }}</small>
    </level>
  </div>
</template>