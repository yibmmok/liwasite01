<script setup>
setResponseStatus(404)
</script>

<template>
<NuxtLayout name="web">   
  <div class="bg-white py-24">
    <div class="flex flex-col items-center">
      <h1 class="text-8xl font-semibold text-red-500">404</h1>
      <p class="my-8 text-3xl text-gray-800">抱歉, 找不到您的網頁</p>
      <div class="w-full lg:w-[1024px] mx-auto">
        <img src="//imgsvr.jewelrytrade.center/syspics/page404.png" alt="404 error">
      </div>
    </div>
  </div>
</NuxtLayout>
</template>
