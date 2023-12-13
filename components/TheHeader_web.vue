<script setup lang="ts">
	import { ref, onMounted, computed, watch } from 'vue'
  import { useFetch, useStorage, useSessionStorage } from "@vueuse/core"
  import queryString from "query-string"
  import jsonData from "../static/init.json"
  import { usegetJWT } from "../composables/use-getJWT"
  import { IconList, IconSearch, IconPersonFill, IconHeartFill, IconInfoCircleFill } from '@iconify-prerendered/vue-bi'
  import { IconLogout } from '@iconify-prerendered/vue-iwwa'

	// const { $rmallSessionStorage } = useNuxtApp()

  const isMenu = ref(false)
	const bLogin = ref(false)
	const bIcon = ref(false) // 若已登入, 顯示使用者頭像
	const objLogo = ref('')

  const userIcon = ref('')
  const APIsvr = ref('')
  const imgSvr = ref('')
  const fullPath = ref('')
  const searchString = ref('')
  const siteIcon = ref('')
	const route = useRoute() // Nuxt 3 native function
  const unread = ref(0)
  const liwaInterval = ref('')

	const jumpPage = () => {
		
	}

  const goIndex = () => {
    window.location.href='/'
  }

	const goLogin = () => {
    // 跳到登入畫面, 先記錄目前的網址
    // const location = useBrowserLocation()
    // fullPath.value = location.value.href
    fullPath.value = route.fullPath
    window.sessionStorage.setItem('liwaNowLink', fullPath.value)
    window.location.href = "/login"
	}

  const toggleMenu = () => {
    isMenu.value = !isMenu.value
  }

  const goSearch = () => {
    if (searchString.value) {
      searchString.value = searchString.value.replace(/\s/g, "+")
      // 搜尋字非空, 跳到 Products
      window.location.href = '/Products?keyword='+searchString.value
    }
  }

  const getSiteInfo = async () => {
    let sAPIsvr = window.sessionStorage.getItem('liwaAPIsvr')
    let url = `${sAPIsvr}/sys_haveSiteInfo.php`
    const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
    siteIcon.value = data.data.value.message
  }  

  const goLogout = () => {
    let NowLink = route.fullPath
    // 若從 Profile 登出, 跳到首頁
    if (NowLink == '/Profile') NowLink = '/'
    window.sessionStorage.setItem('liwaNowLink', NowLink)
    window.localStorage.setItem('liwaJWT', '')
    window.sessionStorage.setItem('liwaUnread', '')
    clearInterval(liwaInterval.value)
    bLogin.value = false
    window.location.href = NowLink
  }

  const getUnread = async (memberID) => {
    let sAPIsvr = window.sessionStorage.getItem('liwaAPIsvr')
    let keydata = {
      'JWT': window.localStorage.getItem('liwaJWT'),
      'mainID': memberID
    }
    let sQuery = queryString.stringify(keydata)   
    let url = `${sAPIsvr}/w041_haveUnread.php?${sQuery}`
    const dataUnread = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
    unread.value = dataUnread.data.value.key
    window.sessionStorage.setItem('liwaUnread', unread.value)     
  }

  const resetUnread = () => {
    let sJWT = window.localStorage.getItem('liwaJWT')
    if (sJWT) {
      let sTmp = window.sessionStorage.getItem('liwaUnread')
      unread.value = Number(sTmp)
      // console.log('unread in resetUnread =', unread.value)
    }
  }

	onMounted(() => {
    // 若無 APIsvr & Imgsvr, 從 init.json取得
    let sAPIsvr = window.sessionStorage.getItem('liwaAPIsvr')
    if ((sAPIsvr == undefined) || (sAPIsvr == "") || (sAPIsvr == null)) {
        window.sessionStorage.setItem('liwaAPIsvr', jsonData[0].APIsvr)
        window.sessionStorage.setItem('liwaImgsvr', jsonData[0].imgSvr)
        window.sessionStorage.setItem('liwaSearchsvr', jsonData[0].Meilisvr)
    }
    // 取得 siteIcon
    getSiteInfo()
    // 檢查是否已登入?(sessionStorage(liwa_JWT)) 
    let sJWT = window.localStorage.getItem('liwaJWT')
    if (sJWT) {
      bLogin.value = true
      usegetJWT().then(res => {
        let tmp = JSON.parse(res.value).message
        let arrJWT = JSON.parse(tmp)
        // 取得 liwaIconPath (使用者圖檔)
        userIcon.value = window.sessionStorage.getItem('liwaImgsvr') + arrJWT.picpath
        // 若無sessionStorage.getItem('liwaUnread'), 則取得 Unread
        let userUnread = window.sessionStorage.getItem('liwaUnread')
        if (!userUnread) getUnread(arrJWT.sub)
      })
      unread.value = Number(window.sessionStorage.getItem('liwaUnread'))
      liwaInterval.value = setInterval(resetUnread, 5000)   
      // console.log('liwaInterval in onMounted =', liwaInterval.value)  
    } 
	})
