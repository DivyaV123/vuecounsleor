<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { mdiClose, mdiAccount, mdiPhone, mdiMail } from "@mdi/js";
import CardComponent from "@/components/CardComponent.vue";
import Divider from "@/components/Divider.vue";
import Icon from "@/components/Icon.vue";
import Control from "@/components/Control.vue";
import Multiselect from "@vueform/multiselect";
import Field from "@/components/Field.vue";
import { selectClasses } from "../selectcss";
import { counselorStore } from "../stores/counselor";
import JbButton from "@/components/JbButton.vue";
import { themeStore } from "../stores/theme";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import CheckRadioPicker from "@/components/CheckRadioPicker.vue";
const counselor = counselorStore();
const theme = themeStore();
const dates_value = ref(null)
dayjs.extend(utc)
const userbranch=ref(false)

onBeforeMount(async () => {
  // await counselor.getFormValues();
  await counselor.getCourses();
  await counselor.getClassTiming();
  await counselor.getTimeSlots();  
  await counselor.getHighestDegree();
  await counselor.getAllBranches();
  await counselor.getModeEnquiry();
  await counselor.getuserassignbranch();
  if(window.location.pathname==='/all-enquiries'){
    userbranch.value=true
  }

  dates_value.value = dayjs(new Date).format("YYYY-MM-DD")
});

const emit = defineEmits(["search"]);

const isEnquirySearchActive = computed(() => counselor.isEnquirySearchActive);

const mode = computed(() => counselor.mode.items);
const classtiming = computed(() => counselor.classtiming.items);
const timeslot = computed(() => counselor.timeslot);
const highestdegree = computed(() => counselor.highestdegree.items);
const branches = computed(() => counselor.all_branches);
const assigned_branch=computed(()=> counselor.assign_branch)

// const courses = computed(() => counselor.courses);
// const courses = computed(() => {
//   if (counselor.courses && counselor.courses.my_branches) {
//     return counselor.courses.my_branches;
//   }
// });

const courses = computed(() => {
  if (counselor.courses && counselor.courses.courses) {
    return counselor.courses.courses;
  }
});

const callDone = [
  { id: 0, name: "No calls" },
  { id: 1, name: "1 or greater calls" },
];

const name = ref("");
const nameError = ref(false);
const contact = ref("");
const contactError = ref(false);
const email = ref("");
const emailError = ref(false);
const course = ref([]);
const ag_from = ref("");
const ag_to = ref("");
const e_from = ref("");
const e_to = ref("");
const timeSlot = ref([]);
const classTiming = ref([]);
const highest_degree = ref(null)
const moe = ref(null)
const branch = ref(null)
const experienced = ref(false)
const checkString = (text) => {
  var letters = /^[a-zA-Z\s]*$/;
  if (text.match(letters)) {
    return true;
  } else {
    return false;
  }
};

const validEmail = (email) => {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(mailformat)) {
    return true;
  } else {
    return false;
  }
};

const convertMultiple = (value) => {
  let conCat = "";
  for (let i = 0; i < value.length; i++) {
    if (conCat && conCat.length > 0) {
      conCat = conCat + ',' + value[i];
    }
    else{
      conCat = conCat + value[i];
    }
  }
  return conCat;
};

const closeSearch = () => {
  counselor.searchOpenclose();
};

const clear = async () => {
  name.value = "";
  contact.value = "";
  email.value = "";
  course.value = [];
  // ag_from.value = "";
  // ag_to.value = "";
  e_from.value = "";
  e_to.value = "";
  timeSlot.value = [];
  classTiming.value = [];
  highest_degree.value=null;
  moe.value=null;
  branch.value=null;
  experienced.value=false;
  emit("search", "","currentPage","0");
};

const submit = async () => {
  let valid = true;
  let searchString = "";
  if (name.value.length > 0 && !checkString(name.value)) {
    valid = false;
    theme.pushMessage("Student Name not valid!");
  } else {
    searchString += "&name=" + name.value;
  }
  if (
    contact.value.length > 0 &&
    (contact.value.length < 10 || isNaN(contact.value))
  ) {
    valid = false;
    theme.pushMessage("Contact number should be minimum 10 digits");
  } else {
    searchString += "&contact=" + contact.value;
  }
  if (email.value.length > 0 && !validEmail(email.value)) {
    valid = false;
    theme.pushMessage("Email is not valid");
  } else {
    searchString += "&email=" + email.value;
  }
  if (course.value.length > 0) {
    searchString += "&courses=" + convertMultiple(course.value);
  }
  if (timeSlot.value.length > 0) {
    searchString += "&time_slot=" + convertMultiple(timeSlot.value);
  }
  if (classTiming.value.length > 0) {
    searchString += "&class_timings=" + convertMultiple(classTiming.value);
  }
  // if (ag_from.value.length > 0) {
  //   searchString += "&agreed_date_from=" + ag_from.value;
  // }
  // if (ag_to.value.length > 0) {
  //   searchString += "&agreed_date_to=" + ag_to.value;
  // }
  if (e_from.value.length > 0) {
    searchString += "&agreed_date_from=" + e_from.value;
  }
  if (e_to.value.length > 0) {
    searchString += "&agreed_date_to=" + e_to.value;
  }
  if (highest_degree.value!=null) {
    searchString += "&hdegree=" + highest_degree.value;
  }
  if (moe.value!=null) {
    searchString += "&moe=" + moe.value;
  }
  if (branch.value!=null) {
    searchString += "&branches=" + convertMultiple(branch.value);
  }
  searchString += "&eenq=" + experienced.value;
  if (valid) {
    emit("search", searchString);
  } else {
    theme.pushMessage("Search form has errors!");
  }
};
</script>

