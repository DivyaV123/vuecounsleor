<script setup>
import { computed,onBeforeMount, ref } from "vue";
import JbButton from "@/components/JbButton.vue";
import {
  mdiForwardburger,
  mdiBackburger,
  mdiClose,
  mdiDotsVertical,
  mdiMenu,
  mdiLogout,
  mdiHome,
  mdiBell,
  mdiPlusBox,
  mdiBookOpenPageVariantOutline,  
  mdiLockReset,  
  mdiAccountCancelOutline,
  mdiAccountGroup,
  mdiAccountOff,
  mdiAccountQuestion,
  mdiAccountAlert,
  mdiStar,
  mdiAccountArrowLeft,
  mdiAccountArrowRight,
  mdiAccountSwitch,
  mdiPhoneClassicOff,
  mdiPageNext,
  mdiCastEducation,
  mdiPhoneMissed,
  mdiArrangeBringForward,
  mdiArrangeSendBackward,
  mdiPhoneClock,
  mdiAccountRemove,
  mdiAccountCheck,
  mdiAccountConvert,
  mdiAccountTie,
  mdiCalendarWeekend,
  mdiBookArrowRight,
  mdiViewDayOutline
} from "@mdi/js";
import NavBarItem from "@/components/NavBarItem.vue";
import NavBarItemLabel from "@/components/NavBarItemLabel.vue";
import NavBarMenu from "@/components/NavBarMenu.vue";
import Divider from "@/components/Divider.vue";
import ModalReminder from "@/components/ModalReminder.vue";
import ModalInternal from "@/components/ModalInternal.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import Icon from "@/components/Icon.vue";
import { themeStore } from "../stores/theme";
import { sessionStore } from "../stores/session";
import { useRouter, useRoute } from "vue-router";
import { counselorStore } from "../stores/counselor";
import ModalBox from "@/components/ModalBox.vue";
import ChangePassword from "@/components/ChangePassword.vue";
const theme = themeStore();
const user = sessionStore();
const router = useRouter();
const counselor = counselorStore();
const route = useRoute();
const isAsideRightActive = computed(() => theme.isAsideRightActive);

const isNavBarVisible = computed(() => !theme.isFormScreen);

const isAsideMobileExpanded = computed(() => theme.isAsideMobileExpanded);

const isAsideCompact = computed(() => theme.isAsideCompact);

const isAsideHiddenLayout = computed(() => theme.isAsideHiddenLayout);

const logOutActive = ref(false);
const changepassword = ref(false);

const userName = computed(() => {
  if (user.user) {
    return user.user.username;
  }
});

const menuToggleMobileIcon = computed(() =>
  isAsideMobileExpanded.value ? mdiBackburger : mdiForwardburger
);

const openReminderModal = () => {
  isReminderActive.value = true;
};
const isReminderActive = ref(false);


const openInternalModal = () => {
  isInternalActive.value = true;
};
const isInternalActive = ref(false);


const confirmRefresh = () => {

  if (route.path === '/reminder-list') {
    counselor.getReminders();
  }
  if (route.path === '/internals') {
    counselor.getInternals();
  }

};


const menuToggleMobile = () => theme.asideMobileToggle();

const menuToggleIcon = computed(() => {
  if (isAsideHiddenLayout.value) {
    return mdiMenu;
  }

  return isAsideCompact.value ? mdiForwardburger : mdiBackburger;
});
const show_follow = ref(false)
onBeforeMount(async () => {
  await user.checkUser();
  if (user.loggedIn) {
  // console.log("user",user.author.branches)
  for (let i = 0; i < user.author.branches.length; i++) {
    if(user.author.branches[i].id===22||user.author.branches[i].id===99||user.author.branches[i].id===100||user.author.branches[i].id===19){
      show_follow.value=true
    }
  }
}

});

const menuToggle = () => {
  if (isAsideHiddenLayout.value) {
    theme.asideVisibilityToggle();
  } else {
    theme.asideCompactToggle();
  }
};

