<script setup>
import { computed, reactive, ref, onBeforeMount  } from 'vue'
import { mdiClose, mdiPlusBox, mdiMinusBox, mdiMail } from '@mdi/js'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import CardComponent from '@/components/CardComponent.vue'
import CheckRadioPicker from "@/components/CheckRadioPicker.vue";
import Level from '@/components/Level.vue'
import TextLink from '@/components/TextLink.vue'
import Overlay from '@/components/Overlay.vue'
import Field from "@/components/Field.vue";
import TitleSubBar from "@/components/TitleSubBar.vue";
import { counselorStore } from "../stores/counselor";
import Control from "@/components/Control.vue";
import Multiselect from "@vueform/multiselect";
import {selectClasses} from "../selectcss"
import { themeStore } from "../stores/theme"
import { sessionStore } from "../stores/session";
import dayjs from "dayjs";
const counselor = counselorStore();
const theme = themeStore();
const user = sessionStore();

onBeforeMount(async () => {
  await counselor.getCourses();
  await counselor.getModeClass();
  await counselor.getSpecialCourse();
  await counselor.getdisablebranch();
  await counselor.getCourseBranches();
});
const todayDate = () => {
  return dayjs().format("YYYY-MM-DD");
};
const specialcourse = computed(() => counselor.special_course.items);

const courses = computed(() => {
  if (counselor.courses && counselor.courses.courses) {
    return counselor.courses.courses;
  }
});
let actual = ref([]);
const courseBranches = computed(() => {
 let getCBranches = [];
//  actual.value=[]
  if (counselor.courseBranches && counselor.courseBranches.branches) {
    for(var cbr of counselor.courseBranches.branches){
      let RepeatBranches = true;
      for(var gcbr of getCBranches){
        if(gcbr && gcbr.id === cbr.branch.id){
          RepeatBranches = false;
          break;
        }
      }
      if (RepeatBranches) {
        if (cbr && cbr.branch) {
          getCBranches.push({ id:cbr.branch.id, name:cbr.branch.name});
        }
      }
     
    }

    return getCBranches;

  }

});

const ocourses = computed(() => {
  if (counselor.courses && counselor.courses.other_branches) {
    for(let i = 0; i < counselor.courses.other_branches.length ; i++){
      counselor.courses.other_branches[i].name = counselor.courses.other_branches[i].name + " - " + counselor.courses.other_branches[i].branch.name
    }
    return counselor.courses.other_branches;
  }
});
const modeclass = computed(() => counselor.modeclass.items);
const branches = computed(() => counselor.branches_min);

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  type: {
    type: String,
  },
  id: {
    type: Number,
  },
  rid: {
    type: Number,
  },
  button: {
    type: String,
    default: 'info'
  },
  buttonLabel: {
    type: String,
    default: 'Add'
  },
  shake: Boolean,
  hasCancel: Boolean,
  textLinkLabel: {
    type: String,
    default: null
  },
  textLinkIcon: {
    type: String,
    default: null
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  }
})


const pageLoading=ref(false)
const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}

const course = ref([
  {
    course: null,
    // other_courses: [],
    mode_class: null,
    //agreed_date: "",
    branch: [],
    actualbranch:[]
  },
]);


const checkString = (text) => {
  var letters = /^[a-zA-Z\s]*$/;
  if (text.match(letters)) {
    return true;
  } else {
    return false;
  }
};


const changingcourse = async (data) => {

if(formState.course_enquiries==="special"){
  formState.scourse[data].other_course=""
  formState.scourse[data].name=null
}

};

const course_copy = ref([]);
const scourse_copy = ref([]);

