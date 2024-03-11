<script setup>
import { onBeforeMount, computed, onMounted, ref } from "vue";
import AllEnquiryList from "@/components/AllEnquiryList.vue";
import HeroBar from "@/components/HeroBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import { counselorStore } from "../stores/counselor";
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import { sessionStore } from "../stores/session";

const user = sessionStore();
const theme = themeStore();
const counselor = counselorStore();
const router = useRouter();

const pageLoading = ref(false)

const itemsCount = computed(() => {
    if(counselor.allEnquiries && counselor.allEnquiries.total){
        return counselor.allEnquiries.total
    } 
}
);
    
onMounted(async () => {
  if (!user.loggedIn) {
    router.replace("login");
  }
});

const clear = async () => {
  pageLoading.value = true
  await user.checkUser();
  if (user.loggedIn) {
    theme.setPageTitle("Enquiries");
    theme.setSubTitle("")
    await counselor.getAllEnquiries();
    counselor.getSearchValues();
  }
  pageLoading.value = false
};
    

onBeforeMount(async () => {
  pageLoading.value = true
  await user.checkUser();
  if (user.loggedIn) {
    theme.setPageTitle("Enquiries");
    await counselor.getAllEnquiries();
    counselor.getSearchValues();
  }
  pageLoading.value = false
});
</script>

<template>
 <card-component :smallerPadding="true"  v-if="pageLoading" class="mb-6">
    <div wire:loading class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
	<div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
	<h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
	<p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
</div>
 </card-component>
  <card-component v-else-if="itemsCount > 0" class="mb-6" has-table>
    <all-enquiry-list />
  </card-component>
  <card-component v-else class="pt-2 mt-4">
<h5  class="text-red-500 text-2xl font-bold">{{ "No data found!!" }}</h5>   
 <jb-button label="clear" small 
      @click="clear()" />
  </card-component>
</template>
