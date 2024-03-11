<script setup>
import { computed, reactive, ref, onMounted, onBeforeMount } from "vue";
import {
  mdiDatabaseAlert,
  mdiAlphaEBox,
  mdiAlphaFBox,
  mdiBookEducation, 
  mdiPlusBox,
  mdiAlertBox ,
  mdiAccountSearch,
  mdiAccountRemove,
  mdiCastEducation,
  mdiCheckDecagram,
  mdiComment
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
import ModalComment from "@/components/ModalComment.vue"
import ModalEscalate from "@/components/ModalEscalate.vue";
import ModalRemove from "@/components/ModalRemove.vue";
import ModalOnline from "@/components/ModalOnline.vue";
import RightEnquirySearch from "@/components/RightEnquirySearch.vue";
import { themeStore } from "../stores/theme";
import { useRoute,useRouter } from "vue-router";
import { counselorStore } from "../stores/counselor";
import Icon from "@/components/Icon.vue";
import { sessionStore } from "../stores/session";
import Tip from '@/components/Tip.vue';
import dayjs from "dayjs";
import Popper  from "vue3-popper";

const user = sessionStore();
const theme = themeStore();
const router = useRouter();
const route = useRoute();
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



const branches = computed(() =>{
  const getBranches = [];
  for(var brnh of user.user.branches){
    getBranches.push(brnh.id);
  }
  return getBranches
})

const confirmRefresh = async () => {
  if (route.query && route.query.fp && route.query.type) {
  pageLoading.value = true;
  await counselor.getFollowUpEnquiries(route.query.fp, route.query.type);
  pageLoading.value = false;
  }
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
const registerTipOn = ref(false)
const batchtip = ref(false)
const lasttip=ref(false)
const totaltip=ref(false)
const followuptip=ref(false)
const datetip=ref(false)
const fp1 = ref(true)
const fp2 = ref(false)
const fp3 = ref(false)
const fp4 = ref(false)
const fp5 = ref(false)
const fp6 = ref(false)
const fp7 = ref(false)
const fp8 = ref(false)
const fp9 = ref(false)

const search1 = ref(true)
const search2 = ref(false)
const search3 = ref(false)
const itemsPerPage = ref(100)
const itemsShown = ref(10)
const currentPage = ref(1)
const items = ref(counselor.fEnqs)
const slicedItems = computed(() => {
    let start = currentPage.value - 1
    if(start > 0){
      start = (currentPage.value - 1) * itemsPerPage.value
    }
    let end = currentPage.value * itemsPerPage.value
    return new Map(Array.from(items.value).slice(start, end))
});

const itemsLength = computed(() => {
    return items.value.size
});

const fpChange = async(fp) => {
  currentPage.value=1
  pageLoading.value = true
  if(fp === "fp1"){
    fp1.value = true
    fp2.value = false
    fp3.value = false
    fp4.value = false
    fp5.value = false
    fp6.value = false
    fp7.value = false
    fp8.value = false
    fp9.value = false
    items.value =  counselor.fEnqs
  }
  if(fp === "fp2"){
    fp1.value = false
    fp2.value = true
    fp3.value = false
    fp4.value = false
    fp5.value = false
    fp6.value = false
    fp7.value = false
    fp8.value = false
    fp9.value = false
  }
  if(fp === "fp3"){
    fp1.value = false
    fp2.value = false
    fp3.value = true
    fp4.value = false
    fp5.value = false
    fp6.value = false
    fp7.value = false
    fp8.value = false
    fp9.value = false
    items.value =  counselor.newFEnqs
  }
  if(fp === "fp4"){
    fp1.value = false
    fp2.value = false
    fp3.value = false
    fp4.value = true
    fp5.value = false
    fp6.value = false
    fp7.value = false
    fp8.value = false
    fp9.value = false
    items.value =  counselor.inactiveFEnqs
  }
  if(fp === "fp5"){
    fp1.value = false
    fp2.value = false
    fp3.value = false
    fp4.value = false
    fp5.value = true
    fp6.value = false
    fp7.value = false
    fp8.value = false
    fp9.value = false
    items.value =  new Map([...counselor.fEnqs].filter(([k, v]) => v.enquiry.time_slot && v.enquiry.time_slot.length > 0))
  }
  if(fp === "fp6"){
    fp1.value = false
    fp2.value = false
    fp3.value = false
    fp4.value = false
    fp5.value = false
    fp6.value = true
    fp7.value = false
    fp8.value = false
    fp9.value = false
    items.value =  counselor.callbackFEnqs
  }
  if(fp === "fp7"){
    fp1.value = false
    fp2.value = false
    fp3.value = false
    fp4.value = false
    fp5.value = false
    fp6.value = false
    fp7.value = true
    fp8.value = false
    fp9.value = false
    items.value =  counselor.comingFEnqs
  }
  if(fp === "fp8"){
    fp1.value = false
    fp2.value = false
    fp3.value = false
    fp4.value = false
    fp5.value = false
    fp6.value = false
    fp7.value = false
    fp8.value = true
    fp9.value = false
    items.value =  counselor.rnrFEnqs
    
  }
  if(fp === "fp9"){
    fp1.value = false
    fp2.value = false
    fp3.value = false
    fp4.value = false
    fp5.value = false
    fp6.value = false
    fp7.value = false
    fp8.value = false
    fp9.value = true
    items.value =  counselor.swFEnqs
    
  }
  
  pageLoading.value = false

}

const todayDate = computed(() => {
    return dayjs(new Date())
});

const itemsCount = computed(() => {
    return counselor.fEnqs.size;
});
const itemsCount1 = computed(() => {
    return counselor.fEnqs.size;
});
const itemsCount2 = computed(() => {
    return counselor.fEnqs.size;
});
const itemsCount3 = computed(() => {
    return counselor.newFEnqs.size;
});
const itemsCount4 = computed(() => {
    return counselor.inactiveFEnqs.size;
});
const itemsCount5 = computed(() => {
    return new Map([...counselor.fEnqs].filter(([k, v]) => v.enquiry.time_slot && v.enquiry.time_slot.length > 0)).size;
});
const itemsCount6 = computed(() => {
    return counselor.callbackFEnqs.size;
});
const itemsCount7 = computed(() => {
    return counselor.comingFEnqs.size;
});
const itemsCount8 = computed(() => {
    return counselor.rnrFEnqs.size;
});
const itemsCount9 = computed(() => {
    return counselor.swFEnqs.size;
});


const sortBy = async(id = "id") => {
  currentPage.value=1
  if(id === "id"){
    search1.value = true
    search2.value = false
    search3.value = false
    // new Map([...counselor.fEnqs].filter(([k, v]) => v.enquiry.time_slot.length > 0))
    
    items.value = new Map([...items.value].sort( function( a, b ){
        let aName = a[1].id;
        let bName = b[1].id;
        if( aName < bName ){
            return 1;
        }

        if( aName == bName ){
            return 0;
        }

        if( aName > bName ){
            return -1;
        }
    }));
  }
  if(id === "calls"){
    search1.value = false
    search2.value = true
    search3.value = false

    items.value = new Map([...items.value].sort( function( a, b ){
      let aName = 0
      let bName = 0
        var fp = route.query.fp
        for(var i = 0;i<a[1].courses.length;i++){
          let course = a[1].courses[i]
          if(course.followup){
            for(var m = 0;m<course.followup.length;m++){
          let follow = course.followup[m]
            if(follow.id == fp){
            aName = follow.calls
          }
        }
          }
        }
        for(var p = 0;p<b[1].courses.length;p++){
          let course = b[1].courses[p]
          if(course.followup){
            for(var n = 0;n<course.followup.length;n++){
          let follow = course.followup[n]
            if(follow.id == fp){
            bName = follow.calls
          }
        }
          }
        }
        if( aName > bName ){
            return 1;
        }

        if( aName == bName ){
            return 0;
        }

        if( aName < bName ){
            return -1;
        }
    }));
  }
  if(id === "incoming"){
    search1.value = false
    search2.value = false
    search3.value = true

    items.value = new Map([...items.value].sort( function( a, b ){
      let aName = ""
      let bName = ""
        var fp = route.query.fp
        for(var i = 0;i<a[1].courses.length;i++){
          let course = a[1].courses[i]
          if(course.followup){
            for(var m = 0;m<course.followup.length;m++){
          let follow = course.followup[m]
          if(follow){
            if(follow.id == fp && follow.record &&follow.record.type === 'incoming'){
            aName = follow.record.time
          }
          }
        }
          }
        }
        for(var p = 0;p<b[1].courses.length;p++){
          let course = b[1].courses[p]
          if(course.followup){
            for(var n = 0;n<course.followup.length;n++){
          let follow = course.followup[n]
          if(follow.id == fp &&follow.record && follow.record.type === 'incoming'){
            bName = follow.record.time
          }
        }
          }
        }
        if( aName > bName ){
            return -1;
        }

        if( aName == bName ){
            return 0;
        }

        if( aName < bName ){
            return 1;
        }
    }));
  }
 
}

const searchQuery = ref("");


const searchParams = async (search) => {
  pageLoading.value = true;
  if (search.length > 0) {
    searchQuery.value = search;
    await counselor.getFollowUpEnquiries(0, search);
  } else {
    searchQuery.value = "";
    await counselor.getFollowUpEnquiries();
  }
  pageLoading.value = false;
};

const searchOpen = async () => {
  counselor.searchOpenclose();
};

const openAcademicModal = (id, name, highest_degree, yop) => {
  isAcademicsActive.value = true;
  propValues.id = id;
  propValues.name = name;
  propValues.highest_degree = highest_degree;
  propValues.yop = yop;
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

const isModalComment= ref(false);

const commentmodal =(id,name)=>{
  isModalComment.value=true;
  propValues.commentid=id;
  propValues.commentname=name,
  propValues.commentdata="Follow Up"
}


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

const openOnlineModal = (id, name, courses) => {
  isModalOnlineActive.value = true;
  propValues.id = id;
  propValues.name = name;
  propValues.courses = courses;
};

const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*");
};

function getFCalls(courses){
let fp = route.query.fp
for(var p = 0;p < courses.length;p++){
 if(courses[p].followup && courses[p].followup.length > 0){
 for(var i = 0;i < courses[p].followup.length;i++){
  if(courses[p].followup[i].id == fp){
    return courses[p].followup[i].calls
  }
 }
}
}
}

function getLastCall(refers){
  let brs = user.author.branches
  let ld = ''
  let today = dayjs(new Date())
  for(var i = 0;i < refers.length;i++){
    let found = false
    if(refers[i].branch&&refers[i].branch.length){
      for(var p = 0;p < refers[i].branch.length;p++){
        found = brs.some(el => el.id === refers[i].branch[p].id);
    }
    }
    if(found){
      ld = today.diff(dayjs(refers[i].time), 'day')
    }
  }
  return ld
};

function getComments(comments){
  let brs = user.author.branches
  let coms = []
  for(var i = 0;i < comments.length;i++){
    let found = false
    let comment = comments[i]
    if(comment.authorbranch){
      for(var p = 0;p < comment.authorbranch.length;p++){
        found = brs.some(el => el.id === comment.authorbranch[p].id);
        if(found){
          coms.push(comment)
          break
        }
    }
    }
  }
  return coms.reverse()
};

function getTc(refers){
  let brs = user.author.branches
  let ld = 0
  // let today = dayjs(new Date())
  for(var i = 0;i < refers.length;i++){
    let found = false
    if(refers[i].branch&&refers[i].branch.length){
      for(var p = 0;p < refers[i].branch.length;p++){
        found = brs.some(el => el.id === refers[i].branch[p].id);
    }

    }
      
    if(found){
      ld = ld + 1
    }
  }
  return ld
};

function get7(refers){
  let brs = user.author.branches
  let today = dayjs(new Date()).format("YYYY-MM-DD")
  let y1 = dayjs(today).subtract(1,'day').format("YYYY-MM-DD")
  let y2 = dayjs(today).subtract(2,'day').format("YYYY-MM-DD")
  let y3 = dayjs(today).subtract(3,'day').format("YYYY-MM-DD")
  let y4 = dayjs(today).subtract(4,'day').format("YYYY-MM-DD")
  let y5 = dayjs(today).subtract(5,'day').format("YYYY-MM-DD")
  let y6 = dayjs(today).subtract(6,'day').format("YYYY-MM-DD")
  let y7 = dayjs(today).subtract(7,'day').format("YYYY-MM-DD")
  let t0 = 0
  let t1 = 0
  let t2 = 0
  let t3 = 0
  let t4 = 0
  let t5 = 0
  let t6 = 0
  let t7 = 0
  for(var i = 0;i < refers.length;i++){
    let found = false
    if(refers[i].branch&&refers[i].branch.length){
      for(var p = 0;p < refers[i].branch.length;p++){
        found = brs.some(el => el.id === refers[i].branch[p].id);
    }

    }
     
    if(found){
      
      if(dayjs(refers[i].time).format("YYYY-MM-DD") === today){
        t0++
      }
      else if(dayjs(refers[i].time).format("YYYY-MM-DD") === y1){
        t1++
      }
      if(dayjs(refers[i].time).format("YYYY-MM-DD") === y2){
        t2++
      }
      if(dayjs(refers[i].time).format("YYYY-MM-DD") === y3){
        t3++
      }
      if(dayjs(refers[i].time).format("YYYY-MM-DD") === y4){
        t4++
      }
      if(dayjs(refers[i].time).format("YYYY-MM-DD") === y5){
        t5++
      }
      if(dayjs(refers[i].time).format("YYYY-MM-DD") === y6){
        t6++
      }
      if(dayjs(refers[i].time).format("YYYY-MM-DD") === y7){
        t7++
      }
      // console.log(refers[i])
    }
  }
  return t0+" "+t1+" "+t2+" "+t3+" "+t4+" "+t5+" "+t6+" "+t7
}

function get8(refers){
  let brs = user.author.branches
  let today = dayjs(new Date()).format("YYYY-MM-DD")
  let t0 = 0
  let d8 = dayjs(today).subtract(8,'day').format("YYYY-MM-DD")
  let d15 = dayjs(today).subtract(15,'day').format("YYYY-MM-DD")
  for(var i = 0;i < refers.length;i++){
    let found = false
    if(refers[i].branch&&refers[i].branch.length){
      for(var p = 0;p < refers[i].branch.length;p++){
        found = brs.some(el => el.id === refers[i].branch[p].id);
    }

    }
     
    if(found){
      if(dayjs(refers[i].time).format("YYYY-MM-DD") === d8 || dayjs(refers[i].time).format("YYYY-MM-DD") === d15){
        t0++
      }
      if(dayjs(refers[i].time).isAfter(d15) && dayjs(refers[i].time).isBefore(d8) ){
        t0++
      }

    }
  }
  return t0

}

function get16(refers){
  let brs = user.author.branches
  let today = dayjs(new Date()).format("YYYY-MM-DD")
  let t0 = 0
  let dstart = dayjs(today).subtract(16,'day').format("YYYY-MM-DD")
  let dend = dayjs(today).subtract(45,'day').format("YYYY-MM-DD")
  for(var i = 0;i < refers.length;i++){
    let found = false
    if(refers[i].branch&&refers[i].branch.length){
      for(var p = 0;p < refers[i].branch.length;p++){
        found = brs.some(el => el.id === refers[i].branch[p].id);
    }

    }
      
    if(found){
      if(dayjs(refers[i].time).format("YYYY-MM-DD") === dstart || dayjs(refers[i].time).format("YYYY-MM-DD") === dend){
        t0++
      }
      if(dayjs(refers[i].time).isAfter(dend) && dayjs(refers[i].time).isBefore(dstart) ){
        t0++
      }

    }
  }
  return t0

}

function get46(refers){
  let brs = user.author.branches
  let today = dayjs(new Date()).format("YYYY-MM-DD")
  let t0 = 0
  let dstart = dayjs(today).subtract(46,'day').format("YYYY-MM-DD")
  let dend = dayjs(today).subtract(90,'day').format("YYYY-MM-DD")
  for(var i = 0;i < refers.length;i++){
    let found = false
    if(refers[i].branch&&refers[i].branch.length){
      for(var p = 0;p < refers[i].branch.length;p++){
        found = brs.some(el => el.id === refers[i].branch[p].id);
    }

    }
     
    if(found){
      if(dayjs(refers[i].time).format("YYYY-MM-DD") === dstart || dayjs(refers[i].time).format("YYYY-MM-DD") === dend){
        t0++
      }
      if(dayjs(refers[i].time).isAfter(dend) && dayjs(refers[i].time).isBefore(dstart) ){
        t0++
      }

    }
  }
  return t0

}

const onClickHandler = (page) => {
    // console.log(page);
    window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  };

  const coursepop=ref(false)
  const course_id= ref("")
  const coursehover=(id)=>{
    slicedItems.value.forEach((item)=>{
        if(item.id === id){
          coursepop.value = true
            course_id.value = id
            return coursepop
        }
      });
  }

  const leavecourse=async(id)=>{
  await slicedItems.value.forEach((item)=>{
        if(item.id == id){
         return  coursepop.value=false
        }
      });
}

  const ids_value = ref("")
const mousehover=(id)=>{
  slicedItems.value.forEach((item)=>{
        if(item.id === id){
            datetip.value = true
            ids_value.value = id
            return datetip
        }
      });
    }

const leavedata=async(id)=>{
  await slicedItems.value.forEach((item)=>{
        if(item.id == id){
         return  datetip.value=false
        }
      });
}
</script>

<template>
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
  <modal-academics
    v-if="isAcademicsActive"
    v-model="isAcademicsActive"
    :title="'Add Academic details of ' + propValues.name"
    :id="propValues.id"
    :highest_degree="propValues.highest_degree"
    :yop="propValues.yop"
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

  <div class="w-full bg-[#151D2B] pt-6 z-[9]  pt-2 sticky top-[58px]">
    <jb-buttons>
  <jb-button
    :label="'Followup('+itemsCount1+')'"
    small
    :color="fp1 ? 'success' : 'info'"
    @click="fpChange('fp1')"
  />
  <!-- <jb-button
    :label="'Dropout followp'"
    small
    :color="fp2 ? 'success' : 'info'"
    @click="fpChange('fp2')"
  /> -->
  <jb-button
    :label="'New Enqs after followp('+itemsCount3+')'"
    small
    :color="fp3 ? 'success' : 'info'"
    @click="fpChange('fp3')"
  />
  <jb-button
    :label="'Inactive counselor Enqs('+itemsCount4+')'"
    small
    :color="fp4 ? 'success' : 'info'"
    @click="fpChange('fp4')"
  />
  <jb-button
    :label="'Rigid Timing Enqs('+itemsCount5+')'"
    small
    :color="fp5 ? 'success' : 'info'"
    @click="fpChange('fp5')"
  />
  <jb-button
    :label="'Call Back('+itemsCount6+')'"
    small
    :color="fp6 ? 'success' : 'info'"
    @click="fpChange('fp6')"
  />
  <jb-button
    :label="'Coming('+itemsCount7+')'"
    small
    :color="fp7 ? 'success' : 'info'"
    @click="fpChange('fp7')"
  />
  <jb-button
    :label="'RNR('+itemsCount8+')'"
    small
    :color="fp8 ? 'success' : 'info'"
    @click="fpChange('fp8')"
  />
  <jb-button
    :label="'SW-NR('+itemsCount9+')'"
    small
    :color="fp9 ? 'success' : 'info'"
    @click="fpChange('fp9')"
  />
  </jb-buttons>
  <jb-buttons class="pt-2">
    <jb-button
    label="Order by DOE"
    small
    :color="search1 ? 'success' : 'warning'"
    @click="sortBy('id')"
  />
    <jb-button
    label="Order by Followup Calls"
    small
    :color="search2 ? 'success' : 'warning'"
    @click="sortBy('calls')"
  />
  <jb-button
    label="Latest Updated(Incoming)"
    small
    :color="search3 ? 'success' : 'warning'"
    @click="sortBy('incoming')"
  />
  </jb-buttons>
</div>

  <table class="mt-5 lg:mt-0">
    <thead class="sticky bg-gray-900 z-[9] top-[142px]">
      <tr>
        <th class="p-0"><small>Name</small></th>
        <th class="p-0 "><small><icon :path="mdiBookEducation" size="20" class=""/></small></th>
        <th class="p-0 "><small>Contact</small></th>
        <th class="p-0 "><small>Course(s)</small></th>
        <th class="p-0 relative"  @mouseover="registerTipOn = !registerTipOn" @mouseleave="registerTipOn = false">
         <small>AOE</small> 
          <Tip :bottom="true" tip="Age of Enquiry" v-if="registerTipOn" class="-left-5" />
      </th>
        <th class="p-0 relative" @mouseover="batchtip = !batchtip" @mouseleave="batchtip = false"><small>TB
          <Tip :bottom="true" tip="Total Batches" v-if="batchtip"  class="-left-5" /></small>
       </th>
        <th class="p-0 relative text-blue-500" @mouseover="lasttip = !lasttip" @mouseleave="lasttip=false"><small>LC 
          <Tip :bottom="true" tip="Last Called" v-if="lasttip"  class="-left-5" /></small></th>
        <th class="p-0 relative text-green-500" @mouseover="totaltip = !totaltip" @mouseleave="totaltip = false"><small>
           <Tip :bottom="true" tip="Total Called" v-if="totaltip"  class="-left-5" />TC</small></th>
        <th class="p-0 relative  text-purple-500" @mouseover="followuptip = !followuptip" @mouseleave="followuptip = false">
          <small>
          <Tip :bottom="true" tip="Total Called after followup" v-if="followuptip"  class="-left-5" />TCF
        </small></th>
        <th class="p-0 text-orange-500"><small>0 -1 -2 -3 -4 -5 -6 -7</small></th>
        <th class="p-0 text-lime-500"><small>8-15</small></th>
        <th class="p-0 text-lime-500"><small>16-45</small></th>
        <th class="p-0 text-lime-500"><small>46-90</small></th>
        <!-- <th><small>Mon</small></th> -->
        <th class="p-0 "><small>Comments</small></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="[index, client] in slicedItems"
        :key="index"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
      <!-- {{ client.status.converted}} -->
        <td data-label="Name" class="p-0">
          <small class="font-semibold capitalize">
            <span v-if="client.details && client.details.message && client.details.message.length != 0" class="text-red-400 text-base" ><icon :path="mdiAlertBox" size="18" class="text-red-500" inline="inline-block" /></span>
            <span v-if="client.enquiry.experienced === true"><icon :path="mdiAlphaEBox" size="18" class="text-blue-500" inline="inline-block" /></span>
            <span v-else  ><icon :path="mdiAlphaFBox" size="18" class="text-orange-500" inline="inline-block" /></span>
            <span v-if="client.enquiry.data_not_taken === true"><icon :path="mdiDatabaseAlert" size="18" class="text-cyan-500" inline="inline-block"/></span>
            <span  class="text-gray-300">
             {{ client.name }}
            </span>
            <span v-if="client.enquiry.enq_for_someone === true"
                >({{ client.enquiry.enquiree_name }})</span
              >
              <span v-if=" client.status&& client.status.converted&&client.status.converted===true"
              >
               <icon :path="mdiCheckDecagram" size="18" class="text-green-300" inline="inline-block"/>
               
              </span>
          </small>
        </td>
        <td data-label="Academics" class="p-0">
          <span v-if="client.enquiry.experienced === true" class="text-cyan-400" >
            <small> Exp </small>
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
                    client.education.highest_degree,
                    client.education.yop
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
            <span v-if="client.education.name">
              <small
                v-if="client.education.name.shortname"
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
          <small v-if="client.education && client.education.yop && client.enquiry.experienced === false" class="text-gray-400">
            - <span class="text-gray-500 dark:text-gray-300 capitalize">{{client.education.yop }} </span>
          </small>
        </td>
        <td data-label="Contact" class="p-0">
          <jb-button
            color="info"
            :icon="mdiPlusBox"
            outline
            small
            class="mr-1"
            @click="openContactModal(client.id, client.name)"
          />
          <span>
            <span v-if="client.enquiry.enq_for_someone === true" >
              <span v-for="(contact, i) in client.contact" :key="i" >
                <small v-if="i > 0" class="text-gray-400 dark:text-gray-300 capitalize">
                  <a class="" :href="'tel:' + contact.code + contact.number">
                    {{(contact.code + contact.number)}}
                    <!-- // maskNumber(contact.code + contact.number) -->
                  </a>
                </small>
              </span>
              <span>
                <small>
              <a class="" :href="'tel:' + client.contact[0].code + client.contact[0].number">
                ({{ client.contact[0].code + client.contact[0].number}})
                  <!-- // maskNumber(client.contact[0].code + client.contact[0].number) -->
                </a>
              </small></span>


            </span>
            <span v-else>
                  
              <!-- // maskNumber(contact.code + contact.number)}} -->
              <span v-for="(contact, i) in client.contact" :key="i">
                <small class="text-gray-400 dark:text-gray-300 capitalize">
                  <a class="" :href="'tel:' + contact.code + contact.number">{{(contact.code + contact.number)}}
                 
                  </a>
                </small>
                <br>
              </span>
            </span>
          </span>
        </td>
        <td data-label="Course" class="p-0 items-start flex gap-1 justify-start" 
         @mouseover="coursehover(client.id)"  @mouseleave="leavecourse(client.id)">
      
          <jb-button
            color="info"
            :icon="mdiPlusBox"
            outline
            small
            class="mr-1"
            @click="openCourseModal(client.id, client.name)"
          />
          <Popper hover placement="left">
          <ul>
          <li v-for="(course, i) in client.courses" :key="i" class="">
         
            <small v-if="course.course" class="text-gray-100 dark:text-gray-200">
              {{ course.course.name }}
              <span> - {{ course.mode_class.name }} </span>&nbsp;
              <!-- <span class="text-red-300 font-semibold"> - {{ dayjs(course.agreed_date).format("DD-MMM-YY") }}</span> <br/> -->
            </small>
          </li>
        </ul>
              <template #content >
                <small v-if="client.enquiry && client.enquiry.class_timing&& client.enquiry.class_timing.name">
                   {{ client.enquiry.class_timing.name }}
                   &nbsp;
              </small>
              <span v-if="client.enquiry && client.enquiry.time_slot!=[]">
                <small v-for="(time, i) in client.enquiry.time_slot" :key="i">
                   {{ time.name }}
                   &nbsp;
                </small>
              </span> 
              </template>
            </Popper>
         
        </td>
        
        <td data-label="DOE" class="p-0"  @mouseover="mousehover(client.id)"  @mouseleave="leavedata(client.id)">
          <small>
            <Popper hover placement="left">
              <button > {{ todayDate.diff(dayjs(client.created), 'day') }}</button>
              <template #content >
                <span>
                 {{dayjs( client.created).format('DD-MMM-YY')}}
              </span>
                
              </template>
            </Popper>
          </small>
        </td>
        <td data-label="Total Batches" class="p-0">
          
          <small v-if="client.followup&&client.followup.length" class="text-gray-300">
            {{ client.followup.length }}
          </small>
          <small v-else>0</small>
      </td>
        <td data-label="Last Call" class="p-0 text-blue-500">
          <small v-if="client.records">
            {{ getLastCall(client.records) }}
          </small>
          <small v-else class="text-gray-300">
            0
          </small>
        </td>
        <td data-label="Total Calls" class="p-0">
          <small v-if="client.records"  class="text-green-500">{{ getTc(client.records) }}</small>
          <small v-else class="text-green-500">
            0
          </small>
        </td>
        <td data-label="Total Calls Followup" class="p-0">
          <small v-if="client.records"  class="text-purple-500">{{ getFCalls(client.courses) }}</small>
          <small v-else class="text-purple-500">
            0
          </small>
        </td>
        <td data-label="0 -1 -2 -3 -4 -5 -6" class="p-0">
          
          <small v-if="client.records" class="text-orange-500">
            {{ get7(client.records) }}
          </small>
          <small v-else class="text-orange-500">
            0 0 0 0 0 0 0 0
          </small>
      </td>
      <td data-label="8-15" class="p-0">
          
          <small v-if="client.records" class="text-lime-500">
            {{ get8(client.records) }}
          </small>
          <small v-else class="text-lime-500">
            0
          </small>
      </td>
      <td data-label="16-45" class="p-0">
          
          <small v-if="client.records" class="text-lime-500">
            {{ get16(client.records) }}
          </small>
          <small v-else class="text-lime-500">
            0
          </small>
      </td>
      <td data-label="46-90" class="p-0">
          
          <small v-if="client.records" class="text-lime-500">
            {{ get46(client.records) }}
          </small>
          <small v-else class="text-lime-500">
            0
          </small>
      </td>
      <!-- <td data-label="Mon" class="p-0">
          
          <small v-if="client.followup" class="text-gray-300">
            {{ client.followup.length }}
          </small>
          <small v-else>0</small>
      </td> -->
        <td data-label="Comments" class="p-0">
          <small v-if="client.comment">
            <Popper hover placement="left">
                 <div  @click="commentmodal(client.id, client.name)" class="cursor-pointer"> <icon :path="mdiComment" size="20" class="text-blue-500 m-1" inline="inline-block"/>
          </div>
              <template #content>
                <!-- <p class="pb-1" v-for="(com,i) in client.comment" :key="i">{{ com.comment }} by <span class="italic text-orange-500">{{ com.authorname }}</span></p> -->
                <table class="">
                <thead class="bg-gray-900">
                  <th class=""><small>Name</small></th>
                  <th class=""><small>Comment</small></th>
                  <th class=""><small>Date</small></th>
                </thead>
                <tbody>
                  <tr
                    v-for="(cl, index) in getComments(client.comment)"
                    :key="index"
                    :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
                  >
                  <td data-label="Name" class="">{{ cl.authorname }}</td>
                  <td data-label="Comment" class="">{{ cl.comment }}</td>
                  <td data-label="Comment" class="">{{ cl.date }}</td>
                  </tr>
                </tbody>
                </table>
    
              </template>
            </Popper>
          </small>
          <small v-else class="text-gray-400 dark:text-gray-400 text-xs">   <div  @click="commentmodal(client.id, client.name)" class="cursor-pointer"> <icon :path="mdiComment" size="20" class="text-blue-500 m-1" inline="inline-block"/>
          </div></small>
        </td>
      </tr>
    </tbody>
  </table>
  <vue-awesome-paginate
    :total-items="itemsLength"
    :items-per-page="itemsPerPage"
    :max-pages-shown="itemsShown"
    v-model="currentPage"
    :on-click="onClickHandler"
    class="sticky bottom-0 z-[1] bg-[#151D2B] w-full py-2"
  />
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
  .pagination-container {
    display: flex;
    column-gap: 10px;
  }
  .paginate-buttons {
    height: 25px;
    width: 25px;
    border-radius: 10px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
  }
  .paginate-buttons:hover {
    background-color: #d8d8d8;
  }
  .active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
  }
  .active-page:hover {
    background-color: #2988c8;
  }
</style>