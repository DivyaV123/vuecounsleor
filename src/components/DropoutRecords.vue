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
import utc from 'dayjs/plugin/utc'
import { sessionStore } from "../stores/session";

dayjs.extend(utc)

const user = sessionStore();
const counselor = counselorStore();
const theme = themeStore();
let search=""
onMounted(async () => {
  formLoading.value=true
 let branch=[]
  if (user.user) {
    for(let i=0;i<user.user.branches.length;i++){
        branch.push(user.user.branches[i].id)
    } 
  }
  search=""
  if(recs.value && recs.value.enqid!=0){
    search += "&id="+recs.value.enqid
    search += "&branch="+branch.join()
    await counselor.getuserBranchRecords(0,search)
  }
  else{

    search += "&name="+props.name
    search += "&branch="+branch.join()
    await counselor.getuserBranchRecords(0,search)
  }
  formLoading.value=false

});

const props = defineProps({
    record: Array,
  title: {
    type: String,
    default: null,
  },
  id: {
    type: [Number, String],
  },
  name: {
    type: String,
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
const recs = computed(() => props.record);

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
const formLoading=ref(false)
const cancel = () => confirmCancel("cancel");

const lightBorderStyle = computed(() => theme.lightBorderStyle);

const lightBgStyle = computed(() => theme.lightBgStyle);

const tableTrStyle = computed(() => theme.tableTrStyle);

const tableTrOddStyle = computed(() => theme.tableTrOddStyle);

const darkMode = computed(() => theme.darkMode);
// let getRecords = [];

const currentPage = ref(1)
const currentPageHuman = computed(() => currentPage.value);

const itemsPaginated = computed(() => {
  if (counselor.user_branch&& counselor.user_branch.items) {
    return counselor.user_branch.items
  }
});

// const itemsPaginated = computed(() =>
//   records.value.slice(
//     perPage * currentPage.value,
//     perPage * (currentPage.value + 1)
//   )
// );


// Pagination
const perPage = 8;
const checkedRows = ref([]);
const maxPages = ref(10);

const itemsCount = computed(() => counselor.user_branch.total)  

const numPages = computed(() => {
      if(itemsCount.value != 0){
        return Math.ceil(itemsCount.value / perPage)
      }
    });

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



const pageChange = async (page) => {
  formLoading.value = true
  currentPage.value = page + 1;
  await counselor.getuserBranchRecords( currentPage.value-1,search)
  formLoading.value = false
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
};

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
    <div
    v-if="formLoading"
    wire:loading
    class="
      fixed
      top-0
      left-0
      right-0
      bottom-0
      w-full
      h-screen
      z-50
      overflow-hidden
      bg-gray-700
      opacity-75
      flex flex-col
      items-center
      justify-center
    "
  >
    <div
      class="
        loader
        ease-linear
        rounded-full
        border-4 border-t-4 border-gray-200
        h-12
        w-12
        mb-4
      "
    ></div>
    <h2 class="text-center text-white text-xl font-semibold">
     Loading....
    </h2>
    <p class="w-1/3 text-center text-white">
      This may take a few seconds, please wait.
    </p>
  </div>

      <div class="pl-4 space-y-3" v-if="itemsPaginated &&itemsPaginated.length > 0">
        <table>
    
    <thead>
      <tr>
       <th>Status</th>
      <th class="text-center">Record</th>
      <th>Branch</th>
      <th>Duration</th>
      <th>Date and Time</th>
      
      </tr>
   
    </thead>
  <tbody>

      <tr
        v-for="(client, index) in itemsPaginated"
        :key="index"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
     <!-- {{client}} -->
    
         <td data-label="Status" >
         <small class="text-gray-500 dark:text-gray-300 capitalize" v-if="client.status"> 
        {{client.status.name}} 
        <span v-if="client.status.substatus && client.status.substatus.name">
                    - {{ client.status.substatus.name }}
                  </span>
          </small> 
          <small v-else>-</small>  
        </td>
        

    <td data-label="Recording">
       <small class="text-gray-500 dark:text-gray-300 capitalize"  >  
        <audio  :src="`https://gotest.qspiders.com/records/${client.record}`" controls controlsList="nodownload"  class="w-60 h-10  mx-auto">
        Your browser does not support the audio element.
              </audio>
          </small>   
        </td>

         <td data-label="Branch">
       <small class="text-gray-500 dark:text-gray-300 capitalize"  v-for="(client) in client.branch" :key="client.id" >  
     {{client.name}}
     <br/>
          </small>   
        </td>

  <td data-label="Duration">
       <small class="text-gray-500 dark:text-gray-300 capitalize"  >  
        {{client.duration}} 
          </small>   
        </td>

    <td data-label="Recording">
       <small class="text-gray-500 dark:text-gray-300 capitalize"  >  
        <!-- {{client.time}}  -->
        {{ dayjs(client.time).utc().format("DD-MM-YYYY hh:mm A") }}
          </small>   
        </td>
   
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
   <level mobile>
      <jb-buttons>
        <!-- <jb-button
                v-for="page in pagesList"
                :key="page"
                :class="currentPage === page ? 'bg-gray-500' : ''"
                :active-soft="page === currentPage"
                :label="page + 1"
                addon
                :outline="darkMode"
                small
                no-focus-ring
                @click="currentPage = page"
              />
      </jb-buttons> -->
      <jb-button v-for="page in pagesList" :key="page" :class="currentPage === page ? 'bg-gray-500' : ''"
          :active-soft="page === currentPage" :label="page" addon :outline="darkMode" small no-focus-ring
          @click="currentPage != page ? pageChange(page - 1) : ''" />
      </jb-buttons>
   
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </level>
  </div>
         
      </div>
 
    <div v-else>
      <span class="p-1 flex justify-center text-red-500 font-semibold text-md">Records Not Found !</span>
    </div>
    </card-component>
  </overlay>
</template>