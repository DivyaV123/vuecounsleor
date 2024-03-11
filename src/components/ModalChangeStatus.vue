<script setup>
import { computed, reactive, ref, onBeforeMount } from "vue";
import { mdiClose, mdiPlusBox, mdiMinusBox, mdiPhone } from "@mdi/js";
import JbButton from "@/components/JbButton.vue";
import JbButtons from "@/components/JbButtons.vue";
import CardComponent from "@/components/CardComponent.vue";
import Level from "@/components/Level.vue";
import TextLink from "@/components/TextLink.vue";
import Overlay from "@/components/Overlay.vue";
import Field from "@/components/Field.vue";
import TitleSubBar from "@/components/TitleSubBar.vue";
import { counselorStore } from "../stores/counselor";
import Control from "@/components/Control.vue";
import { themeStore } from "../stores/theme";
import { sessionStore } from "../stores/session";
import Multiselect from "@vueform/multiselect";
import { selectClasses } from "../selectcss";
import dayjs from "dayjs";

const counselor = counselorStore();
const theme = themeStore();
const user = sessionStore();

const callStatus = computed(() => {
  if(counselor.callStatus && counselor.callStatus.items){
    return counselor.callStatus.items
  } 
});

const followups = computed(() => counselor.followups.items);
const reasons = computed(() => counselor.eReasons.items);
// const users = computed(() => counselor.bUsers.items);
const users = computed(() => counselor.EscUsers);

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
    default: "Submit",
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

const formState = reactive({
  id: props.id,

  mainStatus: null,
  subStatus: null,

  followup: null,

  // Joined Other Institiute
  course: "",
  institute_name: "",

  // already joined
  email: "",
  mobile: "",

  mobileDup: "",
  emailDup: "",

  // got job
  company_name: "",

  // Next batch
 // agreed_date: "",
  
  // Escalation
  reason: null,
  comments: "",
  to: null,
})

let status_comment = null;

const todayDate = () => {
  return dayjs().format("YYYY-MM-DD");
};

const validEmail = (email) => {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(mailformat)) {
    return true;
  } else {
    return false;
  }
};

const changeMainStatus = async (ms) => {
  formState.mainStatus = ms;
  formState.subStatus = null;
  formState.followup = null;
  formState.reason = null;
  formState.comments = '';
  formState.to = null;
}

const changeSubStatus = async (ss) => {
    formState.subStatus = ss;
}

const confirm = async () => {
  let valid = true;
  let formValues = JSON.parse(JSON.stringify(formState));
  for (const key in formValues) {
    if (key === "mainStatus" && formValues[key] === null) {
      valid = false;
      theme.pushMessage("Main Status is required!");
    }
    if (key === "followup" && formValues["mainStatus"].name === 'follow up' && formValues[key] === null) {
      valid = false;
      theme.pushMessage("Followup name is required!");
    }
    if (key === "subStatus" && formValues["mainStatus"].name === 'enquiry' && formValues[key] === null) {
      valid = false;
      theme.pushMessage("Sub Status is required!");
    }
    if (key === "subStatus" && formValues["mainStatus"].name === 'follow up' && formValues[key] === null) {
      valid = false;
      theme.pushMessage("Sub Status is required!");
    }

    // joined other institute
    if(formValues["subStatus"] && formValues["subStatus"].name === 'joined outside'){
    if (key === 'course' && (formValues[key].length === 0)) {
      valid = false;
      theme.pushMessage("Course is required");
    }
    if (key === 'institute_name' && (formValues[key].length === 0)) {
      valid = false;
      theme.pushMessage("Institute is required");
    }}
    
    // already joined 
    if(formValues["subStatus"] && formValues["subStatus"].name === 'joined within'){
    if (key === 'mobile') {
      let num = formValues[key].replace(/\s+/g, '')
      if (num.length < 10 || isNaN(num)) {
        valid = false;
        theme.pushMessage("Mobile number with valid number is required!");
      }
    }
    if (key === 'mobileDup') {
      let num = formValues[key].replace(/\s+/g, '')
      if (num.length < 10 || isNaN(num)) {
        valid = false;
        theme.pushMessage("Repeat mobile number with valid number is required!");
      }
    }
    if (key === 'email' && !validEmail(formValues[key])) {
      valid = false;
      theme.pushMessage("Email with valid ID is required!");
    }
    if (key === 'emailDup' && !validEmail(formValues[key])) {
      valid = false;
      theme.pushMessage("Repeat Email with valid ID is required!");
    }}

    // got job
    if (key === 'company_name' && (formValues[key].length === 0) && formValues["subStatus"] && formValues["subStatus"].name === 'got job') {
      valid = false;
      theme.pushMessage("Company is required");
    }

    // next batch
    // if (key === "agreed_date" && formValues[key].length === 0 && formValues["subStatus"] && formValues["subStatus"].name === 'next batch') {      
    //     valid = false
    //     theme.pushMessage("Please add agreed date")   
    // }

    // Escalation
    if(key === 'reason' && formValues[key] === null && formValues["subStatus"] && formValues["subStatus"].name === 'escalation'){
      valid= false
      theme.pushMessage("Reason is required!")
    } 

  }
  if(formValues["subStatus"] && formValues["subStatus"].name === 'joined within' ){
  if (formValues['mobile'] !== formValues['mobileDup']) {
    valid = false;
    theme.pushMessage("Mobile numbers are not matching");
  }
  if (formValues['email'] !== formValues['emailDup']) {
    valid = false;
    theme.pushMessage("Emails are not matching");
  }}

  if (valid) {
    if(formState.subStatus && formState.subStatus.name === 'escalation'){
      let to_copy = null;
      if(formState.to && formState.to.id){
        to_copy = {id:formState.to.id, name:formState.to.name}
      }
      status_comment = {
        escalations: {
        reason: {id:formState.reason.id, name:formState.reason.name},
        comments: formState.comments
        },
        to: to_copy,
        author: user.author,
      }
    }
    if(formState.subStatus && formState.subStatus.name === 'joined within'){
      status_comment = {
        email: formState.email,
        mobile: formState.mobile
      }
    }
    if(formState.subStatus && formState.subStatus.name === 'joined outside'){
      status_comment = {
        course: formState.course,
        institute_name: formState.institute_name
      }
    }
    if(formState.subStatus && formState.subStatus.name === 'got job'){
      status_comment = {
        company_name: formState.company_name
      }
    }
    // if(formState.subStatus && formState.subStatus.name === 'next batch'){
    //   status_comment = {
    //     agreed_date: formState.agreed_date
    //   }
    // }

    let subStatus_copy = null;

    if(formState.subStatus && formState.subStatus.id){
      subStatus_copy = {id:formState.subStatus.id, name:formState.subStatus.name}
    }

    let formSubmit = {
      id: props.id,
      status: {
        id: formState.mainStatus.id,
        name: formState.mainStatus.name,
        substatus: subStatus_copy,
        // followup: formState.followup,
        comment: status_comment
      },
      followup: formState.followup,
     
    }
    let response = await counselor.submitChangeStatus(formSubmit);
    confirmCancel("confirm");
  } else {
    theme.pushMessage("Form Error, please fill out mandatory fields");
  }
    status_comment = null;
};

