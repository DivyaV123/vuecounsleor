<script setup>
import { computed, reactive, ref, onMounted, onBeforeMount } from "vue";
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
import ModalContact from "@/components/ModalContact.vue";
import ModalEmail from "@/components/ModalEmail.vue";
import ModalCourse from "@/components/ModalCourse.vue";
import ModalEnquiryRecord from "@/components/ModalEnquiryRecord.vue";
import ModalEscalate from "@/components/ModalEscalate.vue";
import ModalRemove from "@/components/ModalRemove.vue";
import ModalOnline from "@/components/ModalOnline.vue";
import RightEnquirySearch from "@/components/RightEnquirySearch.vue";
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";
import { sessionStore } from "../stores/session";
import ModalComment from "@/components/ModalComment.vue"
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import Popper  from "vue3-popper";
dayjs.extend(utc)
const user = sessionStore();
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

const checkable = ref(false);
const pageLoading = ref(false);
const lightBorderStyle = computed(() => theme.lightBorderStyle);

const lightBgStyle = computed(() => theme.lightBgStyle);

const tableTrStyle = computed(() => theme.tableTrStyle);

const tableTrOddStyle = computed(() => theme.tableTrOddStyle);

const darkMode = computed(() => theme.darkMode);

const itemsPaginated = computed(() => {
  if (counselor.rigidEnquiries && counselor.rigidEnquiries.items) {
    return counselor.rigidEnquiries.items
  }
});

const itemsCount = computed(() => {
  if (counselor.rigidEnquiries && counselor.rigidEnquiries.total) {
    return counselor.rigidEnquiries.total;
  }
});


const branches = computed(() =>{
  const getBranches = [];
  for(var brnh of user.user.branches){
    getBranches.push(brnh.id);
  }
  return getBranches
})

