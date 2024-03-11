<script setup>
import { computed, ref, reactive } from "vue";
import { mdiStarMinus, mdiEmail, mdiMicrophone, mdiArrowLeftCircle } from "@mdi/js";
import ModalBox from "@/components/ModalBox.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import ModalNumberRecord from "@/components/ModalNumberRecord.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { themeStore } from "../stores/theme";
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";

const theme = themeStore();
const counselor = counselorStore();
const router = useRouter();

const props = defineProps({
  params: String,
});

const maskNumber = (number) => {
  if (number) {
   return number.replace(/\d(?=\d{4})/g, "*"); 
  }
};

const lightBorderStyle = computed(() => theme.lightBorderStyle);

const lightBgStyle = computed(() => theme.lightBgStyle);

const tableTrStyle = computed(() => theme.tableTrStyle);

const tableTrOddStyle = computed(() => theme.tableTrOddStyle);

const darkMode = computed(() => theme.darkMode);

const checkable = ref(false);
const pageLoading = ref(false)

const itemsPaginated = computed(() => {
    if(counselor.refersInside && counselor.refersInside.items){
        return counselor.refersInside.items
    } 
}
);
const itemsCount = computed(() => {
    if(counselor.refersInside && counselor.refersInside.total){
        return counselor.refersInside.total
    } 
}
);

const isModalRecordActive = ref(false);
const propValues = reactive({
  id: 0,
  name: "",
});

const openRecordModal = (number) => {
  isModalRecordActive.value = true;
  propValues.id = number;
  // propValues.name = name;
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
  await counselor.getReferralsInside(props.params, page);
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
  <modal-number-record
    v-if="isModalRecordActive"
    v-model="isModalRecordActive"
    :title="'Call record details of ' + propValues.id"
    :id="propValues.id"
    has-cancel
  >
  </modal-number-record>
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

  <div class="flex justify-start w-full bg-[#151D2B] sticky top-[69px] z-[9] pb-2 pt-2">
    <jb-button
      color="info"
      label="Back"
      small
      :icon = mdiArrowLeftCircle
      @click="router.push('referrals')"
    />
    </div>

    
  <table class="">
    <thead class="sticky top-[104px] z-[9] bg-gray-900">
      <tr>
        <th v-if="checkable" />
        <th>Name</th>
        <th>Contact</th>
        <th>Referred by</th>
        <th>Record</th>
        <th>status</th>
        <th>DOE & Time</th>
        <th>Handled time</th>
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
          <small class="text-green-200 font-semibold">
            {{ client.name }}
          </small>
        </td>
        <td data-label="Contact">
          <small class="text-gray-400 dark:text-gray-300">
            <a class="" :href="'tel:' + client.code + client.number">
              {{(client.code + client.number)}}
              <!-- // maskNumber(client.code + client.number) -->
            </a>
            &nbsp;
          </small>
        </td>
        <td data-label="Referred by">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.Enquiry.name }}
          </small>
        </td>
        <td data-label="Record">
          <button @click="openRecordModal(client.number)">
            <icon :path="mdiMicrophone" size="21" class="text-sky-500 dark:text-sky-400 hover:text-sky-200 hover:dark:text-sky-200 hover:bg-slate-800 rounded-xl" />
          </button>
          <!-- <jb-button
            color="info"
            :icon="mdiMicrophone"
            small
            @click="openRecordModal(client.number)"
          /> -->
          <!-- :label="client.record_count" -->
        </td>
        <td data-label="Status">
          <small v-if="client.CallRecord && client.CallRecord.status" class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ client.CallRecord.status.name }}
          </small>
          <small v-else class="text-gray-400 dark:text-gray-400">No status</small>
        </td>
        <td data-label="DOE">
          <small v-if="client.Enquiry" class="text-gray-500 dark:text-gray-300 font-semibold">
            {{ dayjs(client.Enquiry.created).format("DD-MMM-YY hh:mm A") }}
          </small>
        </td>


         <td data-label="Handled time">
           <span v-if="client.CallRecord && client.CallRecord.name.length > 0">
          <small  class="text-gray-500 dark:text-gray-300 font-semibold">
           {{client.CallRecord.duration}} 
          </small>
           </span>
            <small v-else class="text-gray-500 dark:text-gray-300 font-semibold">
           0 
          </small>
        </td>
       
        <!-- <td data-label="Handled time">
          <span v-if="client.CallRecord && client.CallRecord.name.length > 0">
          <small v-if="dayjs(client.CallRecord.created).diff(dayjs(client.Enquiry.created), 'day')" class="text-gray-500 dark:text-gray-300 font-semibold">
            {{dayjs(client.CallRecord.created).diff(dayjs(client.Enquiry.created), 'day')}} Days
          </small>
          <small v-else class="text-gray-500 dark:text-gray-300 font-semibold">
            {{dayjs(client.CallRecord.created).diff(dayjs(client.Enquiry.created), 'hour')}} Hours
          </small>
          </span>   
        </td>-->
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