const cancel = () => confirmCancel("cancel");
const bid=ref([])

onBeforeMount(async () => {
  await counselor.getCallStatus();
  await counselor.getFollowups();
  await counselor.getEReasons();
  await counselor.getBCounselors();
  if(user.user&&user.user.branches){
    for(let i=0;i<user.user.branches.length;i++){
     bid.value.push(user.user.branches[i].id) 
    }
  }
  await counselor.getEscUsers(bid.value.join(),user.user.uid);
});
</script>

<template>
  <overlay v-show="value" @overlay-click="cancel">
    <card-component
      v-show="value"
      :title="title"
      class="shadow-lg w-full max-h-modal md:w-4/5 z-50 overflow-y-scroll xl:w-7/12"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
      <div class="pl-4 space-y-3">
        <card-component>
          <div class="pb-5">
            <title-sub-bar title="Select Main Status" class="mb-1"/>
            <span v-for="(st) in callStatus" :key="st.id" class="px-2 justify-center">
              <jb-button @click="changeMainStatus(st)" :label="st.name" :class="(formState.mainStatus && formState.mainStatus.id === st.id) ?'color-amber' : 'color-success'"
              class="px-3 pt-1 pb-1 space-x-7 space-y-7 border-2 border-orange-300 rounded text-base text-yellow-50 mb-2"/>
            </span>
          </div>
          <div v-if="formState.mainStatus && formState.mainStatus.name === 'follow up'">
              <title-sub-bar title="Followup Name" class="mb-1"/>
              <div class="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2"  >
                <!-- :error="formState.followup !== null ? false : 'follow up '"
                :error="formState.followup !== null ? false : 'follow up '" -->
                <field :error="formState.followup !== null ? false : 'follow up '" >
                  <Multiselect
                    v-model="formState.followup"
                    :options="followups"
                    valueProp="id"
                    label="name"
                    searchable
                    trackBy="name"
                    :classes="selectClasses" 
                    class="mb-2 border-gray-400 h-9 text-sm"
                    
                  />
                </field>
              </div>
            </div> 
          <div v-if="formState.mainStatus && formState.mainStatus.substatus.length > 0">
                   
            <div class="pb-5">
              <title-sub-bar :title="'Select Sub Status of ' +  formState.mainStatus.name" class="mb-1"/>
              <span v-for="(st) in formState.mainStatus.substatus" :key="st.id" class="mb-2">
                <jb-button @click="changeSubStatus(st)" :label="st.name" :class="(formState.subStatus && formState.subStatus.id === st.id) ?'color-amber' : 'color-success'"
                  class="px-3 pt-1 pb-1 space-x-7 space-y-7 border-2 border-emerald-600 rounded text-base text-yellow-50 mb-2"/>
                  &nbsp;
              </span>
            </div>

            <div v-if="formState.subStatus && formState.subStatus.name === 'escalation'">
              <title-sub-bar :title="'Enter details of ' +  formState.subStatus.name" class="mb-1"/>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2">
                  <field>
                    <control
                    v-model="formState.reason"
                    :options="reasons"
                    help="Escalate Reason"
                    :error="formState.reason !== null ? false : 'Escalate Reason'"
                  />
                  </field>                  
                  <div class="mr-2">
                  <control
                    v-model="formState.to"
                    :options="users"
                    help="Escalation To"
                  />
                  <!-- :error="formState.to !== null ? false : 'Escalation To'"-->
        
                  
                  </div>
                  <field
                    label="Comments"
                  >
                    <control
                      v-model="formState.comments"
                      type="textarea"
                      placeholder="Comments"
                    />
                  </field>
                </div>
            </div>

            <div v-if="formState.subStatus && formState.subStatus.name === 'joined within'" class="grid sm:grid-cols-2 grid-cols-1 gap-2">
              <field>
                <control v-model="formState.mobile" help="Number" placeholder="Number" :error="
                  formState.mobile.replace(/\s+/g, '').length >= 10 && !isNaN(formState.mobile.replace(/\s+/g, ''))
                    ? false
                    : 'Mobile(Minimum 10 digits)'
                " />
              </field>
              <field>
                <control autocomplete="off" v-model="formState.mobileDup" type="password" help="Repeat number"
                  placeholder="Repeat number"  @paste.prevent :error="
                    formState.mobileDup.replace(/\s+/g, '').length >= 10 && !isNaN(formState.mobileDup.replace(/\s+/g, ''))
                      ? false
                      : 'Repeat mobile(Minimum 10 digits)'
                  " />
              </field>
              <field>
                <control v-model="formState.email" help="Email" placeholder="Email" :error="formState.email.length > 0 && validEmail(formState.email)
                  ? false
                  : 'Email'
                " />
              </field>
              <field>
                <control v-model="formState.emailDup" @paste.prevent help="Repeat email" placeholder="Repeat email" :error="formState.emailDup.length > 0 && validEmail(formState.emailDup)
                  ? false
                  : 'Repeat email'
                " />
              </field>
            </div>

            <div v-if="formState.subStatus && formState.subStatus.name === 'joined outside'">
              <title-sub-bar :title="'Enter details of ' +  formState.subStatus.name" class="mb-1"/>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2">
                <field>
                  <control v-model="formState.course" help="Course" placeholder="Course" :error="
                    formState.course.length > 0
                      ? false
                      : 'Course is required'
                  " />
                </field>
                <field>
                  <control v-model="formState.institute_name" help="Institute" placeholder="Institute" :error="
                    formState.institute_name.length > 0
                      ? false
                      : 'Institute is required'
                  " />
                </field>
              </div>
            </div>

            <div v-if="formState.subStatus && formState.subStatus.name === 'got job'">
              <title-sub-bar :title="'Enter details of ' +  formState.subStatus.name" class="mb-1"/>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2">
                <field>
                  <control v-model="formState.company_name" help="Company" placeholder="Company" :error="
                    formState.company_name.length > 0
                      ? false
                      : 'Company is required'
                  " />
                </field>
              </div>
            </div>


            <!-- <div v-if="formState.subStatus && formState.subStatus.name === 'next batch'">
              <title-sub-bar :title="'Enter details of ' +  formState.subStatus.name" class="mb-1"/>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2">
              <field>
                <control v-model="formState.agreed_date" type="date" help="Student coming date (When ever student wants to join us)" :minDate="todayDate()" />
              </field>
              </div>
            </div> -->
            
          </div>
        </card-component>
      </div>

      <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button :label="buttonLabel" :color="button" @click="confirm" class="pt-1 pb-1"/>
            <jb-button
              v-if="hasCancel"
              label="Cancel"
              :color="button"
              outline
              @click="cancel"
              class="pt-1 pb-1"
            />
          </jb-buttons>

          <text-link :label="textLinkLabel" :icon="textLinkIcon" />
        </level>
      </template>
    </card-component>
  </overlay>
</template>

<style>
.color-amber{
  background-color: #f97316 !important;
  border-color: #fb923c !important;
}

.color-amber:hover{
  background-color: #f97316 !important;
  border-color: #fb923c !important;
}

.color-success{
  background-color: #047857 !important;
  border-color: #059669 !important;
}

.color-success:hover{
  background-color: #059669 !important;
  border-color: #10b981 !important;
}
</style>
