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

const counselor = counselorStore();
const theme = themeStore();

onMounted(async () => {
  if (props.id) {
    await counselor.getFERecordValues(props.id);
  }
});

const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  id: {
    type: Number,
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

const records = computed(() => {
  return counselor.records;
});

const recordCount = computed(() => {
  return counselor.recordCount;
});

const perPage = ref(25);

const currentPage = ref(0);

const checkedRows = ref([]);

const numPages = computed(() => Math.ceil(recordCount.value / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

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
      class="shadow-lg w-full max-h-modal md:w-4/5 z-50 overflow-y-scroll"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
      <div class="pl-4 space-y-3">
        <table>
          <thead>
            <tr>
              <th v-if="checkable" />
              <th>Record</th>
              <th>Call Duration</th>
              <th>Status</th>
              <!-- <th>Branch</th> -->
              <th>DateTime</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(client, index) in records"
              :key="client.id"
              :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
            >
              <checkbox-cell
                v-if="checkable"
                @checked="checked($event, client)"
              />
              <td data-label="Record">
                <small class="text-gray-500 dark:text-gray-300 font-semibold">
                  <audio controls>
                    <source :src="client.audio" type="audio/ogg" />
                    Your browser does not support the audio tag.
                  </audio>
                </small>
              </td>
              <td data-label="Call Duration">
                <small class="text-gray-500 dark:text-gray-300 font-semibold">
                  {{ client.duration }}
                </small>
              </td>
              <td data-label="Status">
                <small
                  v-if="client.status.length > 0"
                  class="text-gray-500 dark:text-gray-300 font-semibold"
                >
                  {{ client.status[0].main_status_name }}
                  <span v-if="client.status[0].comment">
                    - {{ client.status[0].comment }}</span
                  >
                </small>
              </td>
              <!-- <td data-label="Branch">
                <small
                  v-for="(b, i) in client.branches"
                  :key="i"
                  class="text-gray-500 dark:text-gray-300 font-semibold"
                >
                  {{ b.display_name }} &nbsp;
                </small>
              </td> -->
              <td data-label="DateTime">
                <small class="text-gray-500 dark:text-gray-300 font-semibold">
                  {{ dayjs(client.time).format("DD-MMM-YY hh:mm") }}
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
            <jb-buttons glue>
              <jb-button
                v-for="page in pagesList"
                :key="page"
                :active-soft="page === currentPage"
                :label="page + 1"
                addon
                :outline="darkMode"
                small
                no-focus-ring
                @click="currentPage = page"
              />
            </jb-buttons>
            <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
          </level>
        </div>
      </div>
    </card-component>
  </overlay>
</template>