const check_author_branch = async (key) => {
  counselor.courseBranches=[]
  await counselor.getCourseBranches(course.value[key].course.name);
  if (user.author.branches && user.author.branches.length == 1) {
    if (courseBranches.value.filter(e => e.id === user.author.branches[0].id).length > 0) {
      course.value[key].branch = user.author.branches
    }
    else{
      course.value[key].branch = []
    }
  }
  else{ 
    course.value[key].branch = []
  }

  // optionc
  let getCBranches = [];
//  actual.value=[]
  if (counselor.courseBranches && counselor.courseBranches.branches) {
    for(var cbr of counselor.courseBranches.branches){
      let RepeatBranches = true;
      for(var gcbr of getCBranches){
        if(gcbr && gcbr.id === cbr.branch.id){
          RepeatBranches = false;
          break;
        }
      }
      if (RepeatBranches) {
        if (cbr && cbr.branch) {
          getCBranches.push({ id:cbr.branch.id, name:cbr.branch.name});
        }
      }
     
    }
    course.value[key].actualbranch=getCBranches
    // return getCBranches;

  }
};



const removebranch=(key)=>{
 course.value[key].branch=[]
//  course.value[key].mode_class=[]
}
const scourse = ref([
  { name: "",  othercourse:false,
  other_course:"", mode_class: null, branch: [] },
]);

const formState= reactive({
  id:props.id,
  course_enquiries: null,
  course: course,
  scourse: scourse,
})

const formLoading = ref(false);

const addCourse = (data) => {
for(let i=1;i<=data.length;i++){
  if(data[i-1].branch.length===0||data[i-1].mode_class===null){
    theme.pushMessage("Please add previous course details")
  return
  }
  // else if(data[i-1].branch.length>0){
  //   let nextitem=data[i-1]
  //   if(!nextitem.hasOwnProperty('disabled')){
  //     nextitem.disabled=false
  //   }
  //   nextitem.disabled=true

  // }
 
  
}
  course.value.push({
    course: null,
    mode_class: null,
    //agreed_date: "",
    branch: [],
    actualbranch:[]
  });
};

const removeCourse = () => {
  course.value.pop()
  // course.value[i-1].disabled=false

};

const alldisable=(cou,index,data)=>{
let nextitem=data[index]
for(let i=0;i<data.length;i++){
  if(nextitem.branch && nextitem.branch.length>0){
    if(i<index){
    data[i].disabled=true
  }
  }
  else{
    data[i].disabled=false
  }
}
}
const clearbranch=(cou,index,data)=>{
  cou.branch=[]
} 
const addSCourse = () => {
  scourse.value.push({
    name: "",
    othercourse:false,
    other_course:"",
    mode_class: null,
    branch: [],
  });
};
const removeSCourse = () => {
  scourse.value.pop();
};

