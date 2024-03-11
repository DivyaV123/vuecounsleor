<script setup>
import { computed, reactive, onBeforeMount,ref } from "vue";
import { mdiClose } from "@mdi/js";
import JbButton from "@/components/JbButton.vue";
import JbButtons from "@/components/JbButtons.vue";
import CardComponent from "@/components/CardComponent.vue";
import Level from "@/components/Level.vue";
import TextLink from "@/components/TextLink.vue";
import Overlay from "@/components/Overlay.vue";
import { selectClasses } from "../selectcss";
import Field from "@/components/Field.vue";
import TitleSubBar from "@/components/TitleSubBar.vue";
import CheckRadioPicker from "@/components/CheckRadioPicker.vue";
import { counselorStore } from "../stores/counselor";
import Multiselect from "@vueform/multiselect";
import Control from "@/components/Control.vue";
import { themeStore } from "../stores/theme";
import { sessionStore } from "../stores/session";

const counselor = counselorStore();
const theme = themeStore();
const user = sessionStore();

onBeforeMount(async () => {
  await counselor.getHighestDegree();
  await counselor.getDegree();
  // await counselor.getStreams();
  // await counselor.getColleges();
});
const checkString = (text) => {
  var letters = /^[a-zA-Z\s]*$/;
  if (text.match(letters)) {
    return true;
  } else {
    return false;
  }
};

