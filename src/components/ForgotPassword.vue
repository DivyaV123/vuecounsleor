
<template>
<overlay
v-show="value"
  @overlay-click="cancel"
  >
  <card-component :smallerPadding="true"  v-if="pageLoading" class="mb-6">
    <div wire:loading class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
	<div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
	<h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
	<p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
</div>
 </card-component>

    <card-component
      class="shadow-lg w-full max-h-modal sm:w-4/5 md:w-4/5 lg:w-1/2 z-50"
    >
    <p v-if="isverify===false&&isconfirm===false" class="py-4  text-gray-300 font-bold"> OTP will be sent to the entered Email Id</p>


      <div v-if="isverify===false&&isconfirm===false " class="flex">
          <div  class="flex-none w-full pr-2 "> 
            <div class="pl-5 space-y-6">
          <field label="Enter Email" :error="form.mail!==''? false : true" help="Please enter your Email" class="w-[80%]">
        <control
          v-model="form.mail"
          :icon-right="mdiAccount"
          name="login"
          :error="hasError"
          placeholder="user@example.com"
           pattern="\[a-z]+@qsp.com\"
          
        />
      </field>
     </div>
            </div>
      </div>

      <div v-if="isverify===true&&isconfirm===false"  class="max-w-sm mx-auto md:max-w-lg">
        <div class="w-full">
            <div  class="h-48 py-3 rounded text-center">
            <h1 class="text-2xl font-bold text-teal-500">OTP Verification</h1>
            <div v-if="isverify===true" class="flex flex-col mt-4 text-white"> <span>Enter the OTP you received at</span> <span class="font-bold text-white">{{form.mail}}</span> </div>
            <div id="otp" class="flex flex-row justify-center text-center px-2 mt-5"> 
              <input :onchange="ValidatePassKey('first')" v-model="first" class="m-1 border h-8 w-8 text-center form-control rounded text-black" type="first" id="first" name="first" maxlength="1"/>
                <input :onchange="ValidatePassKey('second')" v-model="second" class="m-1 border h-8 w-8 text-center form-control rounded text-black" type="second" id="second" name="second" maxlength="1"/> 
                <input :onchange="ValidatePassKey('third')" v-model="third" class="m-1 border h-8 w-8 text-center form-control rounded text-black" type="third" id="third" name="third" maxlength="1"/> 
                <input :onchange="ValidatePassKey('four')" v-model="four" class="m-1 border h-8 w-8 text-center form-control rounded text-black" type="four" id="four" name="four" maxlength="1"/>
                <input :onchange="ValidatePassKey('five')" v-model="five" class="m-1 border h-8 w-8 text-center form-control rounded text-black" type="five" id="five" name="five" maxlength="1"/> 
                <input :onchange="ValidatePassKey('six')" v-model="six" class="m-1 border h-8 w-8 text-center form-control rounded text-black" type="six" id="six" name="six" maxlength="1"/>
            </div>
            <div class="flex justify-center text-center mt-5"> <a class="flex items-center text-blue-700 hover:text-blue-900 cursor-pointer"><i class='bx bx-caret-right ml-1'></i></a> </div>
            </div>
        </div>
        <div v-if="isverify===true" class="mb-0 grid justify-items-center">
        <jb-button
              label="Verify OTP"
              type="verify"
              color="info"
              @click="verifyotp"
            />
        </div>
    </div>


    <!-- <div v-if="isverify===true&&isconfirm===false" class="grid justify-items-center">
          <div v-if="isOpen== true" class="">
            <div class="mt-4">
              <button  @click="send" id="sign-in-button">
                  <h2 class="text-right text-white hover:underline ">Resend OTP?</h2>
              </button>
            </div>
          </div>
          <div v-else>
            <div class="mt-4 ">
              <button class="" >
                <h2 class="text-white  hover:underline ">Resend OTP button will be enabled in {{countDown}} seconds</h2>
              </button>
            </div>
          </div>
    </div> -->

    <field label="Email" v-if="isconfirm===true" class="mt-2 px-3 py-2 max-w-full focus:ring focus:outline-none dark:placeholder-gray-400 w-full border-0 border-gray-700 dark:bg-gray-800 rounded opacity-50 cursor-not-allowed text-white">{{form.mail}}</field>
    <field v-if="isconfirm===true" label="New Password" :error="form.password!==''? false : true" help="Please enter your new password" >
        <control
          v-model="form.password"
          :error="hasError"
          :icon-right="oldPassShowHideClicked? mdiEyeOff:mdiEye"
          type="password"
          name="password"
          class="text-xs"
           onpaste="return false"
          placeholder="Enter your new Password here"
          autocomplete="New-password"
          @right-icon-click="oldToggleEye"
        />
      </field>

      <field v-if="isconfirm===true" label="Confirm Password" :error="form.confirmed_password!==''? false : true" help="Please enter your confirm password">
        <control
          v-model="form.confirmed_password"
          :error="hasError"
          :icon-right="newPassShowHideClicked? mdiEyeOff:mdiEye"
          type="password"
          name="password"
          class="text-xs"
           onpaste="return false"
          placeholder="Confirm your new Password here"
          autocomplete="New-password"
          @right-icon-click="newToggleEye"
        />
      </field>

        <level mobile>
          <jb-buttons v-if="isconfirm===true">
            <jb-button
              label="Submit"
              type="changepassword"
              color="info"
              @click="changepassword"
            />
     
          </jb-buttons>

        </level>


      <template #footer >
        <level mobile>
          <jb-buttons v-if="isverify===false " >
            <jb-button
              label="Send OTP"
              type="submit1"
              color="info"
              id="sign-in-button"
              @click="send"
            />
     
          </jb-buttons>

     
        </level>
      </template>
    </card-component>
