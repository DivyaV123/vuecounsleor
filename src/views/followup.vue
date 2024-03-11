<template>

  
<card-component   
      class="mb-6"
      has-table>
      
 <batch-followup/>
</card-component>

</template>

<script setup>
import { onBeforeMount, computed } from 'vue'
import EnquiryList from '@/components/EnquiryList.vue'
import HeroBar from '@/components/HeroBar.vue'
import CardComponent from '@/components/CardComponent.vue'
import BatchFollowup from '@/components/BatchFollowup.vue'
import { followupstore } from "../stores/followup";

const batchplan= followupstore();
// const Started = computed(() => {
//   return batchplan.started;
// });

onBeforeMount(async () => {
  // batchplan.getFollowup()
})
</script>






