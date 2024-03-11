<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import { mdiClose, mdiPlusBox, mdiMinusBox, mdiPhone } from "@mdi/js";
import JbButton from "@/components/JbButton.vue";
import JbButtons from "@/components/JbButtons.vue";
import CardComponent from "@/components/CardComponent.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import TextLink from "@/components/TextLink.vue";
import Overlay from "@/components/Overlay.vue";
import Field from "@/components/Field.vue";
import TitleSubBar from "@/components/TitleSubBar.vue";
import { counselorStore } from "../stores/counselor";
import Control from "@/components/Control.vue";
import { themeStore } from "../stores/theme";
import dayjs from "dayjs";
import { sessionStore } from "../stores/session";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const user = sessionStore();
const counselor = counselorStore();
const theme = themeStore();

// onMounted(async () => {
//   if (props.id) {
//     await counselor.getERecordValues(props.id);
//   }
// });

const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  id: {
    type: Number,
  },
  records: {
    type: Array,
  },
  button: {
    type: String,
    default: "info",
  },
  buttonLabel: {
    type: String,
    default: "Add",
  },
  shake: Boolean,
  hasCancel: Boolean,
  textLinkLabel: {
    type: String,
    default: null,
  },
  textLinkIcon: {
    type: String,
    default: null,
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const confirmCancel = (mode) => {
  value.value = false;
  emit(mode);
};
const checkable = ref(false);

const cancel = () => confirmCancel("cancel");

const lightBorderStyle = computed(() => theme.lightBorderStyle);

const lightBgStyle = computed(() => theme.lightBgStyle);

const tableTrStyle = computed(() => theme.tableTrStyle);

const tableTrOddStyle = computed(() => theme.tableTrOddStyle);

const darkMode = computed(() => theme.darkMode);

// const records = computed(() => {
//   const getRecords = [];
//   for (var r of props.records) {
//     for (var brnh of user.user.branches) {
//       for (var rec_br of r.branch) {
//         if (rec_br.id === brnh.id) {
//           getRecords.push(r);
//         }
//       }
//     }
//   }
//   return getRecords;
// });

// const recordCount = computed(() => records.value.length);

const pageLoading = ref(false);

// Pagination
const perPage = 8;
const currentPage = ref(0);
const checkedRows = ref([]);
const maxPages = ref(10);
// const numPages = computed(() => Math.ceil(recordCount.value / perPage));

const currentPageHuman = computed(() => currentPage.value + 1);
const itemsPaginated = computed(() =>
  props.records.value.slice(
    perPage * currentPage.value,
    perPage * (currentPage.value + 1)
  )
);

const pageChange = async (page) => {
  pageLoading.value = true;
  currentPage.value = page + 1;
  // await counselor.getNoEnquiryForm(page);
  pageLoading.value = false;
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});
</script>

<template>
  <overlay v-show="value" @overlay-click="cancel">
    <card-component
      v-show="value"
      :title="title"
      class="
        shadow-lg
        w-full
        max-h-modal
        md:w-3/5
        lg:w-4/5
        xl:w-3/5
        z-50
        overflow-y-scroll
      "
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
   
    <div class="pl-4 space-y-3">
        <table>
          <thead>
            <tr>
              <th>Record</th>
              <th>Call Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <!-- v-for="(client, index) in props.records"
              :key="client" -->
            <tr
              :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
            >
              <!-- {{ props.records }} -->
            <td data-label="Record">
                <small
                  v-if="props.records"
                  class="text-gray-500 dark:text-gray-300 font-semibold"
                >
                  <audio
                    :src="`https://gotest.qspiders.com/records/${props.records.record}`"
                    controls
                    controlsList="nodownload"
                    class="w-60 h-8"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </small>
              </td>
              <td data-label="Call Duration">
                <small class="text-gray-500 dark:text-gray-300 font-semibold">
                  {{ props.records.duration }}
                </small>
              </td>
              <td data-label="Status">
                <small
                  v-if="props.records.status"
                  class="text-gray-500 dark:text-gray-300 font-semibold"
                >
                  {{ props.records.status.name }}
                  <span v-if="props.records.status.substatus">
                    - {{ props.records.status.substatus.name }}
                  </span>
                  <!-- <span v-if="client.status.comment"> - {{client.status.comment}}</span> -->
                </small>
                <small
                  v-else
                  class="text-gray-400 dark:text-gray-400 font-semibold"
                  >No status</small
                >
              </td>
            </tr>
          </tbody>
        </table>
     
      </div>
    <!-- <div v-else>
      <span class="p-1 flex justify-center text-red-500 font-semibold text-md">Records Not Found !</span>
    </div> -->
    </card-component>
  </overlay>
</template>
