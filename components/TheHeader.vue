.<script setup lang="ts">
	/*********************************************************
	prog name: 頁首, author: James Lin, date: 2022/09/01

	**********************************************************/
	import { ref, onMounted, computed } from 'vue'
	import { useFetch, useStorage, useSessionStorage } from "@vueuse/core"
	import jwtDecode from "jwt-decode"
	import { IconPersonFill, IconQuestionCircleFill, IconSearch } from "@iconify-prerendered/vue-bi"
	import { useChkauth } from "../composables/use-chkauth"
	import jsonData from "../static/init.json"

	// const { $rmallSessionStorage } = useNuxtApp()
	const bLogin = ref(false)
	const bIcon = ref(false)
	const objLogo = ref('')
	const siteName = ref('')
	const siteIcon = ref('')
	const userIcon = ref('')

	const route = useRoute() // Nuxt 3 native function

	const jumpPage = () => {
		return '/A03'
	}

	const getSiteInfo = async () => {
		let sAPIsvr = window.sessionStorage.getItem('liwaAPIsvr')
		let url = `${sAPIsvr}/sys_haveSiteInfo.php`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		siteIcon.value = data.data.value.message
		siteName.value = data.data.value.key
	}

	const logout = () => {
		window.sessionStorage.setItem('liwaUserIconPath', "")
		window.localStorage.setItem('liwaJWT', '')
		window.location.href="/"		
		// let sSiteID = window.sessionStorage.getItem('liwaSiteID')
		// if (sSiteID !== 'sys') {
		// 	window.sessionStorage.setItem('liwaSiteIcon', "")
		// 	window.sessionStorage.setItem('liwaSiteName', 'Liwasite')
		// 	window.sessionStorage.setItem('liwaAuth', "")
		// 	window.sessionStorage.setItem('liwaSiteID', 'sys')
		// 	window.location.href="/Profile"
		// } else {
		// 	window.sessionStorage.setItem('liwaUserID', "")
		// 	window.sessionStorage.setItem('liwaUserName', "")
		// 	window.sessionStorage.setItem('liwaUserIconPath', "")
		// 	window.sessionStorage.setItem('liwaImgsvr', "")
		// 	window.sessionStorage.setItem('liwaAPIsvr', "")
		// 	window.localStorage.setItem('liwaJWT', '')
		// 	window.location.href="/"
		// }		
	}

	const goLink = () => {
		// let AA = (siteID.value == 'sys')? '/': '/A03'
		return (siteID.value == 'sys')? '/': '/A03'
	}

	const goProfile = () => {
		window.location.href='/Profile'
	}
	
	onMounted(() => {
		// 若無 APIsvr & Imgsvr, 從 init.json取得
		let sAPIsvr = window.sessionStorage.getItem('liwaAPIsvr')
		if ((sAPIsvr == undefined) || (sAPIsvr == "") || (sAPIsvr == null)) {
				window.sessionStorage.setItem('liwaAPIsvr', jsonData[0].APIsvr)
				window.sessionStorage.setItem('liwaImgsvr', jsonData[0].imgSvr)
		}
		// 取得 siteIcon, siteName from composables程式
		getSiteInfo()
		// 檢查是否已登入?(sessionStorage(liwa_JWT))	
    	let sJWT = window.localStorage.getItem('liwaJWT')
    	if (sJWT) {
    		bLogin.value = true
    		let sUrl = route.fullPath
    		let arrUrl = sUrl.split("/")
    		let progID = arrUrl[1]
			// 判斷 userAuth > progAuth <-- 從composables 取得
			useChkauth(progID).then(res => {
				let msg = JSON.parse(res.value).message
				if (msg) window.location.href = msg
			})
	        usegetJWT().then(res => {
	          let tmp = JSON.parse(res.value).message
	          let arrJWT = JSON.parse(tmp)
	          console.log('arrJWT =', arrJWT)
	          // 取得 liwaIconPath (使用者圖檔)
	          userIcon.value = arrJWT.iconPath        
	        })			
			// let arrJWT = jwtDecode(sJWT)
			// 取得 liwaIconPath (使用者圖檔)
    		// userIcon.value = arrJWT.iconPath
    	}
	})
</script>

<template>
	<div class="headPanel w-full h-32 md:h-[4.5rem] bg-gradient-to-r from-indigo-900 to-violet-200 flex flex-col md:flex-row justify-center">
		<div class="logoPanel w-full pt-2 pl-3 md:w-[calc(100%_-_240px)]">
			<div class="w-[60px] float-left ring-1 ring-white rounded-sm bg-white mr-2 mt-1">
				<a :href="goLink()">
					<img :src="siteIcon" alt="logo of liwasite" class="mx-auto" width="50"/>
				</a>
			</div>
			<div class="float-left">
				<h1 class="text-4xl text-white pt-2">{{ siteName }}雲系統</h1>
			</div>
		</div>
		<div class="w-full md:float-right md:w-[240px]">
			<div v-if="bLogin" class="w-full flex flex-row-reverse justify-between mx-auto">
				<div class="sysIcon logout mx-1 mt-1" @click.prevent="logout()">
					<svg width="40px" height="40px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" style="margin-top:5px;">
					  <g style="fill:none;stroke:#AE0100;stroke-width:12px;stroke-linecap:round;stroke-linejoin:round;">
					    <path d="m 50,10 0,35"/>
					    <path d="M 26,20 C -3,48 16,90 51,90 79,90 89,67 89,52 89,37 81,26 74,20"/>
					  </g>
					</svg>					
				</div>
				<a :href="jumpPage()">
					<div class="sysIcon help mx-1 mt-1">
						<IconQuestionCircleFill class="w-7 h-7 text-red-500 font-bold" />
					</div>
				</a>
				<div class="sysIcon search mx-1 mt-3">
					<IconSearch class="w-7 h-7 text-black font-bold" />
				</div>
				<div v-if="bIcon" class="sysIcon userIcon mx-1 mt-2" @click="goProfile()">
					<img :src="userIcon" width="42" height="42" />
				</div>
				<div v-else class="sysIcon userIcon mx-1 mt-2" @click="goProfile()">
					<IconPersonFill class="w-7 h-7 text-orange-400 font-bold" />
				</div>
			</div>
			<div v-else class="mt-3">
				<a href="/login">
					<div class="sysIcon login w-[80px]">登入</div>
				</a>
				<a href="/regis">
					<div class="sysIcon regis w-[80px]">註冊</div>
				</a>
			</div>
		</div>
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
</style>