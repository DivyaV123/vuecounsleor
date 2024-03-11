<script setup>
import { computed, reactive, ref } from "vue";
import {
  mdiBookEducation,
  mdiPlusBox,
  mdiMicrophone,
} from "@mdi/js";
import CheckboxCell from "@/components/CheckboxCell.vue";
import Level from "@/components/Level.vue";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import ModalAddToMe from "@/components/ModalAddToMe.vue";
import ModalDifferentBranch from "@/components/ModalDifferentBranch.vue";
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";
import { sessionStore } from "../stores/session";
import axios from 'axios';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import ModalComment from "@/components/ModalComment.vue"
import Popper  from "vue3-popper";
import ModalEnquiryRecord from "@/components/ModalEnquiryRecord.vue";

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

const branches = computed(() =>{
  const getBranches = [];
  for(var brnh of user.user.branches){
    getBranches.push(brnh.id);
  }
  return getBranches
})

const itemsmap=computed(() => {
  return counselor.obs
})
const itemsPaginated = computed(() => {

  if(counselor.oBToMe && counselor.oBToMe.items){
    return counselor.oBToMe.items
  }
  // const getItems = [];
  // if(counselor.oBToMe && counselor.oBToMe.items){
  //   counselor.oBToMe.items.forEach((obt) => {
  //     if(obt.courses){
  //     for (var crs of obt.courses) {
  //       for (var brch of user.user.branches) {
  //         if (brch.id === crs.branch.id) {
  //           getItems.push(obt);
  //           break;
  //         }
  //       }
  //     }}
  //   });
  //   return getItems;
  // }
});

const itemsCount = computed(() => {
  if(counselor.oBToMe && counselor.oBToMe.total){
      return counselor.oBToMe.total
  } 
}
);

const confirmRefresh = async () => {
  pageLoading.value = true
  await counselor.getOBToMe(currentPage.value-1);
  pageLoading.value = false
};
const propValues = reactive({
  id: 0,
  name: "",
  highest_degree: {},
  yop:"",
  courses: [],
  records: [],
  commentid:"",
  commentname:"",
  commentdata:""
});

const isAcademicsActive = ref(false);

const searchActive = computed(() => counselor.isEnquirySearchActive);

const searchQuery = ref("");

const searchParams = async (search) => {
  if (search.length > 0) {
    searchQuery.value = search;
    counselor.oBToMe(1, search);
  } else {
    searchQuery.value = "";
    counselor.oBToMe();
  }
};

const searchOpen = () => {
  counselor.searchOpenclose();
};



const isModalAddActive = ref(false);

const openAddModal = (id, name) => {
  isModalAddActive.value = true;
  propValues.id = id;
  propValues.name = name;
};

const isModalMoveActive = ref(false);
const isModalComment= ref(false);

const openMoveModal = (id, name) => {
  isModalMoveActive.value = true;
  propValues.id = id;
  propValues.name = name;
};

const commentmodal =(id,name)=>{
  isModalComment.value=true;
  propValues.commentid=id;
  propValues.commentname=name
  propValues.commentdata="obToMe enq"

}


const isModalRecordActive = ref(false);
const openRecordModal = (id, name, records) => {
  // if (records.length > 0) {
    isModalRecordActive.value = true;
    propValues.id = id;
    propValues.name = name;
    propValues.records = records;
  // } else {
  //   theme.pushMessage("No record Found!");
  // }
};

function checkDetails(courses){
  let userId = user.user.uid
  for(var i = 0;i < courses.length;i++){
    if(courses[i].details){
      for(var p = 0;p < courses[i].details.length;p++){
      if(courses[i].details[p].id === userId){
        return true
      }
    }
    }
  }
  return false
};

const checkSync = async(id) => {
  pageLoading.value = true
  if (user.token) {
                const headers = {
                    'Authorization': user.token,
                    "Content-Type": "application/json",
                }
                try {
                    await axios.post(`https://gotest.qspiders.com/api/counselor/sync-me`, {"id":id}, { headers }).then(
                        async function (response) {
                            if(response.data.error){
                              theme.pushMessage(response.data.error)
                            }
                            else{
                              theme.pushMessage(response.data.message)
                              await counselor.getOBToMe(currentPage.value - 1);
                            }
                        }
                    ).catch(function (error) {
                        if (error.response) {
                            if (error.response.status === 400) {
                                theme.pushMessage(error.response.data.error)
                            }
                        }
                        else if (error.request) { }
                        else { }
                    });
                }
                catch (err) {
                    theme.pushMessage(err)
                }
            }
  pageLoading.value = false
};

const currentPage = ref(1);

const checkedRows = ref([]);

const maskNumber = (number) => {
  if(number){
  return number.replace(/\d(?=\d{4})/g, "*");
}};
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
  if (searchQuery.value.length > 0) {
    await counselor.getOBToMe(page, searchQuery.value);
  } else {
    await counselor.getOBToMe(page);
  }
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

