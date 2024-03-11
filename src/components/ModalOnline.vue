<script setup>
import { computed, reactive, ref } from "vue";
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
import dayjs from "dayjs";
import { sessionStore } from "../stores/session";
import Multiselect from "@vueform/multiselect";
import { selectClasses } from "../selectcss";

const user = sessionStore();

const counselor = counselorStore();
const theme = themeStore();

const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  sid: {
    type: Number,
    default: 0,
  },
  id: {
    type: Number,
  },
  courses: {
    type: Array,
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

const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const confirmCancel = (mode) => {
  value.value = false;
  emit(mode);
};

const itemsCourses = computed(() => {
  const getCourses = []
  if(props.courses){
    props.courses.forEach(crs =>{
      if(crs.mode_class.id === 1 && crs.author.id === user.user.uid) {
        getCourses.push(crs.course)
      }
    })
    return getCourses
  }
});

const formState = reactive({
  id:props.id,
  cid: "",
 // agreed_date: "",
});

const todayDate = () => {
  return dayjs().format("YYYY-MM-DD");
};

const confirm = async () => {
  let valid = true;
  let formValues = JSON.parse(JSON.stringify(formState));
  for (const key in formValues) {
    if (key === "cid" && formValues[key].length === 0) {
      valid = false;
      theme.pushMessage("Course is required!");
    }
    // if (key === "agreed_date" && formValues[key].length === 0) {
    //   valid = false;
    //   theme.pushMessage("Agree date is required!");
    // }
    // if (key === "agreed_date" && formValues[key].length !== null) {
    //   const today = dayjs(new Date());
    //   const ag = dayjs(formValues[key]);
    //   if (ag.isBefore(today)) {
    //     valid = false;
    //     theme.pushMessage("Agreed date should be greater than today!");
    //   }
    // }
  }
  if (valid) {
    // formValues.id = props.id;
    // formValues.sid = props.sid;
    let response = await counselor.submitOnline(formValues);
    confirmCancel("confirm");
  } else {
    theme.pushMessage("Form Error, please fill out mandatory fields");
  }
};

const cancel = () => confirmCancel("cancel");
</script>

<template>
  <overlay v-show="value" @overlay-click="cancel">
    <card-component
      v-show="value"
      :title="title"
      class="shadow-lg w-full max-h-modal md:w-3/5 z-50"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
      <div class="pl-4 space-y-3">
        <div class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-2 mb-2">
            <Multiselect 
              v-model="formState.cid" 
              :options="itemsCourses" 
              valueProp="name" 
              placeholder="Select Course" 
              label="name" 
              searchable 
              trackBy="name" 
              :classes="selectClasses" 
              class="h-9 border-gray-500"
            />
          <!-- <field>
            <control
              :error="formState.agreed_date.length > 0 ? false : true"
              v-model="formState.agreed_date"
              type="date"
              help="Agreed date"
              :minDate="todayDate()"
            />
          </field> -->
        </div>
      </div>

      <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button :label="buttonLabel" :color="button" @click="confirm" 
            class="pt-1 pb-1"/>
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