const asideRightToggle = () => {
  updatesClicked.value = true;
  theme.asideRightToggle();
};

const isMenuNavBarActive = ref(false);
// const isupdatechange=ref(true)
const isstatuschange=ref(false)

const menuNavBarToggleIcon = computed(() =>
  isMenuNavBarActive.value ? mdiClose : mdiDotsVertical
);

const menuNavBarToggle = () => {
  isMenuNavBarActive.value = !isMenuNavBarActive.value;
};

const togglestatus=()=>{
    isstatuschange.value=true
    if(isstatuschange.value==true){
    document.getElementById("status").style.color="cyan"
    document.getElementById("update").style.color="white"
    }
  }

const changestatus=()=>{
  isstatuschange.value=false
 if(isstatuschange.value==false){
  document.getElementById("status").style.color="white"
    document.getElementById("update").style.color="cyan"
 }
}
const updatesClicked = ref(false);

const updatesUpdateMark = computed(() =>
  !updatesClicked.value && theme.updatesStatus ? "warning" : null
);

const toggleLightDark = () => {
  theme.darkModeTrigger();
};

const pageTitle = computed(() => theme.pageTitle);
const subTitle = computed(() => theme.subTitle);
const logout = async () => {
  await user.logout();
  router.go();
};

const redirect = ()=>{
  isMenuNavBarActive.value = !isMenuNavBarActive.value
  const routeData = router.resolve({name: 'Add enquiry'});
  window.open(routeData.href, '_self');   
}
</script>

