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
import ModalAcademics from "@/components/ModalAcademics.vue";
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import { sessionStore } from "../stores/session";

const user = sessionStore();

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
  if(counselor.meToOB && counselor.meToOB.items){
    return counselor.meToOB.items
  }
});
const itemsCount = computed(() => {
  if(counselor.meToOB && counselor.meToOB.total){
    return counselor.meToOB.total
  }
});

const recEnd = ref(false);

const getRecord = computed(() => {
  const getRec = [];
  if(counselor.meToOB && counselor.meToOB.items){
    counselor.meToOB.items.forEach((meob) => {
      for (var ocr of meob.other_courses) {
        for (var rbr of meob.Recs) {
          for (var br of rbr.branch) {
            if (br.id === ocr.branch.id) {
              getRec.push(rbr);
              break;
            }
          }
        }
      }
    });
    return getRec[0];
  }
});

const confirmRefresh = async () => {
  pageLoading.value = true
  await counselor.getMeToOB();
  pageLoading.value = false
};
const propValues = reactive({
  id: 0,
  name: "",
  highest_degree: {},
  courses: [],
});

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
  await counselor.getMeToOB(page);
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
  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th>Name</th>
        <th>Contact</th>
        <th>Course</th>
        <th>Timings</th>
        <th>Other branch status</th>
        <th>Called Date</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(client, index) in itemsPaginated" :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
        <checkbox-cell v-if="checkable" @checked="checked($event, client)" />
        <td data-label="Name">
          <small class="font-semibold">
            <span v-if="client.enquiry.experienced === true" class="text-sky-400">
              {{ client.name }}
              <span v-if="client.enquiry.enq_for_someone === true">({{ client.enquiry.enquiree_name }})</span>
            </span>
            <span v-else class="text-gray-500 dark:text-gray-300">
              {{ client.name }}
              <span v-if="client.enquiry.enq_for_someone === true">({{ client.enquiry.enquiree_name }})</span>
            </span>
          </small>
        </td>
        <td data-label="Contact">
          <span v-for="(contact, i) in client.contact" :key="i">
            <small class="text-gray-500 dark:text-gray-300">
              <a class="" :href="'tel:' + contact.code + contact.number">
                {{(contact.code + contact.number)}}
                <!-- // maskNumber(contact.code + contact.number) -->
              </a>
              &nbsp;
            </small>
          </span>
        </td>
        <td data-label="Course">
          <span v-for="(course, i) in client.other_courses" :key="i">
            <small v-if="course.course && course.oauthor.id === user.author.id" class="text-gray-100 dark:text-gray-200">
              {{ course.course.name }}
              <span class="text-lime-200"> - {{ course.mode_class.name }}</span>
              <span class="text-gray-500 dark:text-gray-300"> - {{ dayjs(course.agreed_date).format("DD-MMM-YY") }}</span> <br/>
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
        <td data-label="Other branch status">
          <span v-for="(course, i) in client.other_courses" :key="i">
          <span v-for="(rec, i) in client.records" :key="i">
          <span v-for="(br, i) in rec.branch" :key="i">
            <small v-if="br.id === course.branch.id && rec.status" class="text-gray-500 dark:text-gray-300 font-semibold">
              {{ rec.status.name }}
              <span v-if="rec.status.substatus"> - {{rec.status.substatus.name}} </span>
            </small>
          </span></span></span>
        </td>
        <td data-label="Called Date">
          <span v-for="(course, i) in client.other_courses" :key="i">
          <span v-for="(rec, i) in client.records" :key="i">
          <span v-for="(br, i) in rec.branch" :key="i">
            <small v-if="br.id === course.branch.id" class="text-gray-300 dark:text-gray-300">
              {{ dayjs(rec.time).utc().format("DD-MMM-YY hh:mm") }}
            </small>
          </span></span></span>
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