const confirm = async() => {
  formState.course = course
  formState.scourse = scourse
  let valid = true
  let formValues = JSON.parse(JSON.stringify(formState))

  if (formValues["course_enquiries"] === null ){
    valid = false;
    theme.pushMessage("Regular/Special/Both Course Enquiries is Required!!");
  }
  if (formValues["course_enquiries"] === 'regular' && formValues["course"][0].course === null){
    valid = false;
    theme.pushMessage("Atleast one Regular course is Required!");
  }
  if (formValues["course_enquiries"] === 'special' && ((formValues["scourse"][0].name ==null &&formValues["scourse"][0].othercourse===false)|| formValues["scourse"][0].name ==null && formValues["scourse"][0].other_course.length==0 && formValues["scourse"][0].othercourse==true)){
    valid = false;
    theme.pushMessage("Atleast one Special course is Required!");
  }
  if (formValues["course_enquiries"] === 'both' && formValues["course"][0].course === null){
    valid = false;
    theme.pushMessage("Regular course is Required!");
  }
  if (formValues["course_enquiries"] === 'both' && ((formValues["scourse"][0].name ==null &&formValues["scourse"][0].othercourse===false)|| formValues["scourse"][0].name ==null && formValues["scourse"][0].other_course.length==0 && formValues["scourse"][0].othercourse==true)){
    valid = false;
    theme.pushMessage("Special course is Required!");
  }
  
  for (const key in formValues ) {
    if (key === "course" && formValues["course"][0].course !== null) {
      formValues[key].forEach((element) => {
        if (
          element.course === null || element.mode_class === null
          // || element.agreed_date.length === 0
        ) {
          valid = false;
          theme.pushMessage("Enter regular course details completely!!");
        }
        if (element.course !== null && element.branch.length === 0) {
          valid = false;
          theme.pushMessage("Select branch details for regular course enquiry!");
        }
        // if( element.mode_class === null){

        // }
        // if (
        //   element.mode_class !== null &&
        //   ((element.mode_class.id === 2 && element.branch.length === 0) ||
        //     (element.mode_class.id === 3 && element.branch.length === 0))
        // ) {
        //   valid = false;
        //   theme.pushMessage("Please fill course branch details!");
        // }
        // if (element.agreed_date !== null) {
        //   const today = dayjs(new Date());
        //   const ag = dayjs(element.agreed_date);
        //   if (ag.isBefore(today)) {
        //     valid = false;
        //     theme.pushMessage(
        //       "Course agreed date should be greater than today!"
        //     );
        //   }
        // }
      });
    }
    // if (
    //   key === "course" &&
    //   formValues["course"][0].other_courses.length !== 0
    // ) {
    //   formValues[key].forEach((element) => {
    //     if (
    //       (element.other_courses.length !== 0 && element.mode_class === null) ||
    //       element.agreed_date.length === 0
    //     ) {
    //       valid = false;
    //       theme.pushMessage("Please fill course details completely!");
    //     }
    //     if (element.agreed_date !== null) {
    //       const today = dayjs(new Date());
    //       const ag = dayjs(element.agreed_date);
    //       if (ag.isBefore(today)) {
    //         valid = false;
    //         theme.pushMessage(
    //           "Course agreed date should be greater than today!"
    //         );
    //       }
    //     }
    //   });
    // }
    if (key === "scourse" &&((formValues["scourse"][0].name != null)||(formValues["scourse"][0].other_course&&formValues["scourse"][0].other_course.length != 0))) {
      formValues[key].forEach((element) => {
        // || element.agreed_date.length === 0

        if (
          ((element.name != null||element.other_course.length!=0)&&element.mode_class === null) 
          // || element.agreed_date.length === 0
        ) {
          valid = false;
          theme.pushMessage("Enter special course details completely!!");
        }
        // if ((element.course !== null||element.other_course.length!=0) && element.branch.length === 0) {
        //   valid = false;
        //   theme.pushMessage("Select branch details for special course enquiry!");
        // }
        // if ((element.name !== null||element.other_course.length!=0)&&element.mode_class === null) {
        //   valid = false;
        //   theme.pushMessage("Enter special course details completely!!");
        // }
        // if (element.agreed_date !== null) {
        //   const today = dayjs(new Date());
        //   const ag = dayjs(element.agreed_date);
        //   if (ag.isBefore(today)) {
        //     valid = false;
        //     theme.pushMessage(
        //       "Special course agreed date should be greater than today!"
        //     );
        //   }
        // }
      });
    }
   }
   if(valid){
      formLoading.value = true;

      if(formValues.course_enquiries === 'regular'){
        formValues.scourse = [];
      }

      if(formValues.course_enquiries === 'special'){
        formValues.course = [];
      }

      let course_copy = ref([]), scourse_copy = ref([]);
      let cr = ref([]), mc = null, br = ref([]);
      // ocr = ref([])

      let smc = null, sbr = ref([]), sco = ref(null);
      for (var c in formValues.course) {
        if(formValues.course[c].course && formValues.course[c].course.name){
          cr.value.push({name:formValues.course[c].course.name})
        }
        // if(formValues.course[c].course && formValues.course[c].course.length > 0){
        //   for(const incr in formValues.course[c].course){
        //     cr.value.push({name:formValues.course[c].course[incr].name})
        //   }
        // }
        // if(formValues.course[c].other_courses && formValues.course[c].other_courses.length > 0){
        //   for(const inocr in formValues.course[c].other_courses){
        //     ocr.value.push({id:formValues.course[c].other_courses[inocr].id, name:formValues.course[c].other_courses[inocr].name})
        //   }
        // }
        if(formValues.course[c].mode_class && formValues.course[c].mode_class.id){
          mc = {id:formValues.course[c].mode_class.id, name:formValues.course[c].mode_class.name}
        }
        if(formValues.course[c].branch && formValues.course[c].branch.length > 0){
          for(const inb in formValues.course[c].branch){
            br.value.push({id:formValues.course[c].branch[inb].id, name:formValues.course[c].branch[inb].name})
          }
        }

        if (formValues.course[c].mode_class && formValues.course[c].mode_class.name.toLowerCase() == "both") {
          course_copy.value.push({
            course: cr.value,
            // other_courses: ocr.value,
            mode_class: { id: 1, name: "offline" },
            //agreed_date: formValues.course[c].agreed_date,
            branch: br.value,
          });
          course_copy.value.push({
            course: cr.value,
            // other_courses: ocr.value,
            mode_class: { id: 2, name: "online" },
            //agreed_date: formValues.course[c].agreed_date,
            branch: br.value,
          });
        } else {
          course_copy.value.push({
            course: cr.value,
            // other_courses: ocr.value,
            mode_class: mc,
            //agreed_date: formValues.course[c].agreed_date,
            branch: br.value,
          });
        }
        cr.value = [], 
        // ocr.value = [], 
        br.value = [];
      }

      for (var sc in formValues.scourse) {
        if(formValues.scourse[sc].mode_class && formValues.scourse[sc].mode_class.id){
          smc = {id:formValues.scourse[sc].mode_class.id, name:formValues.scourse[sc].mode_class.name}
        }
        if(formValues.scourse[sc].name && formValues.scourse[sc].name.id){
        sco.value = {id:formValues.scourse[sc].name.id, name:formValues.scourse[sc].name.name}
      }
        if(formValues.scourse[sc].branch && formValues.scourse[sc].branch.length > 0){
          for(const insb in formValues.scourse[sc].branch){
            sbr.value.push({id:formValues.scourse[sc].branch[insb].id, name:formValues.scourse[sc].branch[insb].name})
          }
        }

        if (formValues.scourse[sc].mode_class && formValues.scourse[sc].mode_class.name.toLowerCase() == "both") {
          scourse_copy.value.push({
            name: sco.value,
            othercourse:formValues.scourse[sc].othercourse,
          other_course:formValues.scourse[sc].other_course,
            mode_class: { id: 1, name: "offline" },
            // agreed_date: formValues.scourse[sc].agreed_date,
            branch: sbr.value,
          });
          scourse_copy.value.push({
            name: sco.value,
            othercourse:formValues.scourse[sc].othercourse,
          other_course:formValues.scourse[sc].other_course,
            mode_class: { id: 2, name: "online" },
            // agreed_date: formValues.scourse[sc].agreed_date,
            branch: sbr.value,
          });
        } else {
          scourse_copy.value.push({
            name: sco.value,
            othercourse:formValues.scourse[sc].othercourse,
          other_course:formValues.scourse[sc].other_course,
            mode_class: smc,
            // agreed_date: formValues.scourse[sc].agreed_date,
            branch: sbr.value,
          });
        }
        sbr.value = [];
        sco.value=null;
      }
      let formSubmit =""
      if(props.rid && props.type){
        formSubmit = {
      id:props.id,
      course: course_copy.value,
      scourse: scourse_copy.value,
      callid:props.rid,
      type:props.type
    }
      }
else if(props.rid){
 formSubmit = {
      id:props.id,
      course: course_copy.value,
      scourse: scourse_copy.value,
      callid:props.rid
    }
}

  else{
    formSubmit = {
      id:props.id,
      course: course_copy.value,
      scourse: scourse_copy.value
    }
  }
 
   let response = await counselor.submitCourse(formSubmit)
   confirmCancel('confirm')
   }
   else{
    formLoading.value = false;
  // theme.pushMessage("Form Error, please fill out mandatory fields")   
   }

}
const changingcourse1 = async (data) => {

if(formState.course_enquiries==="both"){
  formState.scourse[data].other_course=""
  formState.scourse[data].name=null
}

};