<template>
  <modal-reminder v-if="isReminderActive" v-model="isReminderActive" title="Add Reminder" @confirm="confirmRefresh"
    has-cancel>
  </modal-reminder>
  <modal-internal v-if="isInternalActive" v-model="isInternalActive" title="Add Internal Number"
    @confirm="confirmRefresh" has-cancel>
  </modal-internal>
  <nav v-show="isNavBarVisible" id="nav" class="
      top-0
      left-0
      right-0
      fixed
      flex
      bg-white
      h-[76px]
      border-b border-gray-100
      z-[30]
      w-screen
      transition-position
      lg:transition-none lg:w-auto lg:items-stretch
      dark:bg-gray-900 dark:border-gray-800
    ">
    <div class="flex-1 items-stretch flex h-[40px]">
      <nav-bar-item to="/" type="flex lg:hidden" p-x="pl-3 pr-0" >
        <icon :path="mdiHome" size="24" />
      </nav-bar-item>
      <nav-bar-item has-divider to="/" type="hidden lg:flex" p-x="pl-3 pr-3" >
        <icon :path="mdiHome" size="24" class="text-amber-300" />
      </nav-bar-item>
      <nav-bar-item type="flex flex-wrap">
        <icon :path="mdiBookOpenPageVariantOutline" size="20" class=" text-green-100" />&nbsp;
        <span class="text-red-50 text-sm 2xl:w-auto"> {{ pageTitle }} </span>  <br> 
        <span v-if="subTitle" class="w-full pt-4"><p class="text-yellow-100 text-base"><span class="text-lg font-bold">{{ subTitle }}</span> </p></span>
      </nav-bar-item>  
    </div>
  
    <div class="flex-none items-stretch flex h-14 lg:hidden">
      <nav-bar-item :active="isAsideRightActive" @click="asideRightToggle">
        <icon :path="mdiBell" :update-mark="updatesUpdateMark" size="20" />
      </nav-bar-item>
      <nav-bar-item @click.prevent="menuNavBarToggle">
        <icon :path="menuNavBarToggleIcon" size="20" />
      </nav-bar-item>
    </div>
    <div class="
        absolute
        w-screen
        top-14
        left-0
        bg-white
        shadow
        lg:w-auto
        lg:items-start
        lg:flex
        lg:grow
        lg:static
        lg:border-b-0
        lg:overflow-visible
        lg:shadow-none
        dark:bg-gray-900
      " :class="{ hidden: !isMenuNavBarActive, block: isMenuNavBarActive }">
      <div class="
          max-h-screen-menu
          overflow-y-auto
          lg:overflow-visible lg:flex lg:items-start lg:justify-end lg:ml-auto
          border-b border-gray-900
        ">
    <!-- Destop view -->
        <nav-bar-menu has-divider  class="relative border-l border-gray-600 hidden lg:block" @click="changestatus()">     
          <span class="text-cyan-300 dark:text-cyan-300 text-sm font-medium  relative" id="update">Master Enquiry &nbsp;</span>  </nav-bar-menu>
                <div class="absolute top-[41px] right-[1%] hidden lg:block" v-if="isstatuschange===false" >
                  <div class="flex  border border-gray-600 p-0 rounded" > 
                  <nav-bar-item to="/ob-to-me" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiArrangeSendBackward"
                    label="Other branch to me"
                    @click="text-red-300"
                  />
                  </nav-bar-item> 
                <divider nav-bar />

                <nav-bar-item to="/escalated-to-me" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiAccountArrowLeft"
                    label="Escalated to me"
                  />
                  </nav-bar-item> 
             

                  <nav-bar-item to="/no-calls" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiPhoneClassicOff"
                    label="Zero Calls Made"
                  />
                  </nav-bar-item>

                  <nav-bar-item to="/rigid-enq" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiViewDayOutline"
                    label="Rigid Enquiries"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/weekend-enq" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiCalendarWeekend"
                    label="Weekend Enq"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/referrals" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiAccountSwitch"
                    label="Referral List"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/joined-somewhere" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiAccountRemove"
                    label="Joined Outside"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/already-joined" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiAccountCheck"
                    label="Joined Within"
                  />
                  </nav-bar-item>

                

                </div>
                </div>   
                
         <nav-bar-menu has-divider class="relative  hidden lg:block" @click="togglestatus()">     
          <span class="text-yellow-100 dark:text-yellow-50 text-sm font-medium  relative" id="status">Status List &nbsp;</span>  </nav-bar-menu>
                <div class=" absolute top-[41px] right-[1%] hidden lg:block"  v-if="isstatuschange===true" >
                  <div class="flex  border border-gray-600 p-0 rounded">
                    <nav-bar-item to="/update-status" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiAccountQuestion"
                    label="Update Status"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/no-enquiry-form" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiAccountOff"
                    label="No Enquiry Form"
                    
                  />
                  </nav-bar-item>

                  <nav-bar-item to="/data-not-taken" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiAccountAlert"
                    label="Data not taken"

                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/online-batches" class="text-xs  border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiBookArrowRight"
                    label="Online Batches"
                  />
                  </nav-bar-item> 

                <nav-bar-item to="/call-back" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiPhoneClock"
                    label="Call Back"
                  />
                  </nav-bar-item>

                  <nav-bar-item to="/got-job" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiAccountTie"
                    label="Got job"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/need-online" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiCastEducation"
                    label="Need Online"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/enq-follow" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiAccountGroup"
                    label="Enq-Followup"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/enq-drop" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiAccountCancelOutline"
                    label="Enq-Dropouts"
                  />
                  </nav-bar-item> 
                  <!-- <nav-bar-item to="/branch-calls" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiPhoneClock"
                    label="Branch Records"
                  />
                  </nav-bar-item>  -->

                </div>
                </div>  
             
                <!-- Destop view End-->

           

              <!-- mobile view -->
              <nav-bar-menu has-divider class="block lg:hidden " @click="isMenuNavBarActive = !isMenuNavBarActive">     
          <span class="text-yellow-100 dark:text-yellow-50 text-sm font-medium ">Master Enquiry &nbsp;</span>
          <!-- <div class="flex  border border-gray-600 p-0 rounded" >  -->
            <template #dropdown>
                  <nav-bar-item to="/ob-to-me" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiArrangeSendBackward"
                    label="Other branch to me"
                    @click="text-red-300"
                  />
                  </nav-bar-item> 
                <divider nav-bar />

                <nav-bar-item to="/escalated-to-me" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiAccountArrowLeft"
                    label="Escalated to me"
                  />
                  </nav-bar-item> 
             

                  <nav-bar-item to="/no-calls" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiPhoneClassicOff"
                    label="Zero Calls Made"
                  />
                  </nav-bar-item>

                  <nav-bar-item to="/rigid-enq" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiViewDayOutline"
                    label="Rigid Enquiries"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/weekend-enq" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiCalendarWeekend"
                    label="Weekend Enq"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/referrals" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiAccountSwitch"
                    label="Referral List"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/joined-somewhere" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiAccountRemove"
                    label="Joined Somewhere"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/already-joined" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiAccountCheck"
                    label="Already Joined"
                  />
                  </nav-bar-item>

                </template>

                <!-- </div> -->
        </nav-bar-menu>

         <!-- mobile view End-->


        <nav-bar-menu has-divider class="block lg:hidden" @click="isMenuNavBarActive = !isMenuNavBarActive">     
          <span class="text-yellow-100 dark:text-yellow-50 text-sm font-medium">Status List &nbsp;</span>
      <template #dropdown >
                    <nav-bar-item to="/update-status" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiAccountQuestion"
                    label="Update Status"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/no-enquiry-form" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiAccountOff"
                    label="No Enquiry Form"
                    
                  />
                  </nav-bar-item>

                  <nav-bar-item to="/data-not-taken" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiAccountAlert"
                    label="Data not taken"

                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/online-batches" class="text-xs  border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiBookArrowRight"
                    label="Online Batches"
                  />
                  </nav-bar-item> 

                <nav-bar-item to="/call-back" class="text-xs border-r border-gray-600">
                  <nav-bar-item-label
                    :icon="mdiPhoneClock"
                    label="Call Back"
                  />
                  </nav-bar-item>

                  <nav-bar-item to="/got-job" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiAccountTie"
                    label="Got job"
                  />
                  </nav-bar-item> 

                  <nav-bar-item to="/need-online" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiCastEducation"
                    label="Need Online"
                  />
                  </nav-bar-item>
                  
                  <nav-bar-item to="/branch-calls" class="text-xs border-r border-gray-600">
                    <nav-bar-item-label
                    :icon="mdiPhoneClock"
                    label="Branch Records"
                  />
                  </nav-bar-item> 

          </template>
        </nav-bar-menu>

        <div class="border-r border-gray-600 h-[42px]">
        <nav-bar-menu  :hasDropdown="false" class="pt-0 lg:ml-[6px]">
          <nav-bar-item  desktop-icon-only class="pt-0 lg:pb-0" @click.prevent="redirect">
            <small class="text-gray-500 dark:text-gray-300 mr-1 lg:pb-0">
              <jb-button color="amber"  class="font-bold " :icon="mdiPlusBox" label="Enquiry" small />
            </small>
          </nav-bar-item>
        </nav-bar-menu>
      </div>

      <div class="border-r border-gray-600 h-[42px]">
        <nav-bar-menu :hasDropdown="false" class="pt-0">
          <nav-bar-item to="/unpaid-dropouts" class="pt-0 lg:pb-0">
            <small class="text-gray-500 dark:text-gray-300 lg:pb-0">
              <jb-button color="red"  class="font-bold" :icon="mdiAccountAlert" label="Dropouts" small />
            </small>
          </nav-bar-item>
        </nav-bar-menu>
      </div>

      <div  class="border-r border-gray-600 h-[42px]">
        <nav-bar-menu :hasDropdown="false" class="pt-0">
          <nav-bar-item to="/follow-up" class="pt-0 lg:pb-0">
            <small class="text-gray-500 dark:text-gray-300 lg:pb-0">
              <jb-button color="success"  class="font-bold" :icon="mdiAccountArrowRight" label="Follow Up" small />
            </small>
          </nav-bar-item>
        </nav-bar-menu>