</overlay>
<!-- <Recaptcha v-if="captcha===true" />  -->
</template>

<script setup>
import { reactive, ref, computed, onBeforeMount } from 'vue'
import { mdiEmail,mdiPhone,mdiEyeOff,mdiEye,mdiAccount } from '@mdi/js'
import FormScreenSection from '@/components/FormScreenSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import CheckRadioPicker from '@/components/CheckRadioPicker.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import JbButton from '@/components/JbButton.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import TextLink from '@/components/TextLink.vue'
import { sessionStore } from "../stores/session";
import { themeStore } from "../stores/theme";
import { useRouter,useRoute } from "vue-router";
// import { useStorage } from "vue3-storage";
import Overlay from '@/components/Overlay.vue'
import Multiselect from '@vueform/multiselect'
import { selectClasses } from '@/selectcss.js'
const router = useRouter();
const route = useRoute();
const user = sessionStore();
const theme = themeStore()
const isverify = ref(false)
const isconfirm = ref(false)
const countDown = ref(30);
const timeOut = ref('')
const first = ref("");
const second = ref("");
const third = ref("");
const four = ref("");
const five = ref("");
const six = ref("");
const datassss = ref(null);
const counts = ref(0);
const verify_number = ref("");
const form = reactive({
  mail:"",
  number: '',
  confirmed_password: '',
  password: '',
})
const pageLoading=ref(false)
const appVerifier = ref('');
const conResult = ref('');
const hasError2 = ref(false)
const datassss1 = ref(null);
let selected = ref(null);
const hasError = ref(false)
const hasError3 = ref(false)
const isOpen = ref(false);
const interval = ref("");

const timeout = ref(null);
const captcha = ref(false)
const cardClassAddon = computed(() => hasError.value ? 'animate-shake' : '')
const props = defineProps({
  value: {
    type: Boolean,
    default: null
  },
  title: {
    type: String,
    default: null
  },
  largeTitle: {
    type: String,
    default: null
  },
  button: {
    type: String,
    default: 'info'
  },
  buttonLabel: {
    type: String,
    default: 'submit'
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

const cancel = () => {
  value.value = false
}

const oldPassShowHideClicked = ref(true)
const newPassShowHideClicked = ref(true)


const oldToggleEye = () =>{
  return( oldPassShowHideClicked.value = !oldPassShowHideClicked.value);
}


const newToggleEye = () =>{
  return( newPassShowHideClicked.value = !newPassShowHideClicked.value);
}
// const code_value = computed(() => {
//     return code.$state.code
// })


// const codes = [
//   {"code":"+91"},
//   {"code":"+97"}
// ]
const items = computed(() => props.value);
function ValidatePassKey(currentid) {
              let currentval = document.getElementById(currentid)
              if (currentval) {
                currentval.onkeyup = function(e) {
                  var target = e.srcElement || e.target;
                  var maxLength = parseInt(target.attributes["maxlength"].value, 10);
                  var myLength = target.value.length;
                  if (myLength >= maxLength) {
                    var next = target;
                    while (next = next.nextElementSibling) {
                      if (next == null)
                        break;
                      if (next.tagName.toLowerCase() === "input") {
                        next.focus();
                        break;
                      }
                    }
                  }
                  else if (myLength === 0) {
                    var previous = target;
                    while (previous = previous.previousElementSibling) {
                      if (previous == null)
                        break;
                      if (previous.tagName.toLowerCase() === "input") {
                        previous.focus();
                        break;
                      }
                    }
                  }
                }
              }
            }

const nanfunc = async () => {
  if(form.number){
    if(form.number.length===1){
      hasError3.value =false
    }
    else if(form.number.length!=10 || isNaN(form.number) || /\s/g.test(form.number)){
      hasError3.value ="Contact Number not valid"
    }
    else{
      hasError3.value =false
    }

  }

};
const send = async ()  => {
  first.value=""
  second.value=""
  third.value=""
  four.value=""
  five.value=""
  six.value=""
  // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
  //   'size': 'invisible',
  //   'callback': (response) => {

  //   }
    
  // });
  // appVerifier.value = window.recaptchaVerifier
     if(form.mail==""){
    hasError.value=true
    theme.pushMessage("enter mail id")
  }
  if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.mail)))
  {
    hasError.value =true
    theme.pushMessage("Please fill your Valid email id")
  }
  else{
      pageLoading.value = true
  await user.forgotsendemail({"mail":form.mail})
    isverify.value=true 
    if(user.$state.send_mail.message="The otp has been sent to your mail id , please do check ua spam if you dont find it in inbox"){
     theme.pushMessage("Mail send successfully") 
      pageLoading.value = false
    }
   else{
        theme.pushMessage("Something went wrong")
        pageLoading.value = false 
   }

    }
     
  }
  // }
  
          // await code.forgotpassword_otp(selected.value['code']+""+form.number); 
          // isOpen.value = false
          // countDown.value = 30
          // interval.value = setTimeout(() => {
          //                   isOpen.value = true 
          //                   }, 30000)   
                     
          // countDownTimer(countDown.value)
          // if(code.forgototp.status===200){
          //   isverify.value=true   
          //   theme.pushMessage("OTP sent successfully to your mobile number");
          //   code.forgototp.status=0
          // }
          // else if(code.error_forgototp_send){
          //   if(code.error_forgototp_send.error==="otp limit exceeded try again tomorrow."){
          //     theme.pushMessage("OTP has been sent to you for 10 times Today...Please try again Tomorrow");
          //     code.error_forgototp_send = ""
          //     clearTimeout(interval.value)
          //     clearTimeout(timeOut.value)
          //     router.push("/login")
          //   }
          //   else if(code.error_forgototp_send.error==="Not a valid number please try again."){
          //     theme.pushMessage("This number has not been registered...PLease try with registered number");
          //     code.error_forgototp_send = ""
          //     clearTimeout(interval.value)
          //     clearTimeout(timeOut.value)
          //   }
          // }
  // }
      // }
  