</script>

<template>
    <div class="w-full mb-2 bg-white border-b-2 border-b-slate-300 shadow-sm shadow-slate-400 md:shadow-lg">
        <div class="w-full flex flex-row justify-between items-start">
            <!-- Logo 欄 -->
            <div class="w-48 h-24 rounded-full -mt-2 -ml-4 text-3xl text-center cursor-pointer" @click="goIndex()">
                <img src="../static/Logo_web.jpg" alt="" class="max-w-none mx-6 my-6" width="150" />
            </div>
            <div class="w-[calc(100%_-_12rem)] lg:w-[calc(100%_-_4rem)] flex flex-row-reverse justify-start">
                <!-- 登入,頭像, menu button -->
                <!-- menu button -->
                <div class="mt-4 cursor-pointer lg:hidden" @click="toggleMenu()">
                  <IconList class="w-12 h-12 p-0 text-slate-800 font-bold" />
                </div>  
                <div v-if="bLogin==false" class="mt-4 mr-4 flex flex-row justify-center lg:justify-end">
                  <div class="px-8 py-2 rounded bg-black text-white text-center cursor-pointer leading-8" @click="goLogin">登入
                  </div>
                </div>
                <div v-else class="w-[15rem] mx-1 mt-2 flex flex-row justify-end">
                  <!-- 已登入顯示頭像icon -->
                  <div class="px-2 py-2 flex flex-row-reverse justify-between">
                    <div class="hidden lg:block w-12 h-10 pt-2">
                      <IconLogout class="w-8 h-8 text-slate-400 font-bold" @click="goLogout()"/>
                    </div>
                    <div class="hidden lg:block w-12 h-10 pt-2 relative">
                      <NuxtLink to="/Profile?imode=D02">
                        <IconInfoCircleFill class="hidden lg:block w-8 h-8 text-blue-500 font-bold relative" />
                      </NuxtLink>
                      <div v-if="unread > 0" class="w-4 h-4 pr-[0.1rem] absolute top-1 right-2 rounded-full bg-red-400 text-white text-xs text-right font-semibold">{{ unread }}</div>
                    </div>
                    <div class="hidden lg:block w-12 h-10 pt-2">
                      <NuxtLink to="/Profile?imode=B01">
                        <IconHeartFill class="hidden lg:block w-8 h-8 text-red-400 font-bold" />
                      </NuxtLink>
                    </div>
                    <div class="hidden lg:block w-12 h-10 relative">
                      <NuxtLink to="/Profile">
                        <img :src="userIcon" class="w-10 h-10 rounded-full">
                      </NuxtLink>
                    </div>
                  </div>
                </div> 
                <div class="hidden md:block w-[calc(100%_-_12rem)]">
                  <!-- Search bar -->
                  <div class="w-96 h-12 mx-auto mt-4 bg-white rounded-md border-b-2 border-slate-300 flex flex-row">
                    <div class="w-[calc(100%_-_1rem)] py-2">
                      <input type="text" v-model="searchString" placeholder="站內搜尋欄" class="searchCol w-full ml-2 pt-2 px-2 box-border float-left bg-white border-transparent" @keyup.enter="goSearch">
                    </div>
                    <div class="ml-1 py-2 float-left cursor-pointer z-10">
                      <IconSearch class="w-7 h-7 text-slate-400 font-bold" 
                      @click="" />
                    </div>                    
                  </div>
                </div>
            </div>  
        </div>
        <div class="w-full md:hidden">
          <!-- Search bar -->
          <div class="w-[22rem] h-12 mx-auto my-2 bg-white rounded-md border-2 border-slate-500 flex flex-row">
            <div class="w-[calc(100%_-_3rem)] h-12">
              <input type="text" v-model="searchString" placeholder="站內搜尋欄" class="searchCol w-full ml-2 pt-3 text-xl bg-white border-transparent focus:ring-0" @keyup.enter="goSearch">
            </div>
            <div class="w-7 h-6 ml-1 mt-2 float-left cursor-pointer">
              <IconSearch class="w-7 h-7 text-slate-400 font-bold" 
              @click="" />
            </div>
          </div>
        </div>
    </div>
    <!-- 下拉選單之用 -->
    <div 
      class="w-full bg-slate-50 border-2 border-slate-200 absolute top-16 right-0 lg:hidden z-40"
      v-if="isMenu==true"
    >
        <ul class="list-none bg-white">
            <div class="w-full px-2 pt-4">
              <li class="w-full p-1 text-lg border-b-2 border-b-gray-200"><a href="/Products?imode=31">全館</a></li>
              <li class="w-full p-1 text-lg border-b-2 border-b-gray-200"><a href="/Products?imode=32">鑽石館</a></li>
              <li class="w-full p-1 text-lg border-b-2 border-b-gray-200"><a href="/Products?imode=33">彩寶館</a></li>
              <li class="w-full p-1 text-lg border-b-2 border-b-gray-200"><a href="/Products?imode=34">翡翠館</a></li>              
              <li class="w-full p-1 text-lg border-b-2 border-b-gray-200"><a href="/Products?imode=35">軟玉館</a></li>              
            </div>          
            <div v-if="bLogin" class="w-full mt-4 px-2 pb-4">
              <li class="w-full p-1 text-lg border-b-2 border-b-gray-200"><a href="/Products?imode=1">我的收藏</a></li>
              <li class="w-full p-1 text-lg border-b-2 border-b-gray-200"><a href="/Products?imode=2">已上架物件</a></li>
              <li class="w-full p-1 text-lg border-b-2 border-b-gray-200"><a href="/Profile?imode=D02">訊息中心</a></li>
              <hr />              
            </div>
            <div class="w-full mt-4 px-2 pb-4">
              <li class="w-full p-1 text-lg border-b-2 border-b-gray-200"><a href="/QnA">常見Q&A</a></li>
              <li class="w-full p-1 text-lg border-b-2 border-b-gray-200"><a href="/Statics">行情統計</a></li>
              <li class="w-full p-1 text-lg border-b-2 border-b-gray-200"><a href="/Services">客服中心</a></li>
              <li class="w-full p-1 text-lg"><a href="/Blogs">部落格</a></li>              
            </div>
        </ul>
    </div>    
</template>

<style scoped>
  .sysIcon {
    height:40px;
    /*margin:0px 4px 4px 10px;*/
    float:right;
    text-align:center;
    font-weight:bold;
    padding-top:0.35rem;
    box-sizing: border-box;
    cursor:pointer;   
  }

  .sysIcon.regis {
    background-color: #555;
    color:#DDD;
    border: 1px solid #555;
    border-radius: 10%;
  }

  .searchCol:focus {
    background-color:#FFF;
    outline:none;

  } 
</style>