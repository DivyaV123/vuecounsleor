
<script setup>
import { ref, reactive, onBeforeMount, computed, onMounted } from "vue";
import { counselorStore } from "../stores/counselor";
import HeroBar from "@/components/HeroBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import CheckRadioPicker from "@/components/CheckRadioPicker.vue";
import Field from "@/components/Field.vue";
import TitleSubBar from "@/components/TitleSubBar.vue";
import JbButton from "@/components/JbButton.vue";
import { selectClasses } from "../selectcss";
import validator from "email-validator"
import {
  mdiBallot,
  mdiBallotOutline,
  mdiAccount,
  mdiMail,
  mdiCheck,
  mdiProgressCheck,
  mdiReload,
  mdiPhone,
  mdiPlusBox,
  mdiMinusBox,
} from "@mdi/js";
import Control from "@/components/Control.vue";
import Divider from "@/components/Divider.vue";
import Multiselect from "@vueform/multiselect";
import { themeStore } from "../stores/theme";
import { useRoute, useRouter } from "vue-router";
import { sessionStore } from "../stores/session";
import dayjs from "dayjs";

const theme = themeStore();
const counselor = counselorStore();
const route = useRoute();
const router = useRouter();
const user = sessionStore();

const countryCode = [{"code":"+91"},
  {"code":"+97"},
  {"code":"+968"},
  {"code":"+1"},
  {"code":"+355"},
  {"code":"+61"},
  {"code":"+93"},
  {"code":"+376"},
  {"code":"+1684"},
  {"code":"+244"},
  {"code":"+1264"},
  {"code":"+1268"},
  {"code":"+54"},
  {"code":"+374"},
  {"code":"+297"},
  {"code":"+43"},
  {"code":"+65"},
  {"code":"+994"},
  {"code":"+1242"},
  {"code":"+973"},
  {"code":"+880"},
  {"code":"+1246"},
  {"code":"+375"},
  {"code":"+32"},
  {"code":"+501"},
  {"code":"+229"},
  {"code":"+1441"},
  {"code":"+975"},
  {"code":"+591"},
  {"code":"+387"},
  {"code":"+267"},
  {"code":"+55"},
  {"code":"+246"},
  {"code":"+673"},
  {"code":"+1284"},
  {"code":"+226"},
  {"code":"+257"},
  {"code":"+855"},
  {"code":"+237"},
  {"code":"+238"},
  {"code":"+599"},
  {"code":"+1345"},
  {"code":"+236"},
  {"code":"+235"},
  {"code":"+56"},
  {"code":"+86"},
  {"code":"+57"},
  {"code":"+269"},
  {"code":"+977"},
  {"code":"+0046"},
  {"code":"+256"},
  {"code":"+64"},
  {"code":"+44"},
  {"code":"+46"},
  {"code":"+47"},
  {"code":"+49"}, {"code":"+353"},
  {"code":"+601"}];
  const educ = reactive({
  highest_degree: null,
  yop: "",
  name: null,
  percentage: null,
  stream_object: null,
  college_object: null,
 
});
const classtiming = computed(() => counselor.classtiming.items);
// const Specialcourse = computed(() => counselor.special_course.items);
const timeslot = computed(() => counselor.timeslot);

const courses = computed(() => {
  if (counselor.courses && counselor.courses.courses) {
    return counselor.courses.courses;
  }
});
const courseBranches = computed(() => {
  let getCBranches = [];
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
    // return counselor.courseBranches.branches;
  }
});

const modeclass = computed(() => counselor.modeclass.items);
const highestdegree = computed(() => counselor.highestdegree.items);
const branches = computed(() => counselor.branches_min);
const mode = computed(() => counselor.mode.items);
const specialcourse = computed(() => counselor.special_course.items);
const degree = computed(() => {
  let DegreeItems = [];
  counselor.degree.items.filter(deg =>{
    if(deg.details.qualification_type && deg.details.qualification_type.name === 'degree'){
      DegreeItems.push({id:deg.id,concatname:deg.name+"-"+deg.details.shortname,name:deg.name,shortname:deg.details.shortname})
    }
  })
  return DegreeItems;
});
const fetchDegreeStream = async () => {
  let query = "name=&degree=" +  educ.name.id
  await counselor.getStreams(query);
}
const degreeStreams = computed(() => {
  if(counselor.streams && counselor.streams.items){
    let StreamItems = [];
    counselor.streams.items.forEach(stream =>{
    StreamItems.push({id:stream.id,concatname:stream.name+"-"+stream.shortname,name:stream.name,shortname:stream.shortname})
  })
  return StreamItems
  }

});


const masters = computed(() => {
  let MastersItems = [];
  counselor.degree.items.filter(mast =>{
    if(mast.details.qualification_type && mast.details.qualification_type.name === 'masters'){
      MastersItems.push({id:mast.id,concatname:mast.name+"-"+mast.details.shortname,name:mast.name,shortname:mast.details.shortname})
    }
  })
  return MastersItems;
});

const fetchStream = async (query, degree) => {
  let StreamItems = [];
  // query = "[[\"name\",\"like\",\"" + query +"\"]]";
  query = "name=" + query + "&type=" + degree
  let streams = await counselor.getStreams(query);
  streams.items.filter((strm) =>{
    StreamItems.push({id:strm.id,concatname:strm.name+"-"+strm.shortname,name:strm.name,shortname:strm.shortname})
  })
  return StreamItems;
};

const fetchCollege = async (query, degree) => {
  let CollegeItems = [];
  // query = "[[\"name\",\"like\",\"" + query +"\"]]";
  query = "name=" + query + "&degree=" + degree
  let colleges = await counselor.getColleges(query);
  colleges.items.filter((clg) =>{
    CollegeItems.push({id:clg.id,concatname:clg.name+"-"+clg.shortname,name:clg.name,shortname:clg.shortname})
  })
  return CollegeItems;
};

const years = [...Array(30)].map((a, b) => (new Date().getFullYear() + 2) - b);

const contact = ref([
  { number: "", code: countryCode[0].code, readonly: false },
]);

const email = ref([{ email: "" ,verify:false}]);



const prepopulateNumber = computed(() => {
  if (route.query && route.query.number) {
    contact.value[0].number = route.query.number;
    contact.value[0].readonly = true;
  }
});
const dropoutname=ref('')
const record = computed(() => {
  if (route.query && route.query.rid ) {
    if (counselor.singleRecord) {
      contact.value[0].number = counselor.singleRecord.name;
      contact.value[0].readonly = true;
    }
    return counselor.singleRecord; 
  }

  if (route.query && route.query.id) {
    if (counselor.student ) {
      if (counselor.student.contact&&contactbool.value==false ){
    for(let i=0;i<counselor.student.contact.length;i++){
      for(let j=0;j<contact.value.length;j++){
        Object.assign(contact.value,
          counselor.student.contact
        )
        // contact.value=counselor.student.contact
        contact.value[j].readonly=true
      }
    }
  }
  if (counselor.student.email&&emailBool.value==false ){
    for(let i=0;i<counselor.student.email.length;i++){
      for(let j=0;j<email.value.length;j++){
        email.value=counselor.student.email
        email.value[j].verify=true
      }
    }
  }
    dropoutname.value=counselor.student.name
    formState.name=dropoutname.value
    }
    return counselor.student;
   
  }
  else {
    contact.value = [
      { number: "", code: countryCode[0].code, readonly: false },
    ];
    email.value=[{email:"",verify:false}];
    formState.name="";
    return null;
  }
});




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

