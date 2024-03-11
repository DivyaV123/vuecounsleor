<script setup>
import { computed, reactive, ref  } from 'vue'
import { mdiClose, mdiPlusBox, mdiMinusBox, mdiPhone } from '@mdi/js'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import CardComponent from '@/components/CardComponent.vue'
import Level from '@/components/Level.vue'
import TextLink from '@/components/TextLink.vue'
import Overlay from '@/components/Overlay.vue'
import Field from "@/components/Field.vue";
import TitleSubBar from "@/components/TitleSubBar.vue";
import { counselorStore } from "../stores/counselor";
import Control from "@/components/Control.vue";
import { themeStore } from "../stores/theme";
import Multiselect from "@vueform/multiselect";
import { selectClasses } from "../selectcss";

const counselor = counselorStore();
const theme = themeStore();


const props = defineProps({
  title: {
    type: String,
    default: null
  },
  id: {
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

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}
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
  {"code":"+47"},
  {"code":"+46"},
  {"code":"+49"},]

const contact = ref([{ number: "", code: countryCode[0].code, readonly: false }]);

const addContact = () => {
  contact.value.push({ number: "", code: countryCode[0].code, readonly: false });
};
const removeContact = () => {
  contact.value.pop();
};

const formState= reactive({
  id:props.id,
  contact: contact

})

const confirm = async() => {
  formState.contact = contact
  let valid = true
  let contact_data=ref([])
  let formValues = JSON.parse(JSON.stringify(formState))
  for (const key in formValues) {
    if(key === 'contact'){
     formValues[key].forEach(element => {
        let num = element.number.replace(/\s+/g, '')
        if(element.number ==null){
          valid= false
        theme.pushMessage("Contact number is required!");
       }
        if(element.code == +91 && (num.length !=10 || isNaN(num))){
          valid= false
          theme.pushMessage("Contact number with valid number is required!");
        }
         if(element.code != +91 && (!num.length  || isNaN(num))){
          valid= false
          theme.pushMessage("Contact number with valid number is required!");
        }
      //   if (num.length != 10 || isNaN(num)) {
      //     console.log("inside validation")
      //    valid= false
      //    theme.pushMessage("Contact number with valid number is required!")
      //  }
     });
   } 
   }
//    const numbers = formValues.contact.map(o => o.number)
//  formValues.contact.filter(({number}, index) => {
//       console.log("reyt",!numbers.includes(number, index + 1)===true)
//       if(!numbers.includes(number, index + 1)===  true){
//         valid= false
//           theme.pushMessage("Contact number already exists!"); 
//       }
//       else{
//         contact_data.value =!numbers.includes(number, index + 1)
//       }
//     })
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
   if(valid){
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
    
    let formSubmit = {
      id:props.id,
      contact: contact_copy.value
    }

   let response = await counselor.submitContact(formSubmit)
   confirmCancel('confirm')
   }
   else{
    // theme.pushMessage("Form Error, please fill out mandatory fields")   
   }

}

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
      class="shadow-lg w-full max-h-modal md:w-3/5 z-50 overflow-y-scroll h-60 xl:w-2/5"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
      <div class="pl-4 space-y-3 mt-2 mb-2">
        <div class="flex gap-2 flex-wrap">

          <field grouped v-for="(con, i) in contact" :key="i">
          <small class="w-28 h-8">
            <Multiselect
              v-model="con.code"
           
              searchable
              valueProp="code"
              label="code"
              :classes="selectClasses"
              :options="countryCode"
              class="border border-gray-700 h-8"
              placeholder="code"
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
          />
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
          />
        </field>

        <jb-button color="info" :icon="mdiPlusBox" @click="addContact" small class="mr-1 h-8"/>
        <jb-button
          v-if="contact.length > 1"
          color="danger"
          :icon="mdiMinusBox"
          @click="removeContact"
          small
          class="h-8"
        />     
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

<style>
.padding-space input {
    padding-left: 40px !important;
}
</style>
