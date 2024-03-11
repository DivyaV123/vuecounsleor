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
import Level from "@/components/Level.vue";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import { counselorStore } from "../stores/counselor";
import { sessionStore } from "../stores/session";
import dayjs from "dayjs";
import Pill from '@/components/Pill.vue'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const theme = themeStore();
const router = useRouter();
const counselor = counselorStore();
const user = sessionStore();

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
  if(counselor.followups && counselor.followups.items){
      return counselor.followups.items
  } 
}
);
const itemsCount = computed(() => {
  if(counselor.followups && counselor.followups.total){
      return counselor.followups.total
  } 
}
);

function totalAssigned(splits,inactive){
  let uid = user.user.uid
  let count = 0
  let called = 0
  if(inactive && inactive.length > 0){
    for(var m = 0;m < inactive.length ; m++){
    if(inactive[m].id === uid){
      count = inactive[m].total + count
    }
  }
  }
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.total + count
    }
    if(splits[i].other_counselor && splits[i].other_counselor.length > 0){
      for(var p = 0;p < splits[i].other_counselor.length ; p++){
        if(splits[i].other_counselor[p].id === uid){
          count = splits[i].other_counselor[p].total + count
        }
    }
    }
   
  }
  return count
}

function totalCalled(splits){
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.count.called
      break
    }
  
  }
  return count
}

function totalNotCalled(splits,inactive){
  let countTotal = totalAssigned(splits,inactive)
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = (countTotal - splits[i].counselor.count.called)
      break
    }
  
  }
  return count
}
function totalCB(splits){
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.count.call_back
      break
    }
  
  }
  return count
}
function totalRNR(splits){
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.count.rnr
      break
    }
  }
  return count
}
function totalEscalation(splits){
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.count.escalation
      break
    }
  
  }
  return count
}
function totalEnquiry(splits){
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.count.enquiry
      break
    }
  
  }
  return count
}
function totalComing(splits){
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.count.coming
      break
    }
  
  }
  return count
}
function totalNeedOnline(splits){
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.count.need_online
      break
    }
  
  }
  return count
}
function totalAlreadyJoined(splits){
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.count.joined_within
      break
    }
  
  }
  return count
}
function totalGotJob(splits){
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.count.got_job
      break
    }
  
  }
  return count
}
function totalJoinedOutside(splits){
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.count.joined_outside
      break
    }
  
  }
  return count
}
function totalNI(splits){
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.count.not_interested
      break
    }
  
  }
  return count
}

function totalNB(splits){
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.count.next_batch
      break
    }
  
  }
  return count
}

