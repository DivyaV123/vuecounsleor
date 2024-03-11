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
const counselor = counselorStore();
const theme = themeStore();

onBeforeMount(async () => {
  await counselor.getCallStatus();
});

const callStatus = computed(() => {
  if(counselor.dropComments && counselor.dropComments.items){
      return counselor.dropComments.items
  } 
}
);

const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  commentdata: {
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

const formState = reactive({
  id: props.id,
  comment: "",
  type:props.commentdata,
  role:"counselor"
});

const confirm = async () => {
  let valid = true;
  let formValues = JSON.parse(JSON.stringify(formState));
  for (const key in formValues) {
    if (key === "comment" && formValues[key] === "") {
      valid = false;
      theme.pushMessage("comment is required!");
    }
  }
  if (valid) {
    let response = await counselor.add_comment(formValues);
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
      class="shadow-lg w-full max-h-modal md:w-3/5 z-50 overflow-y-scroll"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
      <div class="pl-4 space-y-3">
        <card-component>
          <!-- <field>
            <control
              v-model="formState.dropdown"
              :options="callStatus"
              help="Status"
              :error="formState.status !== null ? false : 'Status'"
            />
          </field> -->
          <field label="Comments" class="mr-2">
            <control
              v-model="formState.comment"
              type="textarea"
              placeholder="Comments"
              class="w-full "
            />
          </field>
        </card-component>
      </div>

      <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button :label="buttonLabel" :color="button" @click="confirm" />
            <jb-button
              v-if="hasCancel"
              label="Cancel"
              :color="button"
              outline
              @click="cancel"
            />
          </jb-buttons>

          <text-link :label="textLinkLabel" :icon="textLinkIcon" />
        </level>
      </template>
    </card-component>
  </overlay>
</template>
