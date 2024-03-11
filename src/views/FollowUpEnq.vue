<script setup>
import { onBeforeMount, computed, onMounted, ref } from "vue";
import FollowUpEnq from "@/components/FollowUpEnq.vue";
import CardComponent from "@/components/CardComponent.vue";
import { counselorStore } from "../stores/counselor";
import { themeStore } from "../stores/theme";
import { useRoute, useRouter } from "vue-router";
import { sessionStore } from "../stores/session";

const user = sessionStore();
const theme = themeStore();
const counselor = counselorStore();
const router = useRouter();
const route = useRoute();

const pageLoading = ref(false)

// const itemsCount = computed(() => {
//     if(counselor.fEnqs && counselor.fEnqs.size){
//         return counselor.fEnqs.size
//     } 
// }
// );
    
onMounted(async () => {
  if (!user.loggedIn) {
    router.replace("login");
  }
});

onBeforeMount(async () => {
  pageLoading.value = true
  await user.checkUser();
  if (user.loggedIn) {
    
    if (route.query && route.query.fp) {
    theme.setPageTitle(route.query.name);
    if(route.query.type == 100){
      theme.setSubTitle("All");
    }
    if(route.query.type == 101){
      theme.setSubTitle("Called");
    }
    if(route.query.type == 102){
      theme.setSubTitle("Not Called");
    }
    if(route.query.type == 1){
      theme.setSubTitle("Enquiry");
    }
    if(route.query.type == 2){
      theme.setSubTitle("Call Back");
    }
    if(route.query.type == 3){
      theme.setSubTitle("Escalation");
    }
    if(route.query.type == 4){
      theme.setSubTitle("Coming");
    }
    if(route.query.type == 6){
      theme.setSubTitle("Need Online");
    }
    if(route.query.type == 7){
      theme.setSubTitle("Joined Within");
    }
    if(route.query.type == 8){
      theme.setSubTitle("Not interested");
    }
    if(route.query.type == 9){
      theme.setSubTitle("Got Job");
    }
    if(route.query.type == 10){
      theme.setSubTitle("Joined Outside");
    }
    if(route.query.type == 13){
      theme.setSubTitle("RNR");
    }
    if(route.query.type == 14){
      theme.setSubTitle("Next Batch");
    }
    if(route.query.type == 15){
      theme.setSubTitle("SW - NR");
    }
    await counselor.getFollowUpEnquiries(route.query.fp,route.query.type);
    }
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
  <card-component class="mb-6" has-table>
    <follow-up-enq />
  </card-component>
</template>