const confirmRefresh = async () => {
  pageLoading.value = true;
  await counselor.getRigidEnquiries(currentPage.value - 1);
  pageLoading.value = false;
};
const propValues = reactive({
  id: 0,
  name: "",
  highest_degree: {},
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
  pageLoading.value = true;
  if (search.length > 0) {
    searchQuery.value = search;
    currentPage.value=0
    await counselor.getRigidEnquiries(0, search);
  } else {
    searchQuery.value = "";
    await counselor.getRigidEnquiries();
  }
  pageLoading.value = false;
};

const searchOpen = async () => {
  counselor.searchOpenclose();
};

const openAcademicModal = (id, name, highest_degree) => {
  isAcademicsActive.value = true;
  propValues.id = id;
  propValues.name = name;
  propValues.highest_degree = highest_degree;
};

const isModalContactActive = ref(false);

const openContactModal = (id, name) => {
  isModalContactActive.value = true;
  propValues.id = id;
  propValues.name = name;
};

const isModalEmailActive = ref(false);

const openEmailModal = (id, name) => {
  isModalEmailActive.value = true;
  propValues.id = id;
  propValues.name = name;
};

const isModalCourseActive = ref(false);

const openCourseModal = (id, name) => {
  isModalCourseActive.value = true;
  propValues.id = id;
  propValues.name = name;
};

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

const isModalEscalateActive = ref(false);

const openEscalateModal = (id, name) => {
  isModalEscalateActive.value = true;
  propValues.id = id;
  propValues.name = name;
};

const isModalRemoveActive = ref(false);

const openRemoveModal = (id, name) => {
  isModalRemoveActive.value = true;
  propValues.id = id;
  propValues.name = name;
};

const isModalOnlineActive = ref(false);
const isModalComment= ref(false);

const openOnlineModal = (id, name, courses) => {
  isModalOnlineActive.value = true;
  propValues.id = id;
  propValues.name = name;
  propValues.courses = courses;
};

const commentmodal =(id,name)=>{
  isModalComment.value=true;
  propValues.commentid=id;
  propValues.commentname=name,
  propValues.commentdata="rigid enq"
}

const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*");
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
  pageLoading.value = true;
  currentPage.value = page + 1;
  if (searchQuery.value.length > 0) {
    await counselor.getRigidEnquiries(page, searchQuery.value);
  } else {
    await counselor.getRigidEnquiries(page);
  }
  pageLoading.value = false;
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
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
  <modal-academics
    v-if="isAcademicsActive"
    v-model="isAcademicsActive"
    :title="'Add Academic details of ' + propValues.name"
    :id="propValues.id"
    :highest_degree="propValues.highest_degree"
    @confirm="confirmRefresh"
    has-cancel
  >
  </modal-academics>
  <modal-contact
    v-if="isModalContactActive"
    v-model="isModalContactActive"
    :title="'Add contact details of ' + propValues.name"
    :id="propValues.id"
    @confirm="confirmRefresh"
    has-cancel
  >
  </modal-contact>
  <modal-email
    v-if="isModalEmailActive"
    v-model="isModalEmailActive"
    :title="'Add email details of ' + propValues.name"
    :id="propValues.id"
    @confirm="confirmRefresh"
    has-cancel
  >
  </modal-email>
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
  <modal-course
    v-if="isModalCourseActive"
    v-model="isModalCourseActive"
    :title="'Add course details of ' + propValues.name"
    :id="propValues.id"
    @confirm="confirmRefresh"
    has-cancel
  >
  </modal-course>
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
  <modal-escalate
    v-if="isModalEscalateActive"
    v-model="isModalEscalateActive"
    :title="'Escalate ' + propValues.name"
    :id="propValues.id"
    @confirm="confirmRefresh"
    has-cancel
  >
  </modal-escalate>
  <modal-remove
    v-if="isModalRemoveActive"
    v-model="isModalRemoveActive"
    :title="'Remove ' + propValues.name"
    :id="propValues.id"
    @confirm="confirmRefresh"
    has-cancel
  >
  </modal-remove>
  <modal-online
    v-if="isModalOnlineActive"
    v-model="isModalOnlineActive"
    :title="'Move course to online for ' + propValues.name"
    :id="propValues.id"
    :courses="propValues.courses"
    @confirm="confirmRefresh"
    has-cancel
  >
  </modal-online>
  <div
    v-if="pageLoading"
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
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">
      This may take a few seconds, please wait.
    </p>
  </div>
  <div class="flex justify-start w-full bg-[#151D2B] sticky top-[71px] z-[9] pb-1 pt-2">
  <jb-button
    label="search"
    :icon="mdiAccountSearch"
    small
    :color="searchActive ? 'success' : 'info'"
    @click="searchOpen()"
  />
 
</div>

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

  <div v-if="itemsPaginated  && itemsPaginated.length>0">
  <table class="">
    <thead class="sticky top-[102px] z-[1] bg-gray-900">
      <tr>
        <th v-if="checkable" />
        <th>Name</th>
        <!-- <th>Academics</th> -->
        <th>Contact</th>
        <th>Course-Modeofclass</th>
        <th>Timings</th>
        <th>Record</th>
        <th>Email</th>
        <th>Status</th>
        <th>Comment</th>
        <th>DOE & Time</th>
        <th>Actions</th>
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
          <small class="font-semibold capitalize">
            <span
              v-if="client.enquiry.data_not_taken === true"
              class="text-yellow-600"
            >
            <span v-if="client.details && client.details.message && client.details.message.length != 0" class="text-red-400 text-base" >!</span>
              {{ client.name }}
              <span v-if="client.enquiry.enq_for_someone === true"
                >({{ client.enquiry.enquiree_name }})</span
              >
            </span>
            <span v-else-if="client.enquiry.experienced === true" class="text-sky-400">
              <span v-if="client.details && client.details.message && client.details.message.length != 0" class="text-red-400 text-base" >!</span>
              {{ client.name }}
              <span v-if="client.enquiry.enq_for_someone === true"
                >({{ client.enquiry.enquiree_name }})</span
              >
            </span>
            <span v-else class="text-gray-200 dark:text-gray-300">
              <span v-if="client.details && client.details.message && client.details.message.length != 0" class="text-red-400 text-base" >!</span>
              {{ client.name }}
              <span v-if="client.enquiry.enq_for_someone === true"
                >({{ client.enquiry.enquiree_name }})</span
              >
            </span>
          </small>
        </td>
        <!-- <td data-label="Academics">
          <span v-if="client.enquiry.experienced === true" class="text-cyan-400" >
            <small> Experienced Enquiry </small>
          </span>
          <span v-else-if="client.enquiry.data_not_taken === true && client.enquiry.experienced === false">
            <small v-if="client.education" class="text-gray-500 dark:text-gray-300 capitalize">
              <jb-button
                color="info"
                outline
                :icon="mdiPlusBox"
                @click="
                  openAcademicModal(
                    client.id,
                    client.name,
                    client.education.highest_degree
                  )
                "
                small
              />
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
            <span v-if="client.education.stream_object !== null">
              <small
                v-if="client.education.name"
                class="text-gray-500 dark:text-gray-300 capitalize"
              >
                {{ client.education.name.shortname }},
              </small>
              <small
                v-if="client.education.stream_object"
                class="text-gray-500 dark:text-gray-300 capitalize"
              >
                {{ client.education.stream_object.shortname }}
              </small>
            </span>
            </span>
          </span>
        </td> -->
        <td data-label="Contact">
          <!-- <jb-button
            color="info"
            :icon="mdiPlusBox"
            outline
            small
            class="mr-1"
            @click="openContactModal(client.id, client.name)"
          /> -->
          <span>
            <span v-if="client.enquiry.enq_for_someone === true">
              <span v-for="(contact, i) in client.contact" :key="i">
                <small v-if="i > 0" class="text-gray-400 dark:text-gray-300 capitalize">
                  <a class="" :href="'tel:' + contact.code + contact.number">
                    {{(contact.code + contact.number)}}
                    <!-- // maskNumber(contact.code + contact.number) -->
                  </a>
                  &nbsp;
                </small>
              </span>
              <small>
              <a class="" :href="'tel:' + client.contact[0].code + client.contact[0].number">
               ({{(client.contact[0].code + client.contact[0].number)}})
                  <!-- // maskNumber(client.contact[0].code + client.contact[0].number) -->
                </a></small>
            </span>
            <span v-else>
              <span v-for="(contact, i) in client.contact" :key="i">
                <small class="text-gray-400 dark:text-gray-300 capitalize">
                  <a class="" :href="'tel:' + contact.code + contact.number">
             {{(contact.code + contact.number)}}
                    <!-- // maskNumber(contact.code + contact.number) -->
                  </a>
                  &nbsp;
                </small>
              </span>
            </span>
          </span>
        </td>
        <td data-label="Course">
          <!-- <jb-button
            color="info"
            :icon="mdiPlusBox"
            outline
            small
            class="mr-1"
            @click="openCourseModal(client.id, client.name)"
          /> -->
          <span v-for="(course, i) in client.courses" :key="i">
            <small v-if="course.course" class="text-gray-100 dark:text-gray-200">
              {{ course.course.name }}
              <span class="text-lime-200"> - {{ course.mode_class.name }}</span>
              <!-- <span class="text-gray-500 dark:text-gray-300"> - {{ dayjs(course.agreed_date).format("DD-MMM-YY") }}</span> -->
               <br/>
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
        <td data-label="Record">
          <button @click="openRecordModal(client.id, client.name, client.records)">
          <icon :path="mdiMicrophone" size="21" class="text-sky-500 dark:text-sky-400 hover:text-sky-200 hover:dark:text-sky-200 hover:bg-slate-800 rounded-xl" />
          </button>
          <!-- v-if="client.records.length > 0" 
          :label="client.records.length" -->
          <!-- <jb-button
            color="info"
            :icon="mdiMicrophone"
            small
            @click="openRecordModal(client.id, client.name, client.records)"
          /> -->
          <!-- <jb-button
            v-else
            color="danger"
            :icon="mdiMicrophone"
            small
            @click="openRecordModal(client.id, client.name, client.records)"
          /> -->
        </td>
        <td data-label="Email">
          <!-- <jb-button
            class="mr-1"
            color="info"
            :icon="mdiPlusBox"
            outline
            small
            @click="openEmailModal(client.id, client.name)"
          /> -->
          <span class="mr-1" v-for="(email, i) in client.email" :key="i">
            <small class="text-gray-500 dark:text-gray-300 capitalize">
              <a class="" :href="'mailto:' + email.email">
                <jb-button color="warning" :icon="mdiEmail" small class="mt-1"/>
              </a>
            </small>
          </span>
        </td>
        <td data-label="Status">
          <small v-if="client.records && client.records.length > 0" class="text-gray-400 dark:text-gray-300 font-semibold capitalize">
            <span v-if="client.records.slice(-1)[0].status">{{client.records.slice(-1)[0].status.name}}
              <span v-if="client.records.slice(-1)[0].status.substatus"> - {{client.records.slice(-1)[0].status.substatus.name}} </span>
              <!-- <span v-if="client.records.slice(-1)[0].status.comment"> - {{client.records.slice(-1)[0].status.comment}}</span> -->
            </span>
            <span v-else class="text-gray-400 dark:text-gray-400">No status</span>
          </small>
          <small v-else class="text-gray-400 dark:text-gray-400">No status</small>
        </td>
<!--   -->
<!-- {{ client.comment }} -->
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

        <td data-label="DOE">
          <small>
            {{ dayjs(client.created).format("DD-MMM-YY hh:mm A") }}
          </small>
        </td>

        <td data-label="Actions" >
          <small class="text-gray-500 dark:text-gray-300 capitalize text-sm">
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
          </small>
        </td>
      </tr>
    </tbody>
  </table>
  <div
    :class="lightBorderStyle"
    class="p-3 lg:px-6 border-t dark:border-gray-800 sticky bg-[#151D2B] bottom-0 z-[9]"
  >
    <level mobile>
      <jb-buttons>
        <jb-button
          v-for="page in pagesList"
          :key="page"
          :class="currentPage === page ? 'bg-gray-500' : ''"
          :active-soft="page === currentPage"
          :label="page"
          addon
          :outline="darkMode"
          small
          no-focus-ring
          @click="currentPage != page ? pageChange(page - 1) : ''"
        />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </level>
  </div>
</div>
<div v-else>
    <span class="p-1 flex justify-center text-red-500 font-semibold text-xl mt-10">Rigid Enquiries Not Found <br/></span>
  </div>
  <right-enquiry-search @search="searchParams" />
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