function totalSW(splits){
  let uid = user.user.uid
  let count = 0
  for(var i = 0;i < splits.length ; i++){
    if(splits[i].counselor.id === uid){
      count = splits[i].counselor.count.switched_off
      break
    }
  
  }
  return count
}
const currentPage = ref(1);
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
  await counselor.getFollowups(page);
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

  <div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>
  <table class="mt-5">
    <thead class="sticky top-[71px] z-[1] bg-gray-900">
      <tr>
        <th class=""><small>Name</small></th>
        <th class=""><small>Assigned</small></th>
        <th class=""><small>Total Called</small></th>
        <th class=""><small>Not called</small></th>
        <th class=""><small>Call Back</small></th>
        <th class=""><small>RNR</small></th>
        <th class=""><small>SW - NR</small></th>
        <th class=""><small>Escalated<br/> by me</small></th>
        <th class=""><small>Enquiry</small></th>
        <th class=""><small>Coming</small></th>
        <th class=""><small>Need Online</small></th>
        <th class=""><small>Joined Within</small></th>
        <th class=""><small>Not interested</small></th>
        <th class=""><small>Got Job</small></th>
        <th class=""><small>Joined Outside</small></th>
        <th class=""><small>Next Batch</small></th>
       

      </tr>
    </thead>
    <tbody>
      <tr v-for="(client, index) in itemsPaginated" :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">

                <td data-label="Name" class="">
          <small class="text-gray-300 font-semibold">
            <a :href="'/follow-up-enquiries?type=100&name='+client.name+'&fp='+client.id"> 
              {{client.name}}
              </a>
          </small>
        </td>
        <td data-label="Assigned" class="">
          <a :href="'/follow-up-enquiries?type=100&name='+client.name+'&fp='+client.id">  
          <pill
            type="info"
            :text="totalAssigned(client.enqs.split, client.enqs.inactive)"
            />
            </a>
        </td>
        <td data-label="Total Called" class="">
          <a :href="'/follow-up-enquiries?type=101&name='+client.name+'&fp='+client.id">  
            <pill
            type="success"
            :text="totalCalled(client.enqs.split)"
            />
            </a>
        </td>
        <td data-label="Not called" class="">
          <a :href="'/follow-up-enquiries?type=102&name='+client.name+'&fp='+client.id">  
          <pill
            type="danger"
            :text="totalNotCalled(client.enqs.split,client.enqs.inactive)"
            />
            </a>
        </td>
        <td data-label="Call Back" class="">
          <a :href="'/follow-up-enquiries?type=2&name='+client.name+'&fp='+client.id">  
          <pill
            type="danger"
            :text="totalCB(client.enqs.split)"
            />
            </a>
        </td>
        <td data-label="RNR" class="">
          <a :href="'/follow-up-enquiries?type=13&name='+client.name+'&fp='+client.id">  
          <pill
            type="danger"
            :text="totalRNR(client.enqs.split)"
            />
            </a>
        </td>
        <td data-label="SW - NR" class="">
          <a :href="'/follow-up-enquiries?type=15&name='+client.name+'&fp='+client.id">  
            <pill
            type="danger"
            :text="totalSW(client.enqs.split)"
            />
            </a>
        </td>
        <td data-label="Escalation" class="">
          <a :href="'/follow-up-enquiries?type=3&name='+client.name+'&fp='+client.id">  
          <pill
            type="success"
            :text="totalEscalation(client.enqs.split)"
            />
            </a>
        </td>
        <td data-label="Enquiry" class="">
          <a :href="'/follow-up-enquiries?type=1&name='+client.name+'&fp='+client.id">  
          <pill
            type="success"
            :text="totalEnquiry(client.enqs.split)"
            />
            </a>
        </td>
        <td data-label="Coming" class="">
          <a :href="'/follow-up-enquiries?type=4&name='+client.name+'&fp='+client.id">  
          <pill
            type="success"
            :text="totalComing(client.enqs.split)"
            />
            </a>
        </td>
        <td data-label="Need Online" class="">
          <a :href="'/follow-up-enquiries?type=6&name='+client.name+'&fp='+client.id">  
          <pill
            type="success"
            :text="totalNeedOnline(client.enqs.split)"
            />
            </a>
        </td>
        <td data-label="Joined Within" class="">
          <a :href="'/follow-up-enquiries?type=7&name='+client.name+'&fp='+client.id">  
          <pill
            type="success"
            :text="totalAlreadyJoined(client.enqs.split)"
            />
            </a>
        </td>
        <td data-label="Not interested" class="">
          <a :href="'/follow-up-enquiries?type=8&name='+client.name+'&fp='+client.id">  
          <pill
            type="info"
            :text="totalNI(client.enqs.split)"
            />
            </a>

        </td>
        <td data-label="Got Job" class="">
          <a :href="'/follow-up-enquiries?type=9&name='+client.name+'&fp='+client.id">  
            <pill
            type="info"
            :text="totalGotJob(client.enqs.split)"
            />
            </a>
        </td>
        <td data-label="Joined Outside" class="">
          <a :href="'/follow-up-enquiries?type=10&name='+client.name+'&fp='+client.id">  
            <pill
            type="info"
            :text="totalJoinedOutside(client.enqs.split)"
            />
            </a>
        </td>

        <td data-label="Next Batch" class="">
          <a :href="'/follow-up-enquiries?type=14&name='+client.name+'&fp='+client.id">  
            <pill
            type="info"
            :text="totalNB(client.enqs.split)"
            />
            </a>
        </td>
      
        <!-- <td data-label="Actions">
          <small class="text-gray-500 dark:text-gray-300">
            <jb-button label="Already joined" color="orange" @click="openAJModal(client.CallRecordID, client.CallRecord.name)" small class="mr-1 mb-1" />
          </small>
        </td> -->
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