const check_author_branch = async (key) => {
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

const scourse = ref([
  { name: null, 
  othercourse:false,
  other_course:"",
  mode_class: null, 
  branch: [] 
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


const refer = ref([
  { referee_name: "", referee_code: countryCode[0].code, referee_number: "", author: user.author },
]);

const formState = reactive({
  name: "",
  enq_for_someone: false,
  enquiree_name: "",
  experienced: false,
  mode: null,
  contact: contact,
  email: email,
  // flexi_timing: null,
  course_enquiries: null,
  class_timing: null,
  time_slot: [],
  data_not_taken: false,
  course: course,
  scourse: scourse,
  education: educ,
  refer: refer,
  comment: "",
  rid:0

});

const resetForm = () => {
  Object.assign(educ, {
    highest_degree: null,
    yop: "",
    name: null,
    percentage: null,
    stream_object: null,
    college_object: null,
  });
  contact.value = [{ number: "", code: countryCode[0].code, readonly: false }];
  email.value = [{ email: "" }];
  course.value = [
    {
      course: null,
      // other_courses: [],
      mode_class: null,
      //agreed_date: "",
      branch: [],
      actualbranch:[]
    },
  ];
  scourse.value = [
    { 
      name: null, 
      othercourse:false,
      other_course:"", 
      mode_class: null, 
      // agreed_date: "", 
      branch: [] 
      }];
  refer.value = [{ referee_name: "", referee_code: countryCode[0].code, referee_number: "", author: user.author }];
  Object.assign(formState, {
    name: "",
    enq_for_someone: false,
    enquiree_name: "",
    experienced: false,
    mode: null,
    contact: contact,
    email: email,
    // flexi_timing: null,
    course_enquiries: null,
    class_timing: null,
    time_slot: [],
    data_not_taken: false,
    course: course,
    scourse: scourse,
    education: educ,
    refer: refer,
    comment: "",
  });
  router.replace({ query: {} });
};

const formLoading = ref(false);

const validEmail = (email) => {
    if(/\s/g.test(email)&&email){
    return validator.validate(email)
  }
  else{
    return true
  }

};

const showDiplomaEducation = computed(() => {
  Object.assign(educ, {
    name: null,
    percentage: null,
    stream_object: null,
    other_stream:false,
    otherstream:"",
    college_object: null,
    other_college:false,
    othercollege:"",
  });
  if (
    !formState.experienced &&
    !formState.data_not_taken &&
    educ.highest_degree &&
    educ.highest_degree.name === "diploma"
  ) {
    return true;
  } else {
    return false;
  }
});
const changingdiplomastream = async () => {

  if(formState.education.highest_degree.name==="diploma"){
    formState.education.stream_object=null
    formState.education.otherstream=""
  }

};
const changingdiplomacollege = async () => {

  if(formState.education.highest_degree.name==="diploma"){
    formState.education.college_object=null
    formState.education.othercollege=""
  }

};
const changingcourse = async (data) => {

  if(formState.course_enquiries==="special"){
    formState.scourse[data].other_course=""
    formState.scourse[data].name=null
  }

};

const changingcourse1 = async (data) => {

  if(formState.course_enquiries==="both"){
    formState.scourse[data].other_course=""
    formState.scourse[data].name=null
  }

};

const changingitistream = async () => {

  if(formState.education.highest_degree.name==="iti"){
    formState.education.stream_object=null
    formState.education.otherstream=""
  }

};
const changingiticollege = async () => {

  if(formState.education.highest_degree.name==="iti"){
    formState.education.college_object=null
    formState.education.othercollege=""
  }

};
const show_degreetype = ref(false)
const changingdegreename = async () => {

  if(formState.education.highest_degree.name==="degree"){
    formState.education.name=null
    formState.education.otherdegree=""
    formState.education.stream_object=null
    formState.education.otherstream=""
    if(formState.education.other_degree===false){
        formState.education.other_stream = true
        show_degreetype.value=true
      }
      else{
        formState.education.other_stream = false
        show_degreetype.value=false
      }
  }
  

};

const changingdegreestream = async () => {

  if(formState.education.highest_degree.name==="degree"){
    formState.education.stream_object=null
    formState.education.otherstream=""
  }

};

const clearallfunction = async(data) => {

  show_mastertype.value=false,
  show_degreetype.value=false
}
const changingdegreecollege = async () => {

  if(formState.education.highest_degree.name==="degree"){
    formState.education.college_object=null
    formState.education.othercollege=""
  }

};
const show_mastertype = ref(false)
const changingmastersname = async () => {

  if(formState.education.highest_degree.name==="masters"){
    formState.education.name=null
    formState.education.otherdegree=""
    formState.education.stream_object=null
    formState.education.otherstream=""
    if(formState.education.other_degree===false){
        formState.education.other_stream = true
        show_mastertype.value=true
      }
      else{
        formState.education.other_stream = false
        show_mastertype.value=false
      }
  }

};

const changingmastersstream = async () => {

  if(formState.education.highest_degree.name==="masters"){
    formState.education.stream_object=null
    formState.education.otherstream=""
  }

};
const changingmasterscollege = async () => {

  if(formState.education.highest_degree.name==="masters"){
    formState.education.college_object=null
    formState.education.othercollege=""
  }

};
const changingenqforsomeone = async () => {
  formState.enquiree_name = ""
// if(formState.education.highest_degree.name==="masters"){
//   formState.education.college_object=null
//   formState.education.othercollege=""
// }

};
const changingexperienced = async () => {
  formState.data_not_taken = false
  educ.yop = ""
// if(formState.education.highest_degree.name==="masters"){
//   formState.education.college_object=null
//   formState.education.othercollege=""
// }

};
const showItiEducation = computed(() => {
  Object.assign(educ, {
    name: null,
    percentage: null,
    stream_object: null,
    other_stream:false,
    otherstream:"",
    college_object: null,
    other_college:false,
    othercollege:"",
    
  });
  if (
    !formState.experienced &&
    !formState.data_not_taken &&
    educ.highest_degree &&
    educ.highest_degree.name === "iti"
  ) {
    return true;
  } else {
    return false;
  }
});

const showDegreeEducation = computed(() => {
  Object.assign(educ, {
    name: null,
    percentage: null,
    other_degree:false,
    otherdegree:"",
    stream_object: null,
    other_stream:false,
    otherstream:"",
    college_object: null,
    other_college:false,
    othercollege:"",
  });
  if (
    !formState.experienced &&
    !formState.data_not_taken &&
    educ.highest_degree &&
    educ.highest_degree.name === "degree"
  ) {
    return true;
  } else {
    return false;
  }
});
const showMastersEducation = computed(() => {
  Object.assign(educ, {
    name: null,
    percentage: null,
    other_degree:false,
    otherdegree:"",
    stream_object: null,
    other_stream:false,
    otherstream:"",
    college_object: null,
    other_college:false,
    othercollege:"",
  });
  if (
    !formState.experienced &&
    !formState.data_not_taken &&
    educ.highest_degree &&
    educ.highest_degree.name === "masters"
  ) {
    return true;
  } else {
    return false;
  }
});
const contactbool=ref(false)
 
const addContact = () => {
  contactbool.value=true
  checkvalidate.value=false
  contact.value.push({
    number: "",
    code: countryCode[0].code,
    readonly: false,
  });
};

const todayDate = () => {
  return dayjs().format("YYYY-MM-DD");
};

const removeContact = () => {
  checkvalidate.value=false
  if(counselor.check_num &&counselor.check_num.number){
    counselor.check_num.number.pop()
  }
  contact.value.pop();
};

const emailBool=ref(false)
const addEmail = () => {
  emailBool.value=true
  email.value.push({ email: "" ,verify:false});
};
const removeEmail = () => {
  email.value.pop();
};

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
    // other_courses: [],
    mode_class: null,
    //agreed_date: "",
    branch: [],
    actualbranch:[]

  });
};
const removeCourse = () => {
  course.value.pop();
};

const addSCourse = () => {
  scourse.value.push({
    name: null, 
    othercourse:false,
    other_course:"",
    mode_class: null,
    // agreed_date: "",
    branch: [],
  });
};
const removeSCourse = () => {
  scourse.value.pop();
};

const addRefer = () => {
  refer.value.push({
    referee_name: "",
    referee_code: countryCode[0].code,
    referee_number: "",
    author: user.author
  });
};
const removeRefer = () => {
  refer.value.pop();
};

const submit = async () => {
  formState.contact = contact;
  formState.email = email;
  formState.course = course;
  formState.scourse = scourse;
  formState.education = educ;

  
  let valid = true;
  let formValues = JSON.parse(JSON.stringify(formState));
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
  // if (
  //   formValues["course_enquiries"] !== null &&
  //   formValues["course"][0].course === null &&
  //   formValues["scourse"][0].name.length === 0
  // ) 
  // formValues["course"][0].other_courses.length === 0 &&
  // {
  //   valid = false;
  //   theme.pushMessage("Please select atleast one regular/special course!");
  // }
 
  for (const key in formValues) {
    if (
      key === "name" &&
      (formValues[key].length <3 || !checkString(formValues[key]))
    ) {
      valid = false;
      theme.pushMessage("Student Name is not valid!");
    }
    if (
      key === "enquiree_name" &&
      formValues["enq_for_someone"] &&
      (formValues[key].length <3 || !checkString(formValues[key]))
    ) {
      valid = false;
      theme.pushMessage("Enquiree name is not valid!");
    }
    if (key === "mode" && formValues[key] === null) {
      valid = false;
      theme.pushMessage("Mode of enquiry is required!");
    }

    if (key === "contact") {
      formValues[key].forEach((element) => {
        let num = element.number.replace(/\s+/g, "");
       if(element.number ==null){
        valid = false;
        theme.pushMessage("Contact number is required!");
       }
        if(element.code == +91 && (num.length !=10 || isNaN(num))){
          valid = false;
          theme.pushMessage("Contact number with valid number is required!");
        }
        if (element.code != +91 && (!num.length || isNaN(num)) ){
          valid = false;
          theme.pushMessage("Contact number with valid number is required!");
        }
        if (element.code === null) {
          valid = false;
          theme.pushMessage("Country Code with contact number is required!");
        }
      });
    }
    if (key === "email") {
      formValues[key].forEach((element) => {
        // if (formValues["enq_for_someone"] === false) {
          
          if (/\s/g.test(element.email)||(element.email &&validator.validate(element.email)===false)) {
        // console.log("ele",element)
        // if (formValues["enq_for_someone"] ==false ||element.email!='') {
        //   if (!validEmail(element.email)) {
            valid = false;
            theme.pushMessage("Email with valid ID is required!");
          // }
        // }
      // });
    }
  })
}
    // if (key === "flexi_timing" && formValues[key] === null) {
    //   valid = false;
    //   theme.pushMessage("Flexi/Rigid Timing is required!");
    // }

    // formValues["flexi_timing"] === true &&
    if (
      key === "class_timing" &&
      formValues[key] === null
    ) {
      valid = false;
      theme.pushMessage("Class timing is required!");
    }
    // if (
    //   key === "time_slot" &&
    //   formValues["flexi_timing"] === false &&
    //   formValues[key].length === 0
    // ) {
    //   valid = false;
    //   theme.pushMessage("Time slot is required!");
    // }
    if (key === "education" && formValues[key]["yop"].length === 0) {
      if (!formValues["experienced"]) {
        valid = false;
        theme.pushMessage("Highest degree pass out Year is required!");
      }
    }
    if (key === "course"&& formValues["course"][0].course !== null ) {
      formValues[key].forEach((element) => {
        if (
          (element.course !== null && element.mode_class === null) 
        ) {
          valid = false;
          theme.pushMessage("Enter regular course details completely!!");
        }
        if (element.course !== null && element.branch.length === 0) {
          valid = false;
          theme.pushMessage("Select branch details for regular course enquiry!");
        }
      });
    }


    if (key === "scourse" && ((formValues["scourse"][0].name != null)||(formValues["scourse"][0].other_course&&formValues["scourse"][0].other_course.length != 0))) {
      formValues[key].forEach((element) => {
        if ((element.name != null||element.other_course.length!=0)&&element.mode_class === null) {
          valid = false;
          theme.pushMessage("Enter special course details completely!!");
        }
        else if(element.othercourse==true&&(element.other_course==''||element.mode_class === null||element.other_course.length<3)){
          valid = false;
          mainStore.pushMessage("Enter special course details completely!!");
        }
      });
    }
    if (key === "education" && formValues[key]["highest_degree"] === null) {
      valid = false;
      theme.pushMessage("Highest Degree is required!");
    }

    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "diploma" &&
      (formValues[key]["percentage"] === null)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill Diploma Percentage!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "diploma" &&
      (formValues[key]["stream_object"] === null&&formValues[key]["other_stream"]===false)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill Diploma stream details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "diploma" &&
      (formValues[key]["otherstream"].replace(/\s/g, '').length<3&&formValues[key]["other_stream"]===true)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill Diploma stream details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "diploma" &&
      (formValues[key]["college_object"] === null&&formValues[key]["other_college"]===false)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill Diploma college details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "diploma" &&
      (formValues[key]["othercollege"].replace(/\s/g, '').length<3&&formValues[key]["other_college"]===true)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill Diploma college details!");
      }
    }

    

    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "iti" &&
      (formValues[key]["percentage"] === null)
    )
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null) 
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill ITI Percentage!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "iti" &&
      (formValues[key]["stream_object"] === null&&formValues[key]["other_stream"]===false)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill ITI stream details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "iti" &&
      (formValues[key]["otherstream"].replace(/\s/g, '').length<3&&formValues[key]["other_stream"]===true)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill ITI stream details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "iti" &&
      (formValues[key]["college_object"] === null&&formValues[key]["other_college"]===false)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill ITI college details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "iti" &&
      (formValues[key]["othercollege"].replace(/\s/g, '').length<3&&formValues[key]["other_college"]===true)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill ITI college details!");
      }
    }

    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "degree" &&
      (
        formValues[key]["percentage"] === null)
    ) 
    // (formValues[key]["name"] === null ||
    //  formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill Degree percentage!");
      }
    }
     if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "degree" &&
      (formValues[key]["name"] === null&&formValues[key]["other_degree"]===false)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill degree name details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "degree" &&
      (formValues[key]["otherdegree"].replace(/\s/g, '').length<3&&formValues[key]["other_degree"]===true)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill degree name details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "degree" &&
      (formValues[key]["stream_object"] === null&&formValues[key]["other_stream"]===false)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill degree stream details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "degree" &&
      (formValues[key]["otherstream"].replace(/\s/g, '').length<3&&formValues[key]["other_stream"]===true)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill degree stream details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "degree" &&
      (formValues[key]["college_object"] === null&&formValues[key]["other_college"]===false)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill degree college details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "degree" &&
      (formValues[key]["othercollege"].replace(/\s/g, '').length<3&&formValues[key]["other_college"]===true)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill degree college details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "masters" &&
      (
        formValues[key]["percentage"] === null )
    )
    // (formValues[key]["name"] === null ||
    //   formValues[key]["percentage"] === null ||
    //   formValues[key]["stream_object"] === null ||
    //   formValues[key]["college_object"] === null) 
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill Masters Percentage!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "masters" &&
      (formValues[key]["name"] === null&&formValues[key]["other_degree"]===false)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill Masters name details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "masters" &&
      (formValues[key]["otherdegree"].replace(/\s/g, '').length<3&&formValues[key]["other_degree"]===true)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill Masters name details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "masters" &&
      (formValues[key]["stream_object"] === null&&formValues[key]["other_stream"]===false)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill Masters stream details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "masters" &&
      (formValues[key]["otherstream"].replace(/\s/g, '').length<3&&formValues[key]["other_stream"]===true)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill Masters stream details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "masters" &&
      (formValues[key]["college_object"] === null&&formValues[key]["other_college"]===false)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill Masters college details!");
      }
    }
    if (
      key === "education" &&
      formValues[key]["highest_degree"] !== null &&
      formValues[key]["highest_degree"]["name"] === "masters" &&
      (formValues[key]["othercollege"].replace(/\s/g, '').length<3&&formValues[key]["other_college"]===true)
    ) 
    // (formValues[key]["percentage"] === null ||
    //  formValues[key]["stream_object"] === null ||
    //  formValues[key]["college_object"] === null)
    {
      if (!formValues["experienced"] && !formValues["data_not_taken"]) {
        valid = false;
        theme.pushMessage("Please fill Masters college details!");
      }
    }

    if (key === "refer") {
      formValues[key].forEach((element) => {
        let num = element.referee_number.replace(/\s+/g, "");
       if(element.referee_name.length > 0 && element.referee_code ===null){
        valid = false;
          theme.pushMessage("Please fill referrals properly");
       }
        if (
          ((element.referee_name.length > 0) &&
         ((element.referee_code === "+91" && (num.length !=10 || isNaN(num)))||(element.referee_code != "+91" && (!num.length || isNaN(num))))) ||
          (element.referee_number.length > 0 &&
            element.referee_name.length === 0)
        ) {
          valid = false;
          theme.pushMessage("Please fill referrals properly");
        }
        let rnum = element.referee_number.replace(/\s+/g, "");
      //   if(element.referee_number ==null){
      //   valid = false;
      //   theme.pushMessage("Referral number is required!");
      //  }
        // if(element.referee_code == +91 && (rnum.length !=10 || isNaN(rnum))){
        //   valid = false;
        //   theme.pushMessage("Referral number with valid number is required!");
        // }
        
        // if (element.referee_number&&element.referee_number.length !== 0 && rnum.length < 10 || isNaN(rnum)) {
        //   valid = false;
        //   theme.pushMessage("Referral number with valid number is required!");
        // }
        // if (element.referee_number &&element.referee_number.length !== 0 && element.referee_code === null) {
        //   valid = false;
        //   theme.pushMessage("Country Code with referral number is required!");
        // }
      });
    }

    if (key === "contact" && formValues["refer"]) {
      var refernumber = formValues.refer.map(function(item){ return item.referee_number });
      var isreferDuplicate = refernumber.some(function(item, idx){
        if(item){
          return refernumber.indexOf(item) != idx 
        } 
      });
      if(isreferDuplicate==true){
        valid = false;
      theme.pushMessage("Referral Number Already exists!");
       }
         
      for (var enq_num in formValues[key]) {
        for (var ref_num in formValues["refer"]) {
          let enq_numb = formValues[key][enq_num].number.replace(/\s+/g, "");
          let ref_numb = formValues["refer"][ref_num].referee_number.replace(/\s+/g, "");
      if(enq_numb.length>0){
          if(ref_numb === enq_numb){
            valid = false;
            theme.pushMessage("Enquiry contact and Referal contact Should Not be Same");
        }
      }
      }}
    }
  }
  var valueArr = formValues.contact.map(function(item){ return item.number.replace(/\s+/g, "") });