//     catch(err){
//       theme.pushMessage("something went wrong");
//       value.value = false
//     }
// }




onBeforeMount(async() => {
  // fb.initiateFirebase()
  // fb.initiateAuth()
  theme.formScreenToggle(true);
  await user.checkUser();
  // selected.value = codes[0]
  if (user.loggedIn) {
    router.push("/");
  }
  

  
  //   window.onpopstate = event => {
  //     router.push("/login");
  //     location.reload()
  // };


});

// function  countDownTimer(count){
//      if(count > 0) {
//             timeOut.value = setTimeout(() => {
//               count -= 1
//                 countDown.value = count

//                 countDownTimer(count)
//             }, 1000)

//         }
//     }



    const delay = async () => {
        clearTimeout(interval.value)
        clearTimeout(timeOut.value)
        await code.forgotpassword_otp(selected.value['code']+""+form.number); 
          isOpen.value = false
          countDown.value = 30
          interval.value = setTimeout(() => {
                            isOpen.value = true 
                            }, 30000)               
          countDownTimer(countDown.value)
          if(code.forgototp.status===200){

            theme.pushMessage("OTP sent successfully to your mobile number");
            code.forgototp.status=0
            
          }
          else if(code.error_forgototp_send){
            if(code.error_forgototp_send.error==="otp limit exceeded try again tomorrow."){
              theme.pushMessage("OTP has been sent to you for 10 times Today...Please try again Tomorrow");
              code.error_forgototp_send = ""
              clearTimeout(interval.value)
              clearTimeout(timeOut.value)
              router.push("/login")
            }
          }

}

const verifyotp = async ()  => {
   const data1=first.value+second.value+third.value+four.value+five.value+six.value
  if(first.value==""&&second.value==""&&third.value==""&&four.value==""&&five.value==""&&six.value=="")
    {
      theme.pushMessage("Enter the OTP!!")
    } 
  else
  {
 
  await user.verifyotp({"otp" : JSON.parse(data1),"mail" : form.mail})
  if(user.$state.verify_otp.message==="The otp is correct"){
 theme.pushMessage("Verified OTP Successfully") 
     isconfirm.value=true

  }
  else{
    theme.pushMessage("Entered OTP is wrong") 
  }  
}
 }

    const changepassword = async () => {
        const pass =(value) =>{ 
          if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()~])[A-Za-z\d@$!%*?&#^()~]{8,}$/.test(value))
            {
                return  form.password;
            } 
          }
        if(form.password === "")
        {
          hasError.value = true
        }
        else if(form.password !=pass(form.password)){
           hasError.value = true
        theme.pushMessage("Password should contain more than  8 characters with 1 uppercase,lowercase,numbers and special characters")
        }
        else if(form.password!=form.confirmed_password){
          hasError.value =true
          theme.pushMessage("Both Password and Confirm Password should be identical")
        }
        else{
          try{
      await user.changenew_password({ "mail":form.mail, "newpassword": form.password })
    theme.pushMessage("Created New Password Successfully");
      location.reload()
          }
       catch{
        theme.pushMessage("Something went wrong!");
        }
          

        }
  
};


// window.onpopstate = event => {
//             router.push("/login");
//         };
</script>

<style >
.hello{
  width:100%
}
.modal-card-body{
 overflow-y: auto;
 -ms-overflow-style: none;
}

</style>
