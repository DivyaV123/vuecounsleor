<script setup>
import { computed ,onBeforeMount,ref,reactive,watch} from 'vue'
import { useRouter,useRoute } from "vue-router";
import { mdiLock,mdiLockReset,mdiLockCheck,mdiEyeOff,mdiClose } from '@mdi/js'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import CardComponent from '@/components/CardComponent.vue'
import Level from '@/components/Level.vue'
import TextLink from '@/components/TextLink.vue'
import Overlay from '@/components/Overlay.vue'
import { themeStore } from "../stores/theme"
import {counselorStore} from "../stores/counselor"
import { sessionStore } from "../stores/session";
const counselor = counselorStore();
const theme = themeStore();
const user = sessionStore();
const route = useRoute();
const router = useRouter();



const props = defineProps({
  title: {
    type: String,
    default: null
  },
  largeTitle: {
    type: String,
    default: null
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

const cpwd=ref('')
const form = reactive({
  oldpassword: '',
  password: '',
})

const hasError = ref(false)
const hasError1 = ref(false)
const hasError2 = ref(false)

const cardClassAddon = computed(() => hasError.value || hasError1.value ? 'animate-shake' : '')

const change = () => {
  hasError.value = false
  hasError1.value = false,
  hasError2.value = false 
}

const formLoading=ref(false)



const passShowHideClicked = ref(true)

const submit = async () => {
  let valid = true
  let formValues = JSON.parse(JSON.stringify(form) )
  if(form.oldpassword == '')
  {
    hasError.value = true
    theme.pushMessage("Please fill your Old Password");
    valid = false
  }
  if(form.password == '')
  {
    hasError1.value = true
    theme.pushMessage("Please fill your New Password");
    valid = false
  }
 if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(form.password))
    {
      hasError1.value = true
      theme.pushMessage("Password should contain more than  8 characters with 1 uppercase,lowercase,numbers and special characters!")
      valid = false
    }
  if(cpwd.value == '')
  {
    hasError2.value = true
    theme.pushMessage("Please Confirm New Password");
    valid = false
  }
  if(form.password != cpwd.value)
  {
    hasError1.value = true
    hasError2.value = true
    theme.pushMessage("New Password & Confirm New Password is not matching");
    valid = false
  }
  if (valid) {

await user.submitChangePassword(formValues)
if(user.$state.change_pass.message === "Your password has been changed successfully, please login with new password!"){
             cancel()
             user.logout()
             Object.assign(form, {
               oldpassword: '',
               password: '',
               cpwd:''
             });
             hasError.value = false
                hasError1.value = false
                hasError2.value = false
             router.push("/login")
             theme.pushMessage(user.$state.change_pass.message);
         }
         else{
           theme.pushMessage("Old Password is not  matching");
         }
       }
else {
 formLoading.value = false
 theme.pushMessage("Form Error, please fill out mandatory fields");
}

}





const lightBorderStyle = computed(() => theme.lightBorderStyle)

const lightBgStyle = computed(() => theme.lightBgStyle)

const tableTrStyle = computed(() => theme.tableTrStyle)

const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const darkMode = computed(() => theme.darkMode)


const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  Object.assign(form, {
      oldpassword: null,
      password: null,
    }),
    cpwd.value=""
  emit(mode)
}

const confirm = () => confirmCancel('confirm')

const cancel = () => confirmCancel('cancel')
</script>

<template>
  <overlay
  v-show="value"
  
  >    
    <card-component
      v-show="value"
      :title="title"
      class="shadow-lg w-full max-h-modal md:w-3/5 lg:w-2/5 z-50"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
      @submit.prevent="submit"
    >
      <div class="space-y-3">
        <h1
          v-if="largeTitle"
          class="text-2xl"
        >
          {{ largeTitle }}
        </h1>
      </div>

    <small>
        <field label="Old Password" :error="hasError">
          <control
            v-model="form.oldpassword"
            :tip-right="passShowHideClicked ? null : 'Click to show/hide'"
            :icon-right="mdiEyeOff"
            :error="hasError"
            :icon-left="mdiLock"
            name="old password"
            type="password"
            @right-icon-click="passShowHideClicked = true"
            placeholder="Enter your Old Password"
            @click="change()"
          />
        </field>
      </small>
      
      <small>
        <field label="New Password" :error="hasError1">
          <control
            v-model="form.password"
            :error="hasError1"
            :tip-right="passShowHideClicked ? null : 'Click to show/hide'"
            :icon-right="mdiEyeOff"
            :icon-left="mdiLockReset"
            name="new password"
            type="password"
            @right-icon-click="passShowHideClicked = true"
            placeholder="Enter your New Password"
            @click="change()"
          />
        </field>
      </small>

      <small>
        <field label="Confirm Password" :error="hasError2">
          <control
            v-model="cpwd"
            :error="hasError2"
            onpaste="return false"
            :tip-right="passShowHideClicked ? null : 'Click to show/hide'"
            :icon-right="mdiEyeOff"
            :icon-left="mdiLockCheck"
            name="confirm password"
            type="password"
            @right-icon-click="passShowHideClicked = true"
            placeholder="Confirm New Password"
            @click="change()"
          />
        </field>
      </small>
             

        <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button
              label="Change"
              type="submit"
              color="info"
              @click="submit"
            />
          </jb-buttons>
        </level>
      </template>

  
    </card-component>
  </overlay>
</template>
