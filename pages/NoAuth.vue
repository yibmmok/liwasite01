<script setup lang="ts">
  /*********************************************************
  prog name: 無權限顯示頁面, author: James Lin, date: 2022/10/03
  **********************************************************/	
  import { ref, onMounted} from "vue"
  import jsonData from "../static/init.json"

  const picpath = ref('')

  onMounted(() => {
    useHead({title:`未授權通知`})
  	let imgSvr = jsonData[0].imgSvr
  	picpath.value = `${imgSvr}/syspics/NoAuth.png`
  })


  // definePageMeta({
  //   colorMode:'light',
  //   layout:"default",
  // })  
</script>

<template>
<NuxtLayout name="web">   
  <div class="w-full h-[100vh] lg:h-[calc(100vh_-_130px)]">
    <div class="sm:w-full lg:w-[900px] mx-auto px-16 pt-8">
      <img src="//imgsvr.jewelrytrade.center/syspics/pageNoAuth.png" alt="No Auth">
    </div>
    <div class="w-full lg:w-[900px] mx-auto text-4xl font-semibold text-center">您未被授權進入本頁面</div>    
  </div>
</NuxtLayout>  
</template>