var isDuplicate = valueArr.some(function(item, idx){ 
  if(item){
    return valueArr.indexOf(item) != idx 
  }
  });
  if(isDuplicate==true){
    valid=false
    theme.pushMessage("Number Already exists!")
  }
  
  var valueArr = formValues.email.map(function(item){ return item.email.replace(/\s+/g, "") });
   var isEmailDuplicate = valueArr.some(function(item, idx){ 
    if(item){
      return valueArr.indexOf(item) != idx 
    }
      });
      if(isEmailDuplicate==true){
        valid= false
        theme.pushMessage("Email is Already exists!")
    }

  if (valid) {
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
          // agreed_date: formValues.course[c].agreed_date,
          branch: br.value,
        });
        course_copy.value.push({
          course: cr.value,
          // other_courses: ocr.value,
          mode_class: { id: 2, name: "online" },
          // agreed_date: formValues.course[c].agreed_date,
          branch: br.value,
        });
      } else {
        course_copy.value.push({
          course: cr.value,
          // other_courses: ocr.value,
          mode_class: mc,
          // agreed_date: formValues.course[c].agreed_date,
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

    // if (formValues.email && formValues.email[0].email === "") {
    //   formValues.email = [];
    // }
    let rem = formValues.email.filter((ele) => ele.email !='')
    formValues.email = rem

    let mode_copy = null, class_timing_copy = null, time_slot_copy = ref([]), refer_copy = ref([]);

    if(formValues.mode && formValues.mode.id){
      mode_copy = { id:formValues.mode.id, name:formValues.mode.name }
    }

    // if(formValues.flexi_timing === true)
    if(formValues.class_timing && formValues.class_timing.id){
      class_timing_copy = { id:formValues.class_timing.id, name:formValues.class_timing.name }
    }

    // if(formValues.flexi_timing === false){
    if(formValues.time_slot && formValues.time_slot.length > 0){
      for(const ts in formValues.time_slot){
        time_slot_copy.value.push({id:formValues.time_slot[ts].id, name:formValues.time_slot[ts].name})
      }
    }
    // }
    
    // if(formValues.refer && formValues.refer[0] && formValues.refer[0].referee_name.length === 0 && formValues.refer[0].referee_number.length === 0){
    //   formValues.refer = []
    // }
    let refer = formValues.refer.filter((ele) => ele.referee_number!='')
    formValues.refer = refer
    if (formValues.education && formValues.education.highest_degree) {
      formValues.education.highest_degree = { id:formValues.education.highest_degree.id, name:formValues.education.highest_degree.name}
    }

    if (formValues.education && formValues.education.name) {
      formValues.education.name = { id:formValues.education.name.id, name:formValues.education.name.name, shortname:formValues.education.name.shortname}
    }

    if (formValues.education && formValues.education.yop) {
    formValues.education.yop = (formValues.education.yop).toString()
    }

    if (formValues.education && formValues.education.stream_object) { 
      formValues.education.stream_object = { id:formValues.education.stream_object.id, name:formValues.education.stream_object.name, shortname:formValues.education.stream_object.shortname }
    }

    if (formValues.education && formValues.education.college_object) {
      formValues.education.college_object = { id:formValues.education.college_object.id, name:formValues.education.college_object.name, shortname:formValues.education.college_object.shortname }
    }

    let contact_copy = ref([]);

    for (var ct in formValues.contact) {
      let number_copy = "";
      number_copy = formValues.contact[ct].number.replace(/\s+/g, "");
      contact_copy.value.push({
        number: number_copy,
        code: formValues.contact[ct].code,
        readonly: formValues.contact[ct].readonly,
      });
    }


   if(formValues.experienced==true || formValues.education.highest_degree&& 
   formValues.education.highest_degree.name== "12th/puc" ){
      formValues.data_not_taken=false 
    }
    if(formValues.enq_for_someone==false){
      formValues.enquiree_name=''
    }
    let formSubmit =""

    if(route.query.rid){
       formSubmit = {
      name: formValues.name,
      enquiry: {
        enq_for_someone: formValues.enq_for_someone,
        enquiree_name: formValues.enquiree_name,
        experienced: formValues.experienced,
        mode_of_enquiry: mode_copy,
        // flexi_timing: formValues.flexi_timing,
        class_timing: class_timing_copy,
        time_slot: time_slot_copy.value,
        data_not_taken: formValues.data_not_taken,
        comment: formValues.comment,
      },
      contact: contact_copy.value,
      email: formValues.email,
      course: course_copy.value,
      scourse: scourse_copy.value,
      education: formValues.education,
      refers: formValues.refer,
      author: user.author,
      rid:parseInt(route.query.rid)
    };
    }
    else{
       formSubmit = {
      name: formValues.name,
      enquiry: {
        enq_for_someone: formValues.enq_for_someone,
        enquiree_name: formValues.enquiree_name,
        experienced: formValues.experienced,
        mode_of_enquiry: mode_copy,
        // flexi_timing: formValues.flexi_timing,
        class_timing: class_timing_copy,
        time_slot: time_slot_copy.value,
        data_not_taken: formValues.data_not_taken,
        comment: formValues.comment,
      },
      contact: contact_copy.value,
      email: formValues.email,
      course: course_copy.value,
      scourse: scourse_copy.value,
      education: formValues.education,
      refers: formValues.refer,
      author: user.author,
    };
    }
console.log("S<gm",formSubmit)
 await counselor.submitEnquiry(formSubmit);
    router.replace("/");
  } else {
    formLoading.value = false;
    // theme.pushMessage("Form Error, please fill out mandatory fields");
  }
};

onMounted(async () => {
  await user.checkUser();
  if (!user.loggedIn) {
    router.push("login");
  }
});

onBeforeMount(async () => {
  formLoading.value=true
  counselor.check_num=[]
  theme.setPageTitle("Add enquiry");
  theme.setSubTitle("")
  if (route.query && route.query.rid) {
    await counselor.getRecord(route.query.rid);
  }
  if (route.query && route.query.id) {
    await counselor.getStudentDetails(route.query.id);
  }

  await counselor.getClassTiming();
  await counselor.getSpecialCourse();
  await counselor.getTimeSlots();
  await counselor.getCourses();
  await counselor.getModeClass();
  await counselor.getHighestDegree();
  await counselor.getdisablebranch();
  await counselor.getCourseBranches();
  await counselor.getDegree();
  // await counselor.getStreams();
  // await counselor.getColleges();
  await counselor.getModeEnquiry();
  formLoading.value=false

});


const alldisable=(cou,index,data)=>{
let nextitem=data[index]
// if(nextitem.disabled==true){
//   nextitem.disabled=false
// }
for(let i=0;i<data.length;i++){
  if(i<index){
    data[i].disabled=true
  }
}
}

const clearbranch=(cou,index,data)=>{
  cou.branch=[]
// let nextitem=data[index]
// if(nextitem.disabled==true){
//   nextitem.disabled=false
// }
// for(let i=0;i<data.length;i++){
//   if(i!=index){
//     data[i].disabled=true
//   }
// }
} 

const removebranch=(key)=>{
 course.value[key].branch=[]
//  course.value[key].mode_class=[]
}

 const checkvalidate=ref(false)
const checknumber=async()=>{
  checkvalidate.value=false
  let check_data=[]
  formLoading.value=true
  let valid=false
for(let i=0;i<contact.value.length;i++){
  let number = contact.value[i].number.replace(/\s+/g, "");
  if (contact.value[i].code === null) {
    valid=true
 theme.pushMessage("Country Code with contact number is required!");
    }
  if(contact.value[i].code == +91 && (number.length !=10 || isNaN(number))){
    valid=true
    theme.pushMessage("Contact number with valid number is required!");
  }
 if (contact.value[i].code != +91 && (!number.length || isNaN(number)) ){
  valid=true
  theme.pushMessage("Contact number with valid number is required!");
  }
  else if(contact.value[i].readonly===false){
    check_data.push({"number":contact.value[i].number.trim()})
  }
}
if(valid==false&&check_data.length &&check_data.length>0){
  await counselor.postcheckdata(check_data)

  if(counselor.check_num){
  const found = counselor.check_num.number.every(el =>{
    return el.exists===false
  });
  if(!found==false){
    formLoading.value=false
    checkvalidate.value=true
  }
  else{
    formLoading.value=false
    checkvalidate.value=false
    theme.pushMessage("exits in database")
  }
}
}
else{
  formLoading.value=false

}

}

const handlechange=()=>{
  checkvalidate.value=false

}
</script>

<style>
.checkbox{
  margin-left: 0 !important;
}
</style>
<template>
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
      Submitting enquiry
    </h2>
    <p class="w-1/3 text-center text-white">
      This may take a few seconds, please wait.
    </p>
  </div>
  <table v-if="record&&!route.query.name" class="mt-6">
    <tbody>
      <tr>
        <td v-if="record.record">
          <audio
            :src="`https://gotest.qspiders.com/records/${record.record}`"
            controls
            controlsList="nodownload"
            class="w-60 h-8"
          >
            Your browser does not support the audio element.
          </audio>
        </td>
        <td><span class="font-semibold">DateTime: </span>{{ dayjs(record.time).format("DD-MMM-YY hh:mm") }}</td>
      </tr>
    </tbody>
  </table>

  <card-component class="mt-[18px]">
    <!-- <card-component> -->
      <title-sub-bar title="Personal Information" class=" bg-zinc-900 border-b border-white sm:px-2 pl-2 pr-2 mb-2"/>
      <field class="box-border w-50 p-1">
        <field help="Enquiry for someone else" class="box-border w-50 px-1 py-2 border border-gray-800  mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="formState.enq_for_someone"
            name="enq_for_someone"
            :options="{ true: 'Enquiry for someone else' }"
            @input="changingenqforsomeone"
          />
        </field>
        <field help="Experienced Enquiry" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="formState.experienced"
            name="experienced"
            class="border-gray-400"
            @input="changingexperienced"
            :options="{ true: 'Experienced Enquiry' }"
          />
        </field>
        <control
          v-if="formState.enq_for_someone"
          v-model="formState.enquiree_name"
          :icon-left="mdiAccount"
          help="Enquiree Name"
          placeholder="Enquiree Name"
          class="box-border w-50 px-1 py-2 border border-gray-800  mb-2 rounded bg-gray-800 padding-space"
          :error="
            formState.enq_for_someone &&
            formState.enquiree_name.length >= 3 &&
            checkString(formState.enquiree_name)
              ? false
              : 'Name(Minimum 3 characters)'
          "
        />

        <control
        v-if="dropoutname && route.query.name=='Dropout'"
          v-model="dropoutname"
          :icon-left="mdiAccount"
          help="Student Name"
          placeholder="Student Name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800 padding-space"
          name="input"
        />
        <control
        v-else
          v-model="formState.name"
          :icon-left="mdiAccount"
          help="Student Name"
          placeholder="Student Name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800 padding-space "
          :error="formState.name&&
            formState.name.length >= 3 && checkString(formState.name)
              ? false
              : 'Name(Minimum 3 characters)'
          "
          
        />
        <!-- <control
          v-model="formState.mode"
          :options="mode"
          help="Mode of Enquiry"
          class="box-border w-50 px-1 py-2 border border-gray-800 h-[70px] mb-0 rounded bg-gray-800"
          :error="formState.mode !== null ? false : 'Mode of Enquiry'"
        /> -->

        <field help="Mode of Enquiry" :error="formState.mode !== null ? false : 'Mode of Enquiry'" class="box-border w-50 px-1 py-2 border border-gray-800 last:mb-2 rounded bg-gray-800"> 
          <Multiselect
              v-model="formState.mode"
              :options="mode"
              help="Mode of Enquiry"
              valueProp="id"
              :object="true"
              label="name"
              searchable
              class="text-sm border-gray-400"
              trackBy="name"
              placeholder="Mode of Enquiry"
              :classes="selectClasses"
          />   
        </field>

      </field>
    <!-- {{counselor.student.contact.length}} --{{contact.length}} -->
    <!-- <div v-if="checkvalidate==false && counselor.check_num!=[]">  -->
     
          <span v-for="(num,i) in counselor.check_num.number" :key="i">
            <span v-if="num.exists===true &&checkvalidate==false" class="text-red-500"> {{ num.number}} 
         <span class="text-white">already exists</span>
        </span>
          </span> 
        <!-- </div> -->
      <field grouped class="box-border w-50 p-1">
        <field grouped v-for="(con, i) in contact" :key="i" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">      
          <small class="w-28 h-8" >
            <Multiselect
              v-model="con.code"
              searchable
              valueProp="code"    
              label="code"
              :classes="selectClasses"
              :options="countryCode"
              class="border border-gray-400"
              placeholder="code"
            :disabled="con.readonly"
    
            />
          </small>

          <control   
          v-if="con.code==+91"      
            v-model="con.number"
            :icon-left="mdiPhone"
            help="Mobile"
            placeholder="Mobile"
            class="padding-space"
           :error="con.number &&(con.number.replace(/\s+/g, '').length ==10 )&&
              !isNaN(con.number.replace(/\s+/g, ''))
                ? false
                : 'Mobile(Minimum 10 digits)'
                " 
            :readonly="con.readonly"
            @input="handlechange"
          />
          <!-- :error="-->
          <control
          v-else
            v-model="con.number"
            class="padding-space"
               :error="con.number &&con.number.replace(/\s+/g, '').length &&
              !isNaN(con.number.replace(/\s+/g, ''))
                ? false
                : 'Add valid contact number'
            "
            :icon-left="mdiPhone"
            help="Mobile"
            placeholder="Mobile"
            :readonly="con.readonly"
            @input="handlechange"

          />
        <!-- </span> -->
          <!-- :error="
              con.number &&
              con.number.replace(/\s+/g, '').length >= 10 &&
              !isNaN(con.number.replace(/\s+/g, ''))
                ? false
                : 'Mobile(Minimum 10 digits)'
            " -->
        </field>
       
        <div class="flex gap-2 items-center">
        <jb-button color="teal" :icon="mdiPlusBox" @click="addContact" small class="h-7"/>
        <span v-if=" counselor.student.contact">
          <jb-button
          v-if="counselor.student.contact.length !=contact.length"
          color="danger"
          :icon="mdiMinusBox"
          @click="removeContact"
          class="h-7 bg-red-600 border-red-600 hover:bg-red-500 hover:border-red-500"
          small
        />
        </span>
        <span v-else> 
        <jb-button
          v-if="contact &&contact.length > 1"
          color="danger"
          :icon="mdiMinusBox"
          @click="removeContact"
          class="h-7 bg-red-600 border-red-600 hover:bg-red-500 hover:border-red-500"
          small
        />
        </span>
      </div>
  
      <control 
        class="box-border w-50 p-1 border border-gray-800 mt-1 sm:mt-0 mb-2 rounded bg-gray-800 padding-space"
        v-for="(mail, i) in email" :key="i"
          v-model="mail.email"
          :icon-left="mdiMail"
          help="Email"
          placeholder="Email"
          :max="300"
          :readonly="mail.verify"
          :error="(!/\s/g.test(email[i].email)&&validEmail(email[i].email))? false : 'Email'"
        />
     
        <!-- :error="(email[i].email.length > 0  && validEmail(email[i].email))? false : 'Email'"  -->
        <!--   && validEmail(email[i].email)    -->
        <div class="flex gap-2 items-center">
        <jb-button color="teal" :icon="mdiPlusBox" @click="addEmail" small class="h-7"/>
        <jb-button
          v-if="email &&email.length > 1"
          color="danger"
          :icon="mdiMinusBox"
          @click="removeEmail"
          class="h-7 bg-red-600 border-red-600 hover:bg-red-500 hover:border-red-500"
          small
        />
      </div>
      </field>
      <div class="box-border w-50 p-1 grid lg:grid-cols-4 xl:grid-cols-5 gap-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 2xl:grid-cols-5">
        <!-- <field
          help="Rigid/Flexi Timing"
          :error="
            formState.flexi_timing === true || formState.flexi_timing === false
              ? false
              : true
          "
        >
          <label class="checkbox">
            <input
              v-model="formState.flexi_timing"
              type="radio"
              name="flexi"
              :value="true"
              class="checkbox"
            />
            <span class="control-label">Flexi Timing</span>
          </label>
          <label class="checkbox">
            <input
              v-model="formState.flexi_timing"
              type="radio"
              name="flexi"
              :value="false"
              class="checkbox"
            />
            <span class="check" />
            <span class="control-label">Rigid Timing</span>
          </label>
        </field> -->
        <!-- v-if="formState.flexi_timing === true" -->
        <!-- <control
          v-model="formState.class_timing"
          :options="classtiming"
          help="Class Timing"
          :error="formState.class_timing !== null ? false : true"
        /> -->
        <field help="Class Timing" :error="formState.class_timing !== null ? false : true" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800"> 
          <Multiselect
              v-model="formState.class_timing"
              :options="classtiming"
              help="Class Timing"
              valueProp="id"
              :object="true"
              label="name"
              searchable
              class="text-sm border-gray-400"
              trackBy="name"
              placeholder="Class Timing"
              :classes="selectClasses"
          />   
        </field>
       
        <!-- v-if="formState.flexi_timing === false" -->
        <field
          grouped
          help="Rigid timing (Enter only if student is very specific on timing)"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800"
        >
        <!-- :error="formState.time_slot.length !== 0 ? false : true" -->
          <Multiselect
            v-model="formState.time_slot"
            mode="tags"
            :options="timeslot"
            class="border-gray-400"
            valueProp="id"
            :object="true"
            label="name"
            searchable
            trackBy="name"
            placeholder="Time slots"
            :classes="selectClasses"
          />
        </field>
        
        <field help="Highest Degree" :error="educ.highest_degree !== null ? false : true" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800"> 
          <Multiselect
              v-model="educ.highest_degree"
              :options="highestdegree"
              help="Highest Degree"
              valueProp="id"
              :object="true"
              label="name"
              searchable
              class="text-sm border-gray-400"
              trackBy="name"
              @select="clearallfunction()"
              placeholder="Highest Degree"
              :classes="selectClasses"
          />   
        </field>

        <control
          v-if="!formState.experienced "
          v-model="educ.yop"
          :options="years"
          help="Highest degree pass out Year"
          :error="educ.yop.length !== 0 ? false : true"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800"
        />
        <field v-if="!formState.experienced&& educ.highest_degree && educ.highest_degree.name!='12th/puc'" help="Data not taken" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 last:mb-2">
          <check-radio-picker
            v-model="formState.data_not_taken"
            name="data_not_taken"
            :options="{ true: 'Data not taken' }"
          />
        </field>
      </div>
    <!-- </card-component> -->

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
    <title-sub-bar class="text-amber-50 pb-2" title="Regular Course Enquiries -" />
    <div v-for="(c, i) in course" :key="i" class="box-border w-50 p-1 grid lg:grid-cols-4 gap-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 2xl:grid-cols-5">
      <field grouped help="Course" :error="c.course !== null ? false : 'Course'" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
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
          track-by="name"
          :classes="selectClasses"
          @change="clearbranch(c,i,course)"

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
      <field help="Mode of class" :error="c.course === null || c.mode_class !== null ? false : true" class="box-border w-50 px-1 py-2 border border-gray-800 last:mb-2 rounded bg-gray-800"> 
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
      <!-- <field class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 last:mb-2">
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
      label="Add regular course"
      :icon="mdiPlusBox"
      class="text-sm"
      @click="addCourse(course)"
      small
    />
    <jb-button
      class="ml-2 text-sm bg-red-600 border-red-600 hover:bg-red-500 hover:border-red-500"
      v-if="course.length > 1"
      label="Remove regular course"
      color="danger"
      :icon="mdiMinusBox"
      @click="removeCourse"
      small
    />
  </div>
  
  <div v-if="formState.course_enquiries === 'special'">
    <title-sub-bar class="text-amber-50 pb-2" title="Special Course Enquiries -" />
    <div v-for="(s, i) in scourse" :key="i" class="box-border w-50 p-1 grid xl:grid-cols-4 gap-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 2xl:grid-cols-5">
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
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800"
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
      <field help="Mode of class" :error="((s.name=== null && s.other_course.length===0) || s.mode_class != null) ? false : true" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 last:mb-2">
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
      class="text-sm"
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

  <div v-if="formState.course_enquiries === 'both'">
    <div>
    <title-sub-bar class="text-amber-50 pb-2" title="Regular Course Enquiries -" />
    <div v-for="(c, i) in course" :key="i" class="box-border w-50 p-1 grid xl:grid-cols-4 gap-2 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 2xl:grid-cols-5 md:grid-cols-3">
      <field help="Course" :error="c.course !== null ? false : 'Course'" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
        <Multiselect
          v-model="c.course"
          :options="courses"
          valueProp="name"
          :object="true"
          label="name"
          searchable
          class="text-sm border-gray-400"
          @select="check_author_branch(i)"
          track-by="name"
          :classes="selectClasses"
          @clear="removebranch(i)"
          @click="clearbranch(c,i,course)"

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
          :options="c.actualbranch "
          valueProp="id"
          :object="true"
          label="name"
          class="border-gray-400"
          searchable
          trackBy="name"
          :classes="selectClasses"
        />
      </field>
      <field help="Mode of class" :error="c.course === null || c.mode_class !== null ? false : true" class="box-border w-50 px-1 py-2 border border-gray-800  last:mb-2 rounded bg-gray-800"> 
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
      <!-- <field class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 last:mb-2">
        <control
          :error="
            c.course === null || c.agreed_date.length > 0 ? false : true
          "
          v-model="c.agreed_date"
          type="date"
          class="date_input"
          help="Student coming date (When ever student wants to join us)"
          :minDate="todayDate()"
        />
      </field> -->
    </div>
    <jb-button
      color="teal"
      class="text-sm"
      label="Add regular course"
      :icon="mdiPlusBox"
      @click="addCourse(course)"
      small
    />
    <jb-button
      class="ml-2 text-sm bg-red-600 border-red-600 hover:bg-red-500 hover:border-red-500"
      v-if="course.length > 1"
      label="Remove regular course"
      color="danger"
      :icon="mdiMinusBox"
      @click="removeCourse"
      small
    />
    </div>
  
    <div>
      <title-sub-bar class="text-amber-50 pb-2 mt-3" title="Special Course Enquiries -" />
      <div v-for="(s, i) in scourse" :key="i" class="box-border w-50 p-1 grid xl:grid-cols-4 gap-2 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 2xl:grid-cols-5 md:grid-cols-3">
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
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800"
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
        <field help="Mode of class" :error="((s.name=== null && s.other_course.length===0) || s.mode_class != null) ? false : true" class="box-border w-50 px-1 py-2 border border-gray-800 last:mb-2 rounded bg-gray-800">
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
        class="text-sm"
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

    <title-sub-bar v-if="showDiplomaEducation" title="Education - Diploma Details" class="bg-zinc-900 border-b border-white sm:px-2 pl-2 pr-2 mt-4 mb-3" />
    <div v-if="showDiplomaEducation">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 2xl:grid-cols-5">
        <field v-if="educ.other_stream===false" :error="educ.stream_object != null ? false : true"  grouped help="Search stream" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
        <!-- :error="educ.stream_object!=null ? false : true" -->
          <Multiselect
            v-model="educ.stream_object"
            :object="true"          
            valueProp="id"
            label="name"
            trackBy="concatname"
            :filter-results="false"
            :min-chars="2"
            :resolve-on-load="false"
            :delay="0"
            :searchable="true"
            class="border-gray-400"
            placeholder="Diploma Stream"
            :classes="selectClasses"
            :options="
              async function (query) {
                return await fetchStream(query, educ.highest_degree.id);
              }
            "
          />
        </field>
        <field help="Click here if stream is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="educ.other_stream"
            name="other_stream"
            :options="{ true: 'Other Stream' }"
            @input="changingdiplomastream"
          />
        </field>
        <control v-if="educ.other_stream===true"
          v-model="educ.otherstream"
          help="Stream Name"
          placeholder="Stream Name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800"
          :error="
            educ.otherstream.length >= 3 && checkString(educ.otherstream)
              ? false
              : 'Stream Name(Minimum 3 characters)'
          "
        />
        <field v-if="educ.other_college===false" grouped help="Search College" :error="educ.college_object != null ? false : true"  class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
        <!-- :error="educ.college_object!=null ? false : true" -->
          <Multiselect
          
            v-model="educ.college_object"
            :object="true"          
            valueProp="id"
            label="name"
            trackBy="concatname"
            :filter-results="false"
            :min-chars="2"
            :resolve-on-load="false"
            :delay="0"
            placeholder="Diploma College"
            class="border-gray-400"
            :searchable="true"
            :classes="selectClasses"
            :options="
              async function (query) {
                return await fetchCollege(query, educ.highest_degree.id);
              }
            "
          />
        </field>
        <field help="Click here if college is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="educ.other_college"
            name="other_college"
            @input="changingdiplomacollege"
            :options="{ true: 'Other College' }"
          />
        </field>
        <control v-if="educ.other_college===true"
          v-model="educ.othercollege"
          help="College Name"
          placeholder="College Name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800"
          :error="
            educ.othercollege.length >= 3 && checkString(educ.othercollege)
              ? false
              : 'College Name(Minimum 3 characters)'
          "
        />
        <field
        grouped
          :error="educ.percentage !== null ? false : true"
          help="Select percentage"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 last:mb-2"
        >
          <label class="checkbox">
            <input
              v-model="educ.percentage"
              type="radio"
              name="diperc"
              :value="true"
              class="checkbox"
             
            />
            <span class="control-label mr-2 md:mr-0 xl:mr-2">60% or Greater than 60%</span>
          </label>
          <label class="checkbox">
            <input
              v-model="educ.percentage"
              type="radio"
              name="diperc"
              :value="false"
              class="checkbox"
            
            />
            <span class="check" />
            <span class="control-label">Less than 60%</span>
          </label>
        </field>
      </div>
    </div>
    <title-sub-bar v-if="showItiEducation" title="Education - ITI Details" class="bg-zinc-900 border-b border-white sm:px-2 mt-4 mb-3 pl-2 pr-2" />
    <div v-if="showItiEducation">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 2xl:grid-cols-5">
        <field v-if="educ.other_stream===false" grouped help="Search stream" :error="educ.stream_object != null ? false : true" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <!--  :error="educ.stream_object!=null ? false : true" help="Search stream" -->
          <Multiselect
   
            v-model="educ.stream_object"
            :object="true"          
            valueProp="id"
            label="name"
            trackBy="concatname"
            class="border-gray-400"
            :filter-results="false"
            :min-chars="2"
            placeholder="ITI Stream"
            :resolve-on-load="false"
            :delay="0"
            :searchable="true"
            :classes="selectClasses"
            :options="
              async function (query) {
                return await fetchStream(query, educ.highest_degree.id);
              }
            "
          />
        </field>
        <field help="Click here if stream is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="educ.other_stream"
            name="other_stream"
            @input="changingitistream"
            :options="{ true: 'Other Stream' }"
          />
        </field>
        <control v-if="educ.other_stream===true"
          v-model="educ.otherstream"
          help="Stream Name"
          placeholder="Stream Name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800"
          :error="
            educ.otherstream.length >= 3 && checkString(educ.otherstream)
              ? false
              : 'Stream Name(Minimum 3 characters)'
          "
        />
        <field v-if="educ.other_college===false" grouped help="Search College" :error="educ.college_object != null ? false : true" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <!-- :error="educ.college_object!=null ? false : true" help="Search College" -->
          <Multiselect
            
            v-model="educ.college_object"
            :object="true"          
            valueProp="id"
            label="name"
            trackBy="concatname"
            class="border-gray-400"
            :filter-results="false"
            :min-chars="2"
            placeholder="ITI College"
            :resolve-on-load="false"
            :delay="0"
            :searchable="true"
            :classes="selectClasses"
            :options="
              async function (query) {
                return await fetchCollege(query, educ.highest_degree.id);
              }
            "
          />
        </field>
        <field help="Click here if college is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="educ.other_college"
            name="other_college"
            @input="changingiticollege"
            :options="{ true: 'Other College' }"
          />
        </field>
        <control v-if="educ.other_college===true"
          v-model="educ.othercollege"
          help="College Name"
          placeholder="College Name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800"
          :error="
            educ.othercollege.length >= 3 && checkString(educ.othercollege)
              ? false
              : 'College Name(Minimum 3 characters)'
          "
        />
         <!-- :error="showItiEducation ? true : false"
          help="Select percentage" -->
        <field grouped
        :error="educ.percentage != null ? false : true"
          help="Select percentage"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 last:mb-2"
        >
          <label class="checkbox">
            <input
              v-model="educ.percentage"
              type="radio"
              name="itierc"
              :value="true"
              class="checkbox"
              
            />
            <span class="control-label mr-2 md:mr-0 xl:mr-2">60% or Greater than 60%</span>
          </label>
          <label class="checkbox">
            <input
              v-model="educ.percentage"
              type="radio"
              name="itierc"
              :value="false"
              class="checkbox"
            />
            <span class="check" />
            <span class="control-label">Less than 60%</span>
          </label>
        </field>
      </div>
    </div>
    <title-sub-bar v-if="showDegreeEducation" title="Education - Degree Details" class="bg-zinc-900 border-b border-white sm:px-2 mt-4 mb-3 pl-2 pr-2" />
    <div v-if="showDegreeEducation">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 2xl:grid-cols-5">
        <field v-if="educ.other_degree===false" grouped
          :error="educ.name!=null ? false : true"
          help="Select degree name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800"
        >
          <Multiselect
            v-model="educ.name"
            :options="degree"
            valueProp="id"
            :object="true"
            placeholder="Degree Name"
            label="concatname"
            class="border-gray-400"
            searchable
            trackBy="concatname"
            :classes="selectClasses"
            @select="fetchDegreeStream"
          />
        </field>
         <field help="Click here if degree is not listed here." class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="educ.other_degree"
            name="other_degree"
            @input="changingdegreename"
            :options="{ true: 'Other Degree' }"
          />
        </field>
        <control v-if="educ.other_degree===true"
          v-model="educ.otherdegree"
          help="Degree Name"
          placeholder="Degree Name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800"
          :error="
            educ.otherdegree.length >= 3 && checkString(educ.otherdegree)
              ? false
              : 'Degree Name(Minimum 3 characters)'
          "
        />
        <field :error="educ.stream_object!=null ? false : true" v-if="educ.other_stream===false" grouped help="Search stream" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <!--  :error="educ.stream_object!=null ? false : true" help="Search stream" -->
          <Multiselect
            v-model="educ.stream_object"
            :options="degreeStreams"
            valueProp="id"
            :object="true"
            label="concatname"
            placeholder="Degree Stream"
            class="border-gray-400"
            searchable
            trackBy="concatname"
            :classes="selectClasses"
          />
        </field>
        <field v-if="show_degreetype===false" help="Click here if stream is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="educ.other_stream"
            name="other_stream"
            @input="changingdegreestream"
            :options="{ true: 'Other Stream' }"
          />
        </field>
        <control v-if="educ.other_stream===true"
          v-model="educ.otherstream"
          help="Stream Name"
          placeholder="Stream Name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800"
          :error="
            educ.otherstream.length >= 3 && checkString(educ.otherstream)
              ? false
              : 'Stream Name(Minimum 3 characters)'
          "
        />
        <field
        v-if="educ.other_college===false"
        :error="educ.college_object!=null ? false : true"
           grouped
          help="Search College"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800"
        >
        <!-- :error="educ.college_object!=null ? false : true" -->
          <Multiselect
            v-model="educ.college_object"
            :object="true"          
            valueProp="id"
            label="name"
            trackBy="concatname"
            class="border-gray-400"
            :filter-results="false"
            :min-chars="2"
            :resolve-on-load="false"
            :delay="0"
            placeholder="Degree College"
            :searchable="true"
            :classes="selectClasses"
            :options="
              async function (query) {
                return await fetchCollege(query, educ.highest_degree.id);
              }
            "
          />
        </field>
        <field help="Click here if college is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="educ.other_college"
            name="other_college"
            @input="changingdegreecollege"
            :options="{ true: 'Other College' }"
          />
        </field>
        <control v-if="educ.other_college===true"
          v-model="educ.othercollege"
          help="College Name"
          placeholder="College Name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800"
          :error="
            educ.othercollege.length >= 3 && checkString(educ.othercollege)
              ? false
              : 'College Name(Minimum 3 characters)'
          "
        />
        <field
       grouped
        :error="educ.percentage !== null ? false : true"
          help="Select percentage"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 last:mb-2"
        >
          <label class="checkbox">
            <input
              v-model="educ.percentage"
              type="radio"
              name="dperc"
              :value="true"
              class="checkbox"
            />
            <span class="control-label mr-2 md:mr-0 xl:mr-2">60% or Greater than 60%</span>
          </label>
          <label class="checkbox">
            <input
              v-model="educ.percentage"
              type="radio"
              name="dperc"
              :value="false"
              class="checkbox"
            />
            <span class="check" />
            <span class="control-label">Less than 60%</span>
          </label>
        </field>
      </div>
    </div>
    <title-sub-bar v-if="showMastersEducation" title="Education - Masters Details"  class="bg-zinc-900 border-b border-white sm:px-2 mt-4 mb-3 pl-2 pr-2" />
    <div v-if="showMastersEducation">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 2xl:grid-cols-5">
        <field grouped v-if="educ.other_degree===false"
           :error="educ.name!=null ? false : true"
          help="Select masters name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800"
        >
          <Multiselect
            v-model="educ.name"
            :options="masters"
            valueProp="id"
            :object="true"
            label="concatname"
            placeholder="Masters Name"
            class="border-gray-400"
            searchable
            trackBy="concatname"
            :classes="selectClasses"
            @select="fetchDegreeStream"
          />
        </field>
        <field help="Click here if Masters is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="educ.other_degree"
            name="other_degree"
            @input="changingmastersname"
            :options="{ true: 'Other Masters' }"
          />
        </field>
         <control v-if="educ.other_degree===true"
          v-model="educ.otherdegree"
          help="Master's Name"
          placeholder="Master's Name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800"
          :error="
            educ.otherdegree.length >= 3 && checkString(educ.otherdegree)
              ? false
              : 'Masters Name(Minimum 3 characters)'
          "
        />
        <field v-if="educ.other_stream===false"
           grouped
           :error="educ.stream_object!=null ? false : true"
          help="Search stream"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800"
        >
        <!-- :error="educ.stream_object!=null ? false : true" -->
        
          <Multiselect
            v-model="educ.stream_object"
            :options="degreeStreams"
            valueProp="id"
            :object="true"
            label="concatname"
            placeholder="Masters Stream"
            class="border-gray-400"
            searchable
            trackBy="concatname"
            :classes="selectClasses"
          />
        </field>
        <field v-if="show_mastertype===false" help="Click here if stream is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="educ.other_stream"
            name="other_stream"
            @input="changingmastersstream"
            :options="{ true: 'Other Stream' }"
          />
        </field>
        <control v-if="educ.other_stream===true"
          v-model="educ.otherstream"
          help="Stream Name"
          placeholder="Stream Name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800"
          :error="
            educ.otherstream.length >= 3 && checkString(educ.otherstream)
              ? false
              : 'Stream Name(Minimum 3 characters)'
          "
        />
        <field v-if="educ.other_college===false"
        :error="educ.college_object!=null ? false : true"
           grouped
          help="Search College"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800"
        >
        <!-- :error="educ.college_object!=null ? false : true" -->
          <Multiselect
            v-model="educ.college_object"
            :object="true"          
            valueProp="id"
            label="name"
            trackBy="concatname"
            placeholder="Masters College"
            class="border-gray-400"
            :filter-results="false"
            :min-chars="2"
            :resolve-on-load="false"
            :delay="0"
            :searchable="true"
            :classes="selectClasses"
            :options="
              async function (query) {
                return await fetchCollege(query, educ.highest_degree.id);
              }
            "
          />
        </field>
        <field help="Click here if college is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <check-radio-picker
            v-model="educ.other_college"
            name="other_college"
            @input="changingmasterscollege"
            :options="{ true: 'Other College' }"
          />
        </field>
        <control v-if="educ.other_college===true"
          v-model="educ.othercollege"
          help="College Name"
          placeholder="College Name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-2 rounded bg-gray-800"
          :error="
            educ.othercollege.length >= 3 && checkString(educ.othercollege)
              ? false
              : 'College Name(Minimum 3 characters)'
          "
        />
        <field
        grouped
         :error="educ.percentage !== null ? false : true"
          help="Select percentage"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 last:mb-2"
        >
          <label class="checkbox">
            <input
              v-model="educ.percentage"
              type="radio"
              name="mperc"
              :value="true"
              class="checkbox"
            />
            <span class="control-label mr-2 md:mr-0 xl:mr-2">60% or Greater than 60%</span>
          </label>
          <label class="checkbox">
            <input
              v-model="educ.percentage"
              type="radio"
              name="mperc"
              :value="false"
              class="checkbox"
            />
            <span class="check" />
            <span class="control-label">Less than 60%</span>
          </label>
        </field>
      </div>
    </div>
    <title-sub-bar title="Referrals" class="bg-zinc-900 border-b border-white sm:px-2 pl-2 pr-2 mt-4 mb-3"/>
    <!-- <card-component> -->
      <field v-for="(refe, i) in refer" :key="i" grouped>
        <control
          v-model="refe.referee_name"
          :icon-left="mdiAccount"
          help="Name"
          placeholder="Name"
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 padding-space"
          :error="
            refe.referee_number.length > 0 && refe.referee_name.length === 0
              ? true
              : false
          "
        />
        <field grouped class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
        <small class="w-28 h-8">
          <Multiselect
            v-model="refe.referee_code"
            searchable
            valueProp="code"
            label="code"
            :classes="selectClasses"
            :options="countryCode"
            class="border border-gray-400"
            placeholder="code"
          />
        </small>

        <control   
          v-if="refe.referee_code==+91"      
            v-model="refe.referee_number"
            :error="refe.referee_number.length==0 ||(refe.referee_number.replace(/\s+/g, '').length ==10 )&&
              !isNaN(refe.referee_number.replace(/\s+/g, ''))
                ? false
                : 'Mobile(Minimum 10 digits)'
            "
            :icon-left="mdiPhone"
            class="padding-space"
            help="Mobile"
            placeholder="Mobile"
          />
          <control
          v-else
            v-model="refe.referee_number"
            :error="refe.referee_number &&refe.referee_number.replace(/\s+/g, '').length &&
              !isNaN(refe.referee_number.replace(/\s+/g, ''))
                ? false
                : 'Add valid contact number'
            "
            :icon-left="mdiPhone"
            class="padding-space"
            help="Mobile"
            placeholder="Mobile"
          />
      </field>
       <!-- <control
          v-model="refe.referee_number"
          :icon-left="mdiPhone"
          help="Mobile"
          :error="
            (refe.referee_name.length > 0 && refe.referee_number.length < 10) ||
            isNaN(refe.referee_number)
              ? 'Mobile not valid'
              : false
          "
          placeholder="Mobile"
        /> -->
    </field>
      <jb-button
      class="text-sm"
        color="teal"
        label="Add referral"
        :icon="mdiPlusBox"
        @click="addRefer"
        small
      />
      <jb-button
        class="ml-2 bg-red-600 border-red-600 hover:bg-red-500 hover:border-red-500 text-sm"
        v-if="refer.length > 1"
        label="Remove referral"
        color="danger"
        :icon="mdiMinusBox"
        @click="removeRefer"
        small
      />

      <div class="grid lg:grid-cols-4 grid-cols-1 sm:grid-cols-2 mt-2">
    <field
      label="Comments"
    >
      <control
        v-model="formState.comment"
        type="textarea"
        placeholder="Comments"
        class="w-full"
      />
    </field>
    </div>
    <!-- </card-component>  && (counselor.student.contact.length!=contact.length)-->

    <field class="mt-4"  v-if="counselor.student.contact &&(counselor.student.contact.length!=contact.length) && checkvalidate==false">
      <jb-button label="checknumber" @click="checknumber" type="submit" color="info" class="pt-1 pb-1 font-medium text-lg"/>
    </field>
    <field class="mt-4"  v-else-if="contact.length>1 && route.query.rid && checkvalidate==false">
      <jb-button label="checknumber" @click="checknumber" type="submit" color="info" class="pt-1 pb-1 font-medium text-lg"/>
    </field>
    <field class="mt-4" v-else>
      <jb-button label="Submit" @click="submit" type="submit" color="info" class="pt-1 pb-1 font-medium text-lg"/>
    </field>

  </card-component>
</template>
<style >
input {
  color-scheme: dark;

}

.padding-space input {
    padding-left: 40px !important;
}

input[name=input]{
  pointer-events: none;
}
</style>

