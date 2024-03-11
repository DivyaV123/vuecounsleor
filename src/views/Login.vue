<script setup>
import { reactive, ref, computed, onBeforeMount } from 'vue'
import { mdiAccount, mdiEyeOff ,mdiLogin} from '@mdi/js'
import FormScreenSection from '@/components/FormScreenSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import CheckRadioPicker from '@/components/CheckRadioPicker.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import JbButton from '@/components/JbButton.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import TextLink from '@/components/TextLink.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'
import { sessionStore } from "../stores/session";
import { useRouter } from "vue-router";

const router = useRouter();
const user = sessionStore();
const isresendmobile = ref(false);

const resendmobile = async () => {
  isresendmobile.value = true;
};

const form = reactive({
  username: '',
  password: '',
})

const hasError = ref(false)
const cardClassAddon = computed(() => hasError.value ? 'animate-shake' : '')

const submit = async () => {
  if(form.username === "" || form.password === "")
  {
    hasError.value = true
  }
  else{
    await user.login({ email: form.username, password: form.password });
    if (user.loggedIn) {
      router.replace("/");
    }
  }
  
}
const passShowHideClicked = ref(true)
onBeforeMount(() => {
  if (user.loggedIn) {
    router.push("/");
  }
});
</script>

<template>
 <forgot-password  v-if="isresendmobile === true"  v-model="isresendmobile"/>
  <form-screen-section v-slot="{ cardClass, cardRounded }" bg="login" promo>
     <card-component :rounded="cardRounded" :class="[cardClass, cardClassAddon]"  :icon="mdiLogin"  
    > 
    <!-- <card-component
      :class="[cardClass, cardClassAddon]"
      :rounded="cardRounded"
      form
      @submit.prevent="submit"
    > -->
      <field label="Login" :error="hasError" help="Please enter your username" class="mx-2 mt-1">
        <control
          v-model="form.username"
          :error="hasError"
          :icon-right="mdiAccount"
          name="login"
          placeholder="user@example.com"
          autocomplete="username"
        />
      </field>

      <field label="Password" :error="hasError" help="Click icon to show/hide" class="mx-2">
        <control
          v-model="form.password"
          :error="hasError"
          :tip-right="passShowHideClicked ? null : 'Click to show/hide'"
          :icon-right="mdiEyeOff"
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="current-password"
          @right-icon-click="passShowHideClicked = true"
        />
      </field>

  <template #footer>
        <div class="flex justify-between items-center mb-1">
            <div class="form-group form-check">
            </div>
            <jb-button label="Forgot Password?" type="password" color="black" @click="resendmobile"  class="py-0 px-0 pt-0 pb-1 border-0 text-sm underline font-bold " />
          </div>
           <jb-buttons>
            <jb-button  label="Login" type="submit" color="info" @click="submit" class="font-medium text-base "/>
          </jb-buttons>
        
      </template>

      <!-- <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button
              label="Login"
              type="submit"
              color="info"
              class="pt-1 pb-1"
            />
     
          </jb-buttons>
        </level>
      </template> -->
    </card-component>
  </form-screen-section>
</template>