const bdata=ref(false)
const commentdata=ref([])
const returndata=ref([])
const datahover=async(a,b)=>{
  commentdata.value=[]
  returndata.value=[]
const branchid=ref(null)
const setid=ref(null)
  b.filter(branch=>{
    if(branch.authorbranch){
      branch.authorbranch.filter(data=>{
        a.filter(set=>{
          if(data.id==set.id){
            if( branch.role=='counselor'){
              commentdata.value.push(branch)
              data=[],
              branch=[]
            }
          }
          })   
      })
    }
  })
  const reversedKeys = Object.keys(commentdata.value).reverse();
  reversedKeys.forEach(key => {
    returndata.value.push(commentdata.value[key])
});

}
</script>

<template>
    <modal-comment
    v-if="isModalComment"
    v-model="isModalComment"
    :title="'Add comment ' + propValues.commentname"
    :id="propValues.commentid"
    :commentdata="propValues.commentdata"
    @confirm="confirmRefresh"
    has-cancel
  >
  </modal-comment>
  <modal-add-to-me v-if="isModalAddActive" v-model="isModalAddActive"
    :title="'Add to me for' + propValues.name" :id="propValues.id"
    @confirm="confirmRefresh" has-cancel>
  </modal-add-to-me>
  <modal-different-branch v-if="isModalMoveActive" v-model="isModalMoveActive"
    :title="'Move to different branch for ' + propValues.name" :id="propValues.id"
    @confirm="confirmRefresh" has-cancel>
  </modal-different-branch>
  <modal-enquiry-record
    v-if="isModalRecordActive"
    v-model="isModalRecordActive"
    :title="'Call record details of ' + propValues.name"
    :id="propValues.id"
    :records="propValues.records"
    @confirm="confirmRefresh"
    has-cancel
  >
  </modal-enquiry-record>
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
    <thead class="sticky top-[71px] z-[1] bg-gray-900">
      <tr>
        <th v-if="checkable" />
        <th>Name</th>
        <th>Academics</th>
        <th>Contact</th>
        <th>Record</th>
        <!-- <th><icon :path="mdiMicrophone" size="21" class="text-sky-500 dark:text-sky-400 hover:text-sky-200 hover:dark:text-sky-200 hover:bg-slate-800 rounded-xl" /></th> -->
        <th>Course-Modeofclass</th>
        <th>Passed Date</th>
        <th>Timings</th>
        <!-- <th>Created</th> -->
        <!-- <th>Email</th> -->
        <!-- <th>Status</th> -->
        <th>Comment</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="[ index,client] in itemsmap" :key="client.id"
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
        <td data-label="Academics">
          <span v-if="client.enquiry.experienced === true" class="text-cyan-400" >
            <small> Experienced Enquiry </small>
          </span>
          <span v-else-if="client.enquiry.data_not_taken === true && client.enquiry.experienced === false">
            <small v-if="client.education" class="text-gray-500 dark:text-gray-300 capitalize">
              <!-- <jb-button
                color="info"
                outline
                :icon="mdiPlusBox"
                @click="
                  openAcademicModal(
                    client.id,
                    client.name,
                    client.education.highest_degree,
                    client.education.yop
                  )
                "
                small
              /> -->
            </small>
          </span>
          <span v-else>
            <span v-if="client.education">
              <span v-if="client.education.percentage !== null">
              <jb-button
                v-if="client.education.percentage"
                color="success"
                :icon="mdiBookEducation"
                class="mr-1 cursor-default capitalize"
                small
              />
              <jb-button
                v-else
                color="danger"
                :icon="mdiBookEducation"
                small
                class="mr-1 capitalize"
              />
            </span>
            <span v-if="client.education.otherdegree === ''">
              <small
                v-if="client.education.name"
                class="text-gray-500 dark:text-gray-300 capitalize"
              >
                {{ client.education.name.shortname }},
              </small>
              <small
                v-if="client.education.stream_object!=null"
                class="text-gray-500 dark:text-gray-300 capitalize"
              >
                {{ client.education.stream_object.shortname }}
              </small>
            </span>
            </span>
          </span>
          <small v-if="client.education && client.education.yop && client.enquiry.experienced === false" class="text-gray-400">
            - <span class="text-gray-500 dark:text-gray-300 capitalize">{{client.education.yop }} </span>
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
        <td data-label="Record">
          <button @click="openRecordModal(client.id, client.name, client.records)">
          <icon :path="mdiMicrophone" size="21" class="text-sky-500 dark:text-sky-400 hover:text-sky-200 hover:dark:text-sky-200 hover:bg-slate-800 rounded-xl" />
          </button>
        </td>
        <td data-label="Course">
          <span v-for="(course, i) in client.other_courses" :key="i">
            <small v-if="course.course && branches.includes(course.branch.id)" class="text-gray-100 dark:text-gray-200">
              {{ course.course.name }}
              <span class="text-lime-200"> - {{ course.mode_class.name }}</span><br>
              <!-- <span class="text-gray-500 dark:text-gray-300"> - {{ dayjs(course.agreed_date).format("DD-MMM-YY") }}</span>  -->
              <!-- <span class="text-red-500 dark:text-red-300 font-semibold"> - {{ dayjs(course.date).format("DD-MMM-YY hh:mm A") }}</span><br/> -->
            </small>
          </span>
        </td>

        <td data-label="Passed Date">
          <span v-for="(course, i) in client.other_courses" :key="i">
            <small v-if="course.course && branches.includes(course.branch.id)" class="text-gray-100 dark:text-gray-200">
              <!-- {{ course.course.name }}
              <span class="text-lime-200"> - {{ course.mode_class.name }}</span> -->
              <!-- <span class="text-gray-500 dark:text-gray-300"> - {{ dayjs(course.agreed_date).format("DD-MMM-YY") }}</span>  -->
              <!-- {{dayjs(course.date).utc().format("DD-MMM-YY hh:mm A")}}
              {{course.date}} -->

            <span class="text-red-500 dark:text-red-300 font-semibold"> 
            {{dayjs(course.date).add(5.5,'h').format("DD-MMM-YY hh:mm A")}} 
            </span><br/>
            </small>
          </span>
        </td>
        <td data-label="Timings">
          <small>
            <span v-if="client.enquiry && client.enquiry.class_timing" class="text-amber-100"> 
              {{ client.enquiry.class_timing.name }}
            </span>
            <span class="text-neutral-300" v-for="(ts, i) in client.enquiry.time_slot" :key="i">
              / {{ ts.name }} 
            </span>
          </small>
        </td>

        <!-- <td data-label="Created">
          <small>
            <span v-if="client.created" class="text-amber-100"> 
              {{ dayjs(client.created).utc().format("DD-MMM-YY hh:mm A") }}
            </span>
          </small>
        </td> -->
        <!-- <td data-label="Email">
          <span class="mr-1" v-for="(email, i) in client.email" :key="i">
            <small class="text-gray-500 dark:text-gray-300">
              <a class="" :href="'mailto:' + email.email">
                <jb-button color="warning" :icon="mdiEmail" small />
              </a>
            </small>
          </span>
        </td> -->
        <!-- <td data-label="Status" v-if="client.records">
          <small v-if="client.records.length > 0" class="text-gray-400 dark:text-gray-300 font-semibold">
            <span v-if="client.records.slice(-1)[0].status">{{client.records.slice(-1)[0].status.name}}
            <span v-if="client.records.slice(-1)[0].status.substatus"> - {{client.records.slice(-1)[0].status.substatus.name}} </span>
            </span>
            <span v-else class="text-gray-400 dark:text-gray-400 font-semibold">No status</span>
          </small>
          <small v-else class="text-gray-400 dark:text-gray-400 font-semibold">No status</small>
        </td>
        <td v-else></td> -->
        <td data-label="Comments">      
            <small class="text-gray-200 dark:text-gray-300" v-if="client.comment">
              <Popper hover placement="left">
              <button @mouseover="datahover(user.user.branches,client.comment)" >Hover</button>
              <template #content >
                <span v-if="commentdata&&commentdata.length">
                <p class="pb-1"  v-for="(com, i) in returndata" :key="i">
                  {{ com.comment }} by <span class="italic text-orange-500">{{ com.authorname }}</span> added on <span class="italic text-orange-500">{{ dayjs(com.date).format("DD-MM-YY hh:mm A") }}</span>
                </p>
              </span>
                <span v-else>
                 <span class="italic text-orange-500">no comments</span>
                </span>
              </template>
            </Popper>
          </small>
        </td>
        
        <td data-label="Actions">
          <span v-if="checkDetails(client.other_courses)">
            <jb-button
              label="Sync"
              color="danger"
              small
              class="mr-1 mb-1"
              @click="checkSync(client.id)"
            />
          </span>
          <span v-else>
          <small class="text-gray-500 dark:text-gray-300">
            <jb-button
              label="Add to me"
              color="orange"
              small
              class="mr-1 mb-1"
              @click="openAddModal(client.id, client.name)"
            />
            <jb-button
              label="Move to different branch"
              color="info"
              small
              @click="openMoveModal(client.id, client.name)"
            />
          </small>
          </span>
          <span >
              <jb-button
                label="Comment"
                color="orange"
                small
                outline
                @click="commentmodal(client.id, client.name)"
                class="mr-1 mb-1 text-gray-300 text-xs py-1 hover:bg-transparent"
              />
            </span>
        </td>
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


<style>
:root {
   --popper-theme-background-color: #333333;
   --popper-theme-background-color-hover: #333333;
   --popper-theme-text-color: #ffffff;
   --popper-theme-border-width: 0px;
   --popper-theme-border-style: solid;
   --popper-theme-border-radius: 6px;
   --popper-theme-padding: 16px;
   --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
 }
</style>