</div>
       

        <!-- <nav-bar-menu has-divider>     
          <span> Escalation List </span>
              <template #dropdown >
                <nav-bar-item to="/escalated-to-me">
                  <nav-bar-item-label
                    :icon="mdiAccountArrowLeft"
                    label="Escalated to me"
                  />
                  </nav-bar-item>   

                  <nav-bar-item to="/escalated-by-me">
                  <nav-bar-item-label
                    :icon="mdiAccountArrowRight"
                    label="Escalated by me"
                  />
                  </nav-bar-item>
              </template>
        </nav-bar-menu> -->
        <div class="border-r border-gray-600 h-[42px]">
        <nav-bar-item to="/missed-calls" desktop-icon-only class="pt-[14px]">
          <icon :path="mdiPhoneMissed" size="18" class="text-red-500 hover:text-red-700" />
        </nav-bar-item>
        </div>
        <!-- <nav-bar-item to="/stars" has-divider desktop-icon-only >
          <icon :path="mdiStar" size="20" class="text-lime-300 hover:text-yellow-400" />
        </nav-bar-item> -->

        <!-- <nav-bar-menu :hasDropdown="false" has-divider>
          <nav-bar-item desktop-icon-only>
            <small class="text-gray-500 dark:text-gray-300">
              <jb-button color="info" :icon="mdiPlusBox" label="Reminder" small @click="openReminderModal()" />
            </small>
          </nav-bar-item>
        </nav-bar-menu> -->

        <!-- @click="asideRightToggle" -->
        <div class="border-r border-gray-600 h-[42px]">
        <nav-bar-item :active="isAsideRightActive" desktop-icon-only class="pt-[14px]">
          <!-- <nav-bar-item-label :icon="mdiBell" :update-mark="updatesUpdateMark" label="Updates" desktop-icon-only /> -->
          <icon :path="mdiBell" size="18" class="text-cyan-400 hover:text-cyan-600" />
        </nav-bar-item>
      </div>
        <nav-bar-menu has-divider>
          <div>
            <small class="text-neutral-100 dark:text-neutral-200">
              <span>{{userName}} &nbsp;</span>
            </small>
          </div>

          <template #dropdown>
            <!-- <nav-bar-item to="/reminders">
              <nav-bar-item-label :icon="mdiCalendarAlert" label="My Reminders" />
            </nav-bar-item>
            <nav-bar-item to="/internals">
              <nav-bar-item-label :icon="mdiAccount" label="Internal List" />
            </nav-bar-item>
            <nav-bar-item @click="openInternalModal()">
              <nav-bar-item-label :icon="mdiPlusBox" label="Add Internal" />
            </nav-bar-item>
            <divider nav-bar /> -->
            <!-- <nav-bar-item to="/">
              <nav-bar-item-label :icon="mdiBookOpenPageVariantOutline" label="MyEnq" />
            </nav-bar-item> -->
            <nav-bar-item @click="changepassword = true">
              <nav-bar-item-label :icon="mdiLockReset" label="Change Password" />
            </nav-bar-item>
            <divider nav-bar />
            <nav-bar-item @click="logOutActive = true">
              <nav-bar-item-label :icon="mdiLogout" label="Log Out" />
            </nav-bar-item>
            <divider nav-bar />
          </template>
        </nav-bar-menu>


      </div>
    </div>
  </nav>
  <modal-box v-model="logOutActive" title="Logout" button="danger" button-label="Logout" has-cancel @confirm="logout" >
    <p class="pl-4">Are you sure you want to <b>logout?</b></p>
  </modal-box>
  <change-password v-model="changepassword" title="Change Password" ></change-password>
</template>

<style scoped>

</style>