const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  id: {
    type: Number,
  },
  highest_degree: {
    type: Object,
  },
  yop: {
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

const highestdegree = computed(() => counselor.highestdegree.items);

const degree = computed(() => {
  let DegreeItems = [];
  counselor.degree.items.filter(deg =>{
    if(deg.details.qualification_type && deg.details.qualification_type.name === 'degree'){
      DegreeItems.push({id:deg.id,concatname:deg.name+"-"+deg.details.shortname,name:deg.name,shortname:deg.details.shortname})
    }
  })
  return DegreeItems;
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

const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const confirmCancel = (mode) => {
  value.value = false;
  emit(mode);
};

const educ = reactive({
  highest_degree: props.highest_degree,
  yop: props.yop,
  name: null,
  percentage: null,
  stream_object: null,
  college_object: null,
});

const formState = reactive({
  id: props.id,
  // enquiry:{
  //   highest_degree:props.highest_degree,
  // },
  
  // diploma: dip,
  // degree: deg,
  // masters: mast
  education: educ,
});

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

const confirm = async () => {
  formState.education = educ;
  let valid = true;
  let formValues = JSON.parse(JSON.stringify(formState));
  for (const key in formValues) {
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
      (!formValues[key]["otherstream"].replace(/\s/g, '').length&&formValues[key]["other_stream"]===true)
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
      (!formValues[key]["othercollege"].replace(/\s/g, '').length&&formValues[key]["other_college"]===true)
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
      (!formValues[key]["otherstream"].replace(/\s/g, '').length&&formValues[key]["other_stream"]===true)
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
      (!formValues[key]["othercollege"].replace(/\s/g, '').length&&formValues[key]["other_college"]===true)
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
      (formValues[key]["percentage"] === null)
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
      formValues[key]["highest_degree"]["name"] === "masters" &&
      (
        formValues[key]["percentage"] === null)
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
      (!formValues[key]["otherdegree"].replace(/\s/g, '').length&&formValues[key]["other_degree"]===true)
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
      (!formValues[key]["otherstream"].replace(/\s/g, '').length&&formValues[key]["other_stream"]===true)
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
      (!formValues[key]["othercollege"].replace(/\s/g, '').length&&formValues[key]["other_college"]===true)
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
      (!formValues[key]["otherdegree"].replace(/\s/g, '').length&&formValues[key]["other_degree"]===true)
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
      (!formValues[key]["otherstream"].replace(/\s/g, '').length&&formValues[key]["other_stream"]===true)
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
      (!formValues[key]["othercollege"].replace(/\s/g, '').length&&formValues[key]["other_college"]===true)
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
     
  }
   if(valid){
    if (formValues.education && formValues.education.highest_degree) {
      formValues.education.highest_degree = { id:formValues.education.highest_degree.id, name:formValues.education.highest_degree.name }
      // , shortname:formValues.education.highest_degree.details.shortname
    }

    if (formValues.education && formValues.education.name) {
      formValues.education.name = { id:formValues.education.name.id, name:formValues.education.name.name, shortname:formValues.education.name.shortname }
    }

    if (formValues.education && formValues.education.stream_object) {
      formValues.education.stream_object = { id:formValues.education.stream_object.id, name:formValues.education.stream_object.name, shortname:formValues.education.stream_object.shortname }
    }

    if (formValues.education && formValues.education.college_object) {
      formValues.education.college_object = { id:formValues.education.college_object.id, name:formValues.education.college_object.name, shortname:formValues.education.college_object.shortname }
    }

    // let formSubmit = {
    //   id: props.id,
    //   education: formValues
    // }
    
    await counselor.submitAcademic(formValues);
    confirmCancel("confirm");
    }
    else{
    theme.pushMessage("Form Error, please fill out mandatory fields")
    }
};

const cancel = () => confirmCancel("cancel");
</script>

<template>
  <overlay v-show="value" @overlay-click="cancel">
    <card-component
      v-show="value"
      :title="title"
      class="shadow-lg w-full max-h-modal md:w-full z-50 lg:w-[90%] xl:w-[71%] 2xl:w-[70%] overflow-y-auto"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
      <div class="pl-4 space-y-3 mt-2 mb-2">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <field grouped help="Highest Degree" :error="educ.highest_degree !== null ? false : true" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <!-- <control
            v-model="educ.highest_degree"
            :options="highestdegree"
            help="Highest Degree"
            :error="educ.highest_degree !== null ? false : true"
          /> -->

          <Multiselect
            v-model="educ.highest_degree"
            :object="true"          
            valueProp="id"
            help="Highest Degree"
            placeholder="Highest Degree"
            label="name"
            trackBy="name"
            :filter-results="false"
            :min-chars="2"
            :resolve-on-load="false"
            :delay="0"
            :searchable="true"
            class="text-sm border-gray-400"
            :classes="selectClasses"
            :options="highestdegree"
            />
        </field>
      </div>
    <title-sub-bar v-if="showDiplomaEducation" title="Education - Diploma Details" class="bg-zinc-900 border-b border-white sm:px-2 pl-2 pr-2 mt-4 mb-3" />
    <div v-if="showDiplomaEducation">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3">
        <field v-if="educ.other_stream===false" :error="educ.stream_object != null ? false : true" grouped help="Search stream" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
        <!-- :error="educ.stream_object!=null ? false : true" -->
          <Multiselect
            v-model="educ.stream_object"
            :object="true"          
            valueProp="id"
            label="name"
            trackBy="concatname"
            placeholder="Diploma Stream"
            :filter-results="false"
            :min-chars="2"
            :resolve-on-load="false"
            :delay="0"
            :searchable="true"
            class="border-gray-400"
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
          class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800 mb-2"
          :error="
            educ.otherstream.length >= 3 && checkString(educ.otherstream)
              ? false
              : 'Stream Name(Minimum 3 characters)'
          "
        />
        <field v-if="educ.other_college===false"  :error="educ.college_object != null ? false : true" grouped help="Search College" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
        <!-- :error="educ.college_object!=null ? false : true" -->
          <Multiselect
            v-model="educ.college_object"
            :object="true"          
            valueProp="id"
            label="name"
            trackBy="concatname"
            placeholder="Diploma College"
            :filter-results="false"
            :min-chars="2"
            :resolve-on-load="false"
            :delay="0"
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
        <field help="Click here if college is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800  mb-0 rounded bg-gray-800">
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
          class="box-border w-50 px-1 py-2 border border-gray-800  mb-2 rounded bg-gray-800"
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
        <div class="2xl:flex 2xl:gap-2 block">
          <label class="checkbox">
            <input
              v-model="educ.percentage"
              type="radio"
              name="diperc"
              :value="true"
              class="checkbox"
             
            />
            <span class="control-label mr-2 md:mr-0 lg:mr-2 2xl:mr-0">60% or Greater than 60%</span>
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
        </div>
        </field>
      </div>
    </div>
    <title-sub-bar v-if="showItiEducation" title="Education - ITI Details" class="bg-zinc-900 border-b border-white sm:px-2 mt-4 mb-3 pl-2 pr-2" />
    <div v-if="showItiEducation">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3">
        <field v-if="educ.other_stream===false" :error="educ.stream_object != null ? false : true" grouped help="Search stream" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <!--  :error="educ.stream_object!=null ? false : true" help="Search stream" -->
          <Multiselect
            v-model="educ.stream_object"
            :object="true"          
            valueProp="id"
            label="name"
            placeholder="ITI Stream"
            trackBy="concatname"
            class="border-gray-400"
            :filter-results="false"
            :min-chars="2"
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
         <field help="Click here if stream is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800  mb-0 rounded bg-gray-800">
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
          class="box-border w-50 px-1 py-2 border border-gray-800  mb-2 rounded bg-gray-800"
          :error="
            educ.otherstream.length >= 3 && checkString(educ.otherstream)
              ? false
              : 'Stream Name(Minimum 3 characters)'
          "
        />
        <field v-if="educ.other_college===false" :error="educ.college_object != null ? false : true" grouped help="Search College" class="box-border w-50 px-1 py-2 border border-gray-800 mb-0 rounded bg-gray-800">
          <!-- :error="educ.college_object!=null ? false : true" help="Search College" -->
          <Multiselect
            v-model="educ.college_object"
            :object="true"          
            valueProp="id"
            label="name"
            trackBy="concatname"
            placeholder="ITI College"
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
         <field help="Click here if college is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800  mb-0 rounded bg-gray-800">
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
          class="box-border w-50 px-1 py-2 border border-gray-800  mb-2 rounded bg-gray-800"
          :error="
            educ.othercollege.length >= 3 && checkString(educ.othercollege)
              ? false
              : 'College Name(Minimum 3 characters)'
          "
        />
         <!-- :error="showItiEducation ? true : false"
          help="Select percentage" -->
        <field
        grouped
        :error="educ.percentage != null ? false : true"
          help="Select percentage"
          class="box-border w-50 px-1 py-2 border border-gray-800 last:mb-2 rounded bg-gray-800"
        >
        <div class="2xl:flex 2xl:gap-2 block">
          <label class="checkbox">
            <input
              v-model="educ.percentage"
              type="radio"
              name="itierc"
              :value="true"
              class="checkbox"
              
            />
            <span class="control-label mr-2 md:mr-0 lg:mr-2 2xl:mr-0">60% or Greater than 60%</span>
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
          </div>
        </field>
      </div>
    </div>
    <title-sub-bar v-if="showDegreeEducation" title="Education - Degree Details" class="bg-zinc-900 border-b border-white sm:px-2 mt-4 mb-3 pl-2 pr-2" />
    <div v-if="showDegreeEducation">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-4">
        <field v-if="educ.other_degree===false"  grouped
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
         <field help="Click here if degree is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800  mb-0 rounded bg-gray-800">
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
          class="box-border w-50 px-1 py-2 border border-gray-800  mb-2 rounded bg-gray-800"
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
        <field v-if="show_degreetype===false"  help="Click here if stream is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800  mb-0 rounded bg-gray-800">
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
          class="box-border w-50 px-1 py-2 border border-gray-800  mb-2 rounded bg-gray-800"
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
            placeholder="Degree College"
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
        <field help="Click here if college is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800  mb-0 rounded bg-gray-800">
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
          class="box-border w-50 px-1 py-2 border border-gray-800  mb-0 rounded bg-gray-800"
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
          class="box-border w-50 px-1 py-2 border border-gray-800 last:mb-2 rounded bg-gray-800"
        >
          <label class="checkbox">
            <input
              v-model="educ.percentage"
              type="radio"
              name="dperc"
              :value="true"
              class="checkbox"
            />
            <span class="control-label mr-2 md:mr-0">60% or Greater than 60%</span>
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
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-4">
        <field v-if="educ.other_degree===false" grouped
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
        <field help="Click here if Masters is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800  mb-0 rounded bg-gray-800">
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
          class="box-border w-50 px-1 py-2 border border-gray-800  mb-2 rounded bg-gray-800"
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
        <field v-if="show_mastertype===false" help="Click here if stream is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800  mb-0 rounded bg-gray-800">
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
          class="box-border w-50 px-1 py-2 border border-gray-800  mb-2 rounded bg-gray-800"
          :error="
            educ.otherstream.length >= 3 && checkString(educ.otherstream)
              ? false
              : 'Stream Name(Minimum 3 characters)'
          "
        />
        <field v-if="educ.other_college===false" :error="educ.college_object!=null ? false : true"
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
        <field help="Click here if college is not listed here" class="box-border w-50 px-1 py-2 border border-gray-800  mb-0 rounded bg-gray-800">
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
          class="box-border w-50 px-1 py-2 border border-gray-800  mb-2 rounded bg-gray-800"
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
          class="box-border w-50 px-1 py-2 border border-gray-800 last:mb-2 rounded bg-gray-800"
        >
          <label class="checkbox">
            <input
              v-model="educ.percentage"
              type="radio"
              name="mperc"
              :value="true"
              class="checkbox"
            />
            <span class="control-label mr-2 md:mr-0">60% or Greater than 60%</span>
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
.checkbox{
  margin-left: 0 !important;
}
</style>