const cancel = () => confirmCancel('cancel')
</script>

<template>
  <overlay
    v-show="value"
    @overlay-click="cancel"
  >
    <card-component
      v-show="value"
      :title="title"
      class="shadow-lg w-full max-h-modal md:w-full lg:w-4/5 xl:w-[90%] z-50 overflow-y-auto 2xl:w-[70%]"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
    <div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>
      <div class="">
        <title-sub-bar class="text-red-100" title="Select Course Enquiries - " />
        <!-- <card-component> -->
        <div class="box-border w-50 p-1 bg-zinc-800 border-b border-white rounded grid lg:grid-cols-4 gap-0 text-base font-semibold shadow-lg 
        md:grid-cols-3 sm:grid-cols-2 grid-cols-1 pl-2 mb-3 py-1 mt-4">
    
          <label class="checkbox">
            <input
              v-model="formState.course_enquiries"
              type="radio"
              name="flexi"
              value="regular"
              class="checkbox"
              @click="((course = [{course: null, mode_class: null, branch: [],actualbranch:[]}]) && (scourse = [{name: null, mode_class: null, branch: [],othercourse:false,other_course:''}]))"
            />
            <!-- @click="((course = [{course: null, mode_class: null, agreed_date: '', branch: []}]) && (scourse = [{name: null, mode_class: null, branch: [],othercourse:false,other_course:''}]))" -->
            <span class="check" />
            <span class="control-label">Regular Course Enquiries</span>
          </label>
          <label class="checkbox">
            <input
              v-model="formState.course_enquiries"
              type="radio"
              name="flexi"
              value="special"
              class="checkbox"
              @click="((course = [{course: null, mode_class: null, branch: [],actualbranch:[]}]) && (scourse = [{name: null, mode_class: null, branch: [],othercourse:false,other_course:''}]))"
            />
            <!-- @click="((course = [{course: null, mode_class: null, agreed_date: '', branch: []}]) && (scourse = [{name: null, mode_class: null, branch: [],othercourse:false,other_course:''}]))" -->
            <span class="control-label">Special Course Enquiries</span>
          </label>
          <label class="checkbox">
            <input
              v-model="formState.course_enquiries"
              type="radio"
              name="flexi"
              value="both"
              class="checkbox"
              @click="((course = [{course: null, mode_class: null, branch: [],actualbranch:[]}]) && (scourse = [{name: null, mode_class: null, branch: [],othercourse:false,other_course:''}]))"
            />
            <!-- @click="((course = [{course: null, mode_class: null, agreed_date: '', branch: []}]) && (scourse = [{name: null, mode_class: null, branch: [],othercourse:false,other_course:''}]))" -->
            <span class="control-label">Both <span class="text-sm">(Regular & Special Course Enquiries) </span></span>
          </label>
        </div>
        <!-- </card-component> -->

        <div v-if="formState.course_enquiries === 'regular'">
          <title-sub-bar class="text-amber-50 pb-2 ml-1" title="Regular Course Enquiries -" />
          <div v-for="(c, i) in course" :key="i" class="box-border w-50 p-1 grid xl:grid-cols-4 gap-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            <field help="Course" :error="c.course !== null ? false : 'Course'" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 ">
              <Multiselect
                v-model="c.course"
                :options="courses"
                valueProp="name"
                :object="true"
                label="name"
                searchable
                class="text-sm border-gray-400"
                track-by="name"
                @select="check_author_branch(i)"
                :classes="selectClasses"
                @clear="removebranch(i)"
                @change="clearbranch(c)"

              />
            </field>
            <field
              grouped
              help="Select Branches"
              :error="c.course === null || c.branch.length !== 0 ? false : 'Select Branches'" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
              <!-- :error="c.branch.length !== 0 || c.other_courses.length > 0 ? false : 'Select Branches'" -->
              <Multiselect
                v-model="c.branch"
                mode="tags"
                :options="c.actualbranch"
                valueProp="id"
                :object="true"
                label="name"
                class="border-gray-400"
                searchable
                trackBy="name"
                :classes="selectClasses"
            
              />
            </field>
            <!-- :disabled="c.disabled||false" -->
            <field help="Mode of class" :error="c.course === null || c.mode_class !== null ? false : true" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 last:mb-[8px]"> 
              <Multiselect
                  v-model="c.mode_class"
                  :options="modeclass"
                  help="Mode of class"
                  valueProp="id"
                  :object="true"
                  label="name"
                  searchable
                  class="text-sm border-gray-400"
                  trackBy="name"
                  placeholder="Mode of class"
                  :classes="selectClasses"
              />   
            </field>
          </div>
         
          <jb-button
            color="teal"
            label="Add regular course"
            :icon="mdiPlusBox"
            class="text-sm mt-2 ml-1 mb-2"
            @click="addCourse(course)"
            small
          />
          <jb-button
            class="ml-2 text-sm bg-red-600 border-red-600 hover:bg-red-500 hover:border-red-500 mt-2 "
           v-if="course.length>1"
            color="danger"
            label="Remove regular course"
            :icon="mdiMinusBox"
            @click="removeCourse()"
            small
          />
        </div>
        
       
        <div v-if="formState.course_enquiries === 'special'">
    <title-sub-bar class="text-amber-50 pb-2 ml-1" title="Special Course Enquiries -" />
    <div v-for="(s, i) in scourse" :key="i" class="box-border w-50 p-1 grid xl:grid-cols-3 gap-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 2xl:grid-cols-4">
      <!-- <control
        class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800"
        v-model="s.name"
        help="Course Name"
        placeholder="Course Name"
        :error="s.name.length !== 0 ? false : 'Course Name'"
      /> -->

      <field v-if="s.othercourse===false"
        grouped
        :error="s.name != null ? false : true"
        help="Select Course"
        class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800"
      >
        <Multiselect
          v-model="s.name"
          :options="specialcourse"
          valueProp="id"
          :object="true"
          label="name"
          searchable
          class="border-gray-400"
          trackBy="name"
          :classes="selectClasses"
        />
      </field>
      <field help="Click here if Special Course is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="s.othercourse"
            name="othercourse"
            @click="changingcourse(i)"
            :options="{ true: 'Other Course' }"
          />
        </field>
        <control v-if="s.othercourse===true"
          v-model="s.other_course"
          help="Course Name"
          placeholder="Course Name"
          class="box-border w-50 px-1 py-2 border border-gray-800  mb-2 rounded bg-gray-800"
          :error="
            s.other_course.length >= 3 && checkString(s.other_course)
              ? false
              : 'Course Name(Minimum 3 characters)'
          "
        />
      <field
        grouped
        help="Select Branches"
        class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800"
      >
        <Multiselect
          v-model="s.branch"
          mode="tags"
          :options="branches"
          valueProp="id"
          :object="true"
          label="name"
          searchable
          class="border-gray-400"
          trackBy="name"
          :classes="selectClasses"
        />
      </field>
      <!-- <control
        v-model="s.mode_class"
        :options="modeclass"
        help="Mode of class"
        :error="s.name.length === 0 || s.mode_class !== null ? false : true"
      /> -->
      <field help="Mode of class" :error="((s.name=== null && s.other_course.length===0) || s.mode_class != null) ? false : true" 
      class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 last:mb-[8px]">
        <Multiselect
            v-model="s.mode_class"
            :options="modeclass"
            help="Mode of class"
            valueProp="id"
            :object="true"
            label="name"
            searchable
            class="text-sm border-gray-400"
            trackBy="name"
            placeholder="Mode of class"
            :classes="selectClasses"
        />   
      </field>
      <!-- <control
        :error="
          s.name.length === 0 || s.agreed_date.length > 0 ? false : true
        "
        v-model="s.agreed_date"
        type="date"
        help="Agreed date"
        :minDate="todayDate()"
      /> -->
    </div>
    <jb-button
    color="teal"
      class="text-sm ml-1 mb-2"
      label="Add special course"
      :icon="mdiPlusBox"
      @click="addSCourse()"
      small
    />
    <jb-button
      class="ml-2 text-sm bg-red-600 border-red-600 hover:bg-red-500 hover:border-red-500"
      v-if="scourse.length > 1"
      label="Remove special course"
      color="danger"
      :icon="mdiMinusBox"
      @click="removeSCourse"
      small
    />
  </div>

        <div v-if="formState.course_enquiries === 'both'">
          <div>
          <title-sub-bar class="text-amber-50 pb-2 ml-1" title="Regular Course Enquiries -" />
          <div v-for="(c, i) in course" :key="i" class="box-border w-50 p-1 grid xl:grid-cols-4 gap-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            <field help="Course" :error="c.course !== null ? false : 'Course'" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
              <Multiselect
                v-model="c.course"
                :options="courses"
                valueProp="name"
                :object="true"
                label="name"
                searchable
                @clear="removebranch(i)"
                class="text-sm border-gray-400"
                @select="check_author_branch(i)"
                trackBy="name"
                :classes="selectClasses"
                @change="clearbranch(c)"
              />
            </field>
            <!-- @click="clearbranch(c,i,course)"
                :disabled="c.disabled||false" -->
            <field
              grouped
              help="Select Branches"
              :error="c.course === null || c.branch.length !== 0 ? false : 'Select Branches'"
               class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
              <!-- :error="c.branch.length !== 0 || c.other_courses.length > 0 ? false : 'Select Branches'" -->
              <Multiselect
                v-model="c.branch"
                mode="tags"
                :options="c.actualbranch"
                valueProp="id"
                :object="true"
                label="name"
                searchable
                trackBy="name"
                class="border-gray-400"
                :classes="selectClasses"
              />
            </field>
            <!-- <field
              help="Courses In Other Branches"
              :error="
                c.other_courses.length !== 0 || c.course.length > 0
                  ? false
                  : 'Courses In Other Branches'
              "
            >
              <Multiselect
                v-model="c.other_courses"
                mode="multiple"
                :options="ocourses"
                valueProp="id"
                :object="true"
                label="name"
                searchable
                trackBy="name"
                :classes="selectClasses"
              />
            </field> -->
            <!-- <field>
              <control
                v-model="c.mode_class"
                :options="modeclass"
                help="Mode of class"
                :error="c.course === null || c.mode_class !== null ? false : true"
              />
            </field> -->
            <field help="Mode of class" :error="c.course === null || c.mode_class !== null ? false : true" 
            class="box-border w-50 px-1 py-2 border border-gray-800  mb-0 rounded bg-gray-800 last:mb-[8px]"> 
              <Multiselect
                  v-model="c.mode_class"
                  :options="modeclass"
                  help="Mode of class"
                  valueProp="id"
                  :object="true"
                  label="name"
                  searchable
                  class="text-sm border-gray-400"
                  trackBy="name"
                  placeholder="Mode of class"
                  :classes="selectClasses"
              />   
            </field>
            <!-- @click="clearbranch(c,i,course)"
                :disabled="c.disabled||false" -->
            
            <!-- <field class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
              <control
                :error="
                  c.course === null || c.agreed_date.length > 0 ? false : true
                "
                v-model="c.agreed_date"
                type="date"
                help="Student coming date (When ever student wants to join us)"
                :minDate="todayDate()"
              />
            </field> -->
          </div>
          <jb-button
            color="teal"
            class="text-sm mt-2 ml-1"
            label="Add regular course"
            :icon="mdiPlusBox"
            @click="addCourse(course)"
            small
          />
          <jb-button
            class="ml-2 text-sm bg-red-600 border-red-600 hover:bg-red-500 hover:border-red-500 mt-2"
           v-if="course.length>1"
            label="Remove regular course"
            color="danger"
            :icon="mdiMinusBox"
            @click="removeCourse(c,i)"
            small
          />
          </div>
        
          <div class="mb-2">
      <title-sub-bar class="text-amber-50 pb-2 mt-3 ml-1" title="Special Course Enquiries -" />
      <div v-for="(s, i) in scourse" :key="i"  class="box-border w-50 p-1 grid xl:grid-cols-3 gap-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
       <field v-if="s.othercourse===false"
        grouped
        :error="s.name != null ? false : true"
        help="Select Course"
        class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800"
      >
        <Multiselect
          v-model="s.name"
          :options="specialcourse"
          valueProp="id"
          :object="true"
          label="name"
          searchable
          class="border-gray-400"
          trackBy="name"
          :classes="selectClasses"
        />
      </field>
      <field help="Click here if Special Course is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="s.othercourse"
            name="othercourse"
            @click="changingcourse1(i)"
            :options="{ true: 'Other Course' }"
          />
        </field>
        <control v-if="s.othercourse===true"
          v-model="s.other_course"
          help="Course Name"
          placeholder="Course Name"
          class="box-border w-50 px-1 py-2 border border-gray-800  mb-2 rounded bg-gray-800"
          :error="
            s.other_course.length >= 3 && checkString(s.other_course)
              ? false
              : 'Course Name(Minimum 3 characters)'
          "
        />
      <field
        grouped
        help="Select Branches"
        class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800"
      >
        <Multiselect
          v-model="s.branch"
          mode="tags"
          :options="branches"
          valueProp="id"
          :object="true"
          label="name"
          searchable
          class="border-gray-400"
          trackBy="name"
          :classes="selectClasses"
        />
      </field>
        <!-- <control
          v-model="s.mode_class"
          :options="modeclass"
          help="Mode of class"
          :error="s.name.length === 0 || s.mode_class !== null ? false : true"
        /> -->
        <field help="Mode of class" :error="((s.name=== null && s.other_course.length===0) || s.mode_class != null) ? false : true" 
        class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 last:mb-[8px]">
        <Multiselect
            v-model="s.mode_class"
            :options="modeclass"
            help="Mode of class"
            valueProp="id"
            :object="true"
            label="name"
            searchable
            class="text-sm border-gray-400"
            trackBy="name"
            placeholder="Mode of class"
            :classes="selectClasses"
        />   
      </field>
        <!-- <control
          :error="
            s.name.length === 0 || s.agreed_date.length > 0 ? false : true
          "
          v-model="s.agreed_date"
          type="date"
          help="Agreed date"
          :minDate="todayDate()"
        /> -->
      </div>
      <jb-button
        color="teal"
        class="text-sm ml-1"
        label="Add special course"
        :icon="mdiPlusBox"
        @click="addSCourse"
        small
      />
      <jb-button
        class="ml-2 text-sm bg-red-600 border-red-600 hover:bg-red-500 hover:border-red-500"
        v-if="scourse.length > 1"
        label="Remove special course"
        color="danger"
        :icon="mdiMinusBox"
        @click="removeSCourse"
        small
      />
    </div>
        </div>
      </div>

      <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button
              :label="buttonLabel"
              :color="button"
              @click="confirm"
              class="pt-1 pb-1"
            />
            <jb-button
              v-if="hasCancel"
              label="Cancel"
              :color="button"
              outline
              @click="cancel"
              class="pt-1 pb-1"
            />
          </jb-buttons>

          <text-link
            :label="textLinkLabel"
            :icon="textLinkIcon"
          />
        </level>
      </template>
    </card-component>
  </overlay>
</template>

<style >
input {
  color-scheme: dark;
}
input[name=input]{
  pointer-events: none;
}

.wrap-text span{
  white-space: normal;
}
</style>