<template>
  <aside
    id="aside-right"
    class="
      w-60
     
      fixed
      z-[9]
      h-screen
      lg:h-screen-menu
      top-0
      lg:top-[75px]
      bg-white
      border-l border-gray-100
      overflow-y-scroll
      transition-position
      dark:bg-gray-900
      dark:border-gray-700
      dark:scrollbar-thumb-gray-600
      dark:scrollbar-track-gray-800
    "
    :class="{
      'right-0': isEnquirySearchActive,
      '-right-60': !isEnquirySearchActive,
    }"
  >
    <div>
      <card-component
        title="Search Enquiry"
        class="mb-4"
        :header-icon="mdiClose"
        @header-icon-click="closeSearch()"
      >
        <control
          v-model="name"
          :icon-left="mdiAccount"
          placeholder="Student Name"
          class="mb-4 padding-space  mt-2 ml-2 mr-2"
        />
        <control
          v-model="contact"
          :icon-left="mdiPhone"
          placeholder="Mobile"
          class="mb-4 padding-space ml-2 mr-2"
        />
        <control
          v-model="email"
          :icon-left="mdiMail"
          placeholder="Email"
          class="mb-4 padding-space ml-2 mr-2"
        />
        <!-- <field  >
          <check-radio-picker
            v-model="experienced"
            name="experienced"
            class="border-gray-400"
            :options="{ true: 'Experienced Enquiry' }"
          />
        </field> -->
        <field>
          <Multiselect
            v-model="course"
            :options="courses"
            valueProp="name"
            label="name"
            placeholder="Select course"
            searchable
            trackBy="name"
            :classes="selectClasses"
            mode="multiple"
            class="mb-2 border-gray-700 h-9 ml-2 mr-2"
          />
        </field>
        <!-- <control
          class="mb-4 ml-2 mr-2"
          v-model="ag_from"
          type="date"
          help="Student coming date From"
        />
        <control
          class="mb-4 ml-2 mr-2"
          v-model="ag_to"
          type="date"
          help="Student coming date To"
        /> -->
        <control
          class="mb-4 ml-2 mr-2"
          v-model="e_from"
          type="date"
          help="Date of Enquiry from"
        />
        <!-- <control
          class="mb-4 ml-2 mr-2"
          v-model="e_to"
          type="date"
          :max="dates_value"
          help="Date of Enquiry to"
        /> -->
        <field help="Date of Enquiry to">
          <input type=date v-model="e_to"  :max="dates_value"  class="bg-gray-800 w-11/12 border border-1 border-gray-400 h-[35px] ml-2 rounded"  required />
        </field>
        <field>
          <Multiselect
            v-model="timeSlot"
            :options="timeslot"
            valueProp="id"
            label="name"
            placeholder="Time Slot"
            searchable
            trackBy="name"
            :classes="selectClasses"
            class="mb-2 border-gray-700 h-9 ml-2 mr-2"
            mode="multiple"
          />
        </field>
        <field>
          <Multiselect
            v-model="classTiming"
            :options="classtiming"
            valueProp="id"
            label="name"
            placeholder="Class timing"
            searchable
            trackBy="name"
            :classes="selectClasses"
            class="mb-2 border-gray-700 h-9 ml-2 mr-2"
            mode="multiple"
          />
        </field>
        <field>
          <Multiselect
            v-model="highest_degree"
            :options="highestdegree"
            valueProp="id"
            label="name"
            placeholder="Highest Degree"
            searchable
            trackBy="name"
            :classes="selectClasses"
            class="mb-2 border-gray-700 h-9 ml-2 mr-2"
          />
        </field>
         <field>
          <Multiselect
            v-model="moe"
            :options="mode"
            valueProp="id"
            label="name"
            placeholder="Mode of Enquiry"
            searchable
            trackBy="name"
            :classes="selectClasses"
            class="mb-2 border-gray-700 h-9 ml-2 mr-2"
          />
        </field>
        
        <field v-if="userbranch===true">
          <Multiselect
            v-model="branch"
            :options="branches"
            valueProp="id"
            label="name"
            mode="multiple"
            placeholder="Branch name"
            searchable
            trackBy="name"
            :classes="selectClasses"
            class="mb-2 border-gray-700 h-9 ml-2 mr-2"
          />
        </field>
        <field v-else>
          <Multiselect
            v-model="branch"
            :options="assigned_branch"
            valueProp="id"
            label="name"
            mode="multiple"
            placeholder="Branch name"
            searchable
            trackBy="name"
            :classes="selectClasses"
            class="mb-2 border-gray-700 h-9 ml-2 mr-2"
          />
        </field>
        <div class="sticky bottom-[13px] z-[99] bg-gray-900 pt-2 pb-2">
        <field class="ml-2">
          <jb-button label="Submit" small color="success" @click="submit()" />
          <jb-button label="Clear" small color="danger" @click="clear()" />
        </field>
      </div>
      </card-component>
    </div>
  </aside>
</template>

<style>
.padding-space input {
    padding-left: 40px !important;
}
</style>