<script setup>
import { computed, ref, reactive } from "vue";
import { mdiStarMinus, mdiEmail } from "@mdi/js";
import ModalBox from "@/components/ModalBox.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";

const theme = themeStore();
const counselor = counselorStore();
const router = useRouter();

// const props = defineProps({
//   enqs: Array,
//   checkable: Boolean,
//   perPage: {
//     type: Number,
//     default: 25,
//   },
// });

const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*");
};

const lightBorderStyle = computed(() => theme.lightBorderStyle);

const lightBgStyle = computed(() => theme.lightBgStyle);

const tableTrStyle = computed(() => theme.tableTrStyle);

const tableTrOddStyle = computed(() => theme.tableTrOddStyle);

const darkMode = computed(() => theme.darkMode);

const checkable = ref(false);
const pageLoading = ref(false)

const itemsPaginated = computed(() => {
    if(counselor.stars && counselor.stars.items){
        return counselor.stars.items
    } 
}
);
const itemsCount = computed(() => {
    if(counselor.stars && counselor.stars.total){
        return counselor.stars.total
    } 
}
);

const isModalActive = ref(false);

let propValues = reactive({
  id: 0,
  name: "",
});

const unstar = (name, id) => {
  isModalActive.value = true;
  propValues.name = name;
  propValues.id = id;
};

const confirmUnstar = async () => {
  if (propValues.id > 0) {
    pageLoading.value = true
    await counselor.unStar({ id: propValues.id });
    await counselor.getStars();
    pageLoading.value = false
  }
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
  await counselor.getStars(page);
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
  <modal-box v-model="isModalActive" :title="'Un-star ' + propValues.name" buttonLabel="Unstar" has-cancel
    @confirm="confirmUnstar">
    <p>Are you sure you want to <b>un-star</b>?</p>
  </modal-box>

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
        <th>Name</th>
        <th>Contact</th>
        <th>Email</th>
        <th>Course</th>
        <th>Status</th>
        <th>Actions</th>
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
            <small class="text-gray-500 dark:text-gray-300">
              <a class="" :href="'tel:' + contact.code + contact.number">
                {{(contact.code + contact.number)}}
                <!-- // maskNumber(contact.code + contact.number) -->
              </a>
              &nbsp;
            </small>
          </span>
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
        <td data-label="Course">
          <span v-for="(course, i) in client.courses" :key="i">
            <small v-if="course.course" class="text-gray-500 dark:text-gray-300">
              {{ course.course.name }} - <span v-if="course.mode_class" class="text-orange-400">{{
                course.mode_class.name
              }}</span> <br />
            </small>
          </span>
        </td>
        <td data-label="Status">
          <!-- <small v-if="client.records.length > 0" class="text-gray-400 dark:text-gray-300 font-semibold">
            <span v-if="client.records.slice(-1)[0].status">{{client.records.slice(-1)[0].status.name}}</span>
            <span v-else class="text-gray-400 dark:text-gray-400 font-semibold">No status</span>
          </small>
          <small v-else class="text-gray-400 dark:text-gray-400 font-semibold">No status</small> -->
        </td>
        <td data-label="Actions">
          <small class="text-gray-500 dark:text-gray-300 font-semibold">
            <jb-button label="Un-star" color="info" :icon="mdiStarMinus" small
              @click="unstar(client.name, client.id)" />
          </small>
        </td>
      </tr>
    </tbody>
  </table>
  <div :class="lightBorderStyle" class="p-3 lg:px-6 border-t dark:border-gray-800">
    <level mobile>
      <jb-buttons>
        <jb-button v-for="page in pagesList" :key="page" :class="currentPage === page ? 'bg-gray-500' : ''" :active-soft="page === currentPage" :label="page" addon
          :outline="darkMode" small no-focus-ring @click="currentPage != page ? pageChange(page - 1) : ''" />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </level>
  </div>
</template>
