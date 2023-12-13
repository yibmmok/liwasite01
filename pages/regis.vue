<script setup lang="ts">
  /*********************************************************
  prog name: 使用者註冊, author: James Lin, date: 2022/10/05

  **********************************************************/
	import { ref, onMounted, computed } from "vue"
  import { useFetch, createFetch } from "@vueuse/core"
  import queryString from "query-string"

  const submitted = ref(false)
  const APIsvr = ref('')
  const isMessage = ref('')
  const res = ref([])
  const liwaData = ref({
    memberNM:'',
    mobile:''
  })

  const register = async () => {
    // 先檢查手機號碼是否已存在
    let datastr = JSON.stringify(liwaData.value)

    const useMyFetch = createFetch({
      baseUrl: APIsvr.value,
      options: {},
      fetchOptions: {
        mode: 'cors',
        headers: new Headers({
          'Content-Type': 'multipart/form-data'
        }),
        body: JSON.stringify(liwaData.value)
      }
    })  

    const { data } = await useMyFetch('regis_web.php').post().json()
    if (data.value.arrSQL.length > 0) res.value = data.value.arrSQL[0]
    let msg = res.value.message
    if (msg) {
      isMessage.value = msg
    } else {
      // 將回傳的使用者資料設給 sessionStorage
      window.localStorage.setItem('liwaJWT', res.value.token)
      window.sessionStorage.setItem('liwaIconPath', res.value.picpath)
      window.sessionStorage.setItem('liwaImgsvr', res.value.imgsvr)
      window.localStorage.setItem('liwaWelcome', 1)

      // 已通過註冊則跳到歡迎畫面
      window.location.href='/welcome'
    }
  }

  onMounted(() => {
    useHead({title:`註冊本中心`})
    APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
  })
	
  // definePageMeta({
  //   layout:"web",
  //   colorMode: "light"
  // })
</script>

<template>
<NuxtLayout name="web"> 
<div class="h-[calc(100vh_-_7rem)] bg-white flex justify-center items-start w-full">
  <div class="pt-4">
    <div class="bg-white m-2 rounded-xl max-w-md pb-1">
      <div class="bg-white px-10 py-5 w-screen max-w-sm">
        <h1 class="text-center text-2xl font-semibold text-gray-600 underline underline-offset-8 decoration-orange-500 tracking-[1.5rem]">會員註冊</h1>
      </div>                
      <FormKit 
        form-class="px-8 py-8 bg-gray-200 rounded-2xl w-11/12 box-content"
        type="form"
        :form-class="submitted? 'hidden': 'block'"
        style="margin: 1rem auto;"
        v-model="liwaData"
        submit-label="上傳"
        @submit="register"
      >
        <FormKit
          name="memberNM"
          label="姓名*"
          type="text"
          placeholder="請輸入姓名"
          help="可輸入中英文名字(字數限制100字)"
          validation="required"
          outer-class="mb-5"
        />        
        <FormKit
          name="mobile"
          label="手機號碼*"
          type="text"
          placeholder="請輸入手機號碼"
          help="請輸入您的手機號碼, 共10碼, 無空白"
          validation="required|number|length:10"
          outer-class="mb-5"
        />
        <div class="w-full h-[20rem] py-8 border-2 border-gray-100 bg-white">
          <iframe src="/TermShort" frameborder="0" class="w-full h-[18rem] px-4 overflow-x-hidden overflow-y-auto"></iframe>
        </div>
        <div class="w-full my-4 ">
          <FormKit 
            name="terms"
            type="checkbox"
            label="我已閱讀線上合約內容並同意遵守"
            inner-class="float-left mr-2 leading-8 border-0"
            :value="false"
            validation="accepted"
          />          
        </div>
      </FormKit>
      <div class="w-full pl-8 text-left text-red-400 text-md">{{ isMessage }}</div>
    </div> 
  </div> 
</div>
</NuxtLayout>
</template>

<style scope>
  .formkit-outer {
    margin-bottom: 1.25rem;
  }
/*
  .formkit-wrapper .formkit-inner {
    border:none;
  }
  */

/*  .formkit-input[type="checkbox"] {
    border:none;
  }*/
</style>