<script setup>
import { onBeforeMount, computed, onMounted, ref } from "vue";
import WeekendEnq from "@/components/WeekendEnq.vue";
import HeroBar from "@/components/HeroBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import { counselorStore } from "../stores/counselor";
import { themeStore } from "../stores/theme";
import { useRouter } from "vue-router";
import { sessionStore } from "../stores/session";

const user = sessionStore();
const theme = themeStore();
const counselor = counselorStore();
const router = useRouter();

const pageLoading = ref(false)

const itemsCount = computed(() => {
    if(counselor.weekendEnquiries && counselor.weekendEnquiries.total){
        return counselor.weekendEnquiries.total
    } 
}
);
    
onMounted(async () => {
  if (!user.loggedIn) {
    router.replace("login");
  }
});

onBeforeMount(async () => {
  pageLoading.value = true
  await user.checkUser();
  if (user.loggedIn) {
    theme.setPageTitle("Weekend Enquiries");
    theme.setSubTitle("")
    await counselor.getWeekendEnquiries();
    // counselor.getSearchValues();
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
    <weekend-enq />
  </card-component>
</template>