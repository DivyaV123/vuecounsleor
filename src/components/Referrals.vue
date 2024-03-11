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
import dayjs from "dayjs";

const theme = themeStore();
const router = useRouter();
const counselor = counselorStore();

// const props = defineProps({
//   enqs: Object,
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

const buttonSettingsModel = ref(["left"]);
const buttonsOutline = computed(
  () => buttonSettingsModel.value.indexOf("outline") > -1
);

const tableTrOddStyle = computed(() => theme.tableTrOddStyle);

const darkMode = computed(() => theme.darkMode);

const isModalActive = ref(false);

const refersItems = computed(() => {
    if(counselor.refers){
        return counselor.refers
    } 
}
);

const currentPage = ref(0);

const checkedRows = ref([]);

const numPages = computed(() => Math.ceil(items.value.length / props.perPage));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
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

  <table class="mt-4">
    <thead class="sticky top-[63px] z-[1] bg-gray-900 ">
      <tr>
        <th>Handled/Total Referrals</th>
        <th>Converted/Total Handled</th>
        <th>Not Handled</th>
        <th>Still Not Handled Since</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td data-label="Handled/Total referrals">
          <jb-button
            color="info"
            :label="refersItems.handled ? refersItems.handled : '0'"
            small
            :outline="buttonsOutline"
            @click="
              router.push({
                path: '/referrals-inside',
                query: { filters: 'handled' },
              })
            "
          />/
          <jb-button
            color="info"
            :label="refersItems.total ? refersItems.total : '0'"
            small
            :outline="buttonsOutline"
            @click="
              router.push({
                path: '/referrals-inside',
                query: { filters: 'total' },
              })
            "
          />
        </td>
        <td data-label="Converted/Total Handled">
          <jb-button
            color="info"
            :label="refersItems.converted ? refersItems.converted : '0'"
            small
            :outline="buttonsOutline"
            @click="
              router.push({
                path: '/referrals-inside',
                query: { filters: 'converted' },
              })
            "
          />/<jb-button
            color="info"
            :label="refersItems.handled ? refersItems.handled : '0'"
            small
            :outline="buttonsOutline"
            @click="
              router.push({
                path: '/referrals-inside',
                query: { filters: 'handled' },
              })
            "
          />
        </td>
        <td data-label="Not handled">
          <small  v-if=" refersItems.total - refersItems.handled!=0">
            <jb-button
            color="info"
            :label="(refersItems.total - refersItems.handled)"
            small
            :outline="buttonsOutline"
            @click="
              router.push({
                path: '/referrals-inside',
                query: { filters: 'not_handled' },
              })
            "
          />
          </small>
         <small v-else> 
          <jb-button
            color="info"
             label="0"
            small/></small>
       
        </td>
        <td data-label="Still not handled Since">
          <small v-if="dayjs(new Date()).diff(dayjs(refersItems.since.created), 'day')" class="text-gray-500 dark:text-gray-300 font-semibold">
            {{dayjs(new Date()).diff(dayjs(refersItems.since.created), 'day')}} Days
          </small>
          <small v-else class="text-gray-500 dark:text-gray-300 font-semibold">
            {{dayjs(new Date()).diff(dayjs(refersItems.since.created), 'hour')}} Hours
          </small>
        </td>
      </tr>
    </tbody>
  </table>
</template>
