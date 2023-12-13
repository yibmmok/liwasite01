<script setup lang="ts">
	/*********************************************************
	prog name: 物件列表, author: James Lin, date: 2022/09/01
	Todo: 1. 串資料庫 
		  2. 
	**********************************************************/
	import { ref, onMounted } from "vue"
	import { useFetch, createFetch, useTitle } from "@vueuse/core"
	import queryString from "query-string"
	import banner from "../../components/banner"
	import liwaMsg from "../../components/liwaMsg.vue"
	import liwaPages from "../../components/liwaPages"
	import liwaTbl from "../../components/liwaTbl"
	import liwaRating from "../../components/liwaRating"
	import useThousandSep from "../../composables/use-ThousandSep.js"
	import { IconHeart, IconHeartFill, IconGrid, IconList } from '@iconify-prerendered/vue-bi'
	import { IconFilter } from '@iconify-prerendered/vue-mi'

	const route = useRoute()
	// banner starts
	const gemSysNM = ref('')
	const gemSyslink = ref('')
	const detailNM = ref('')
	const detailFlg = ref(false)
	const isSearch = ref(false)
	const isBanner = ref(false)
	// banner ends
	const error = ref('')
	const paramstr = ref('')
	const searchString = ref('')
	const Searchsvr = ref('')
	const APIsvr = ref('')
	const liwaData = ref([])
	const liwaFilter = ref([])
	const page = ref(1)
	const pageSize = ref(15)
	const totalPage = ref(1)
	const isFilter = ref(false)
	const isGrid = ref(true)
	const resultMsg = ref('')

	const loadData = async (sParam) => {
		// let sParam1='imode=7&page=1&pagesize=10'
		let objParam = queryString.parse(sParam)
		let ipage = (objParam.page)? objParam.page: page.value
		let ipagesize = (objParam.pagesize)? objParam.pagesize: pageSize.value
		let skey = Object.entries(objParam)[0][0]
		let sValue = Object.entries(objParam)[0][1]
		let nuParamstr = ''
		switch (skey) {
			case 'keyword':	
				isSearch.value = true	
				isBanner.value = true
				searchString.value = skey+'='+sValue
				let url = `${Searchsvr.value}/search?${searchString.value}`
				const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
				let arrIDs = data.data.value
				let iLength = arrIDs.length
				let sTmp = ''
				for (let i=0; i<iLength;i++) {
					if (i==iLength-1) sTmp += arrIDs[i]
					else sTmp += arrIDs[i]+'+'
				}
				let keyworddata = {
					'keyword':sTmp
				}
				nuParamstr = JSON.stringify(keyworddata)
				break
			case 'memberID':
				isSearch.value = false
				isBanner.value = true
				gemSysNM.value = sValue
				let memberdata = {}
				memberdata[skey] = sValue			
				nuParamstr = JSON.stringify(memberdata)				
				break
			default:
				if((sParam) && (sParam!=='imode=31')) {
					isBanner.value = true
				} 
				let paramdata = {}
				paramdata[skey] = sValue			
				nuParamstr = JSON.stringify(paramdata)
		}
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT'),
			'param': nuParamstr,
			'page': ipage,
			'pageSize':ipagesize
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/w021_havelist.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL
		if (liwaData.value.length == 0) {
			resultMsg.value = '尚無物件'
		} else {
			totalPage.value = data.data.value.totalPage
			if (!gemSysNM.value) {
				switch(liwaData.value[0].gemSys) {
					case 'A':
						gemSysNM.value = '鑽石館'
						gemSyslink.value = '/Products?imode=32'
						break;
					case 'B':
						gemSysNM.value = '彩寶館'
						gemSyslink.value = '/Products?imode=33'
						break;
					case 'C':
						gemSysNM.value = '翡翠館'
						gemSyslink.value = '/Products?imode=34'
						break;
					case 'D':
						gemSysNM.value = '軟玉館'
						gemSyslink.value = '/Products?imode=35'
						break;				
				}			
			}
			resultMsg.value = ''
			liwaFilter.value = [...liwaData.value]
		}
	}

	const setActvPage = (iPage) => {
		page.value = iPage
		loadData(paramstr.value)
	}	

	const setMainID = (sID) => {
		window.location.href = '/Products/' + sID
	}

	const setLike = async (idx) => {
		let iIsLike = liwaData.value[idx].isLike
		if (iIsLike == 0) liwaData.value[idx].isLike = 1
		else liwaData.value[idx].isLike = 0
		let sJWT = window.localStorage.getItem('liwaJWT')
		if (!sJWT) {
			// 未登入先設liwaNowLink, 再導到 login頁面
			window.sessionStorage.setItem('liwaNowLink', route.fullPath)
			window.location.href = '/login'
		} else {
			// 已登入可以設定收藏
			let keyData = {
				'JWT':sJWT,
				'mainID':liwaData.value[idx].prodID,
				'isLike': liwaData.value[idx].isLike
			}		
			let datastr = JSON.stringify(keyData)	
		    const useMyFetch = createFetch({
		      baseUrl: APIsvr.value,
		      fetchOptions: {
		        mode: 'cors',
		        headers: new Headers({
		          'Content-Type': 'multipart/form-data'
		        }),
		        body: datastr
		      }
		    })
		    const { data } = await useMyFetch('w041_setD1.php').post().json()
		    let msg = data.value.message
		    
		    if (msg) {
		    	// 顯示錯誤訊息
		    	showMsg('系統訊息', msg, 2)
		    } 			
		}
	}

	// 訊息對話盒相關 starts
	const objMsg = ref({
		title: '',
		body: '',
		modalType: ''
	})
	
	const showMsg = (sTitle, sBody, iType = 1) => {
  		objMsg.value.title = sTitle
  		objMsg.value.body = sBody
  		objMsg.value.modalType = iType
  		isMsg.value = true
	}

	const hideMsg = () => {
		isMsg.value = false
	}

	const confirmOK = () => {
		alert("Press the Confirm button")
		isMsg.value = false
	}
	// 設定對話盒相關 ends		

	onMounted(() => {	
		useHead({title:'物件列表'})
		let sUrl = route.fullPath
		let arrParam = sUrl.split('?')
		paramstr.value = arrParam[1]	
		resultMsg.value = '資料載入中, 請稍候'
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		Searchsvr.value = window.sessionStorage.getItem('liwaSearchsvr')
		loadData(paramstr.value)
	})

	// definePageMeta({
	//   layout: "web",
	//   colorMode: "light",
	// })	
	
</script>

<template>
<NuxtLayout name="web">		
<div v-if="liwaFilter.length == 0" class="w-full h-[100vh] bg-white absolute top-[148px] lg:top-[100px] left-0 z-50">
	<div class="w-48 mx-auto pt-[45vh] text-4xl text-black">{{ resultMsg }}</div>
</div>
<div v-else class="w-full -mt-1">
	<banner
		:gemSysNM="gemSysNM"
		:gemSyslink="gemSyslink"
		:isSearch="isSearch"
		:detailFlg="detailFlg"
		:detailNM="detailNM"
		:isBanner="isBanner"
	></banner>
	<div v-if="error" class="w-full h-[100vh] text-center text-3xl font-semibold">{{ error }}</div>
	<div class="w-full lg:w-[calc(100%_-_4rem)] mx-auto py-2 flex flex-col">
		<div class="w-full h-12 bg-transparent flex flex-row justify-end">
			<div class="hidden lg:block mr-32 py-2" @click="isGrid=!isGrid">
				<div v-if="isGrid" class="w-6 h-6">
					<IconList class="w-6 h-6 text-slate-400 font-light" />
				</div>
				<div v-else class="w-6 h-6">				
					<IconGrid class="w-6 h-6 text-slate-400 font-light" />
				</div>			
			</div>
		</div>
		<div v-if="liwaFilter.length > 0" class="w-full mx-0 px-0 lg:px-12 my-0 relative p-4"
		>
			<div v-if="isGrid" class="flex flex-row flex-wrap overflow-y-auto">
				<div v-for="(item, index) in liwaFilter" :key="index" class="w-72 bg-slate-100 flex flex-col mb-8 mx-6 cursor-pointer"
				@click="setMainID(item.prodID)"
				>
					<div class="w-full ">
						<picture>
							<source media="(min-width: 1024px)" :srcset="item.picpath">
							<source media="(min-width: 768px)" :srcset="item.picpath_sm">
							<img :src="item.picpath_sm" class="mx-auto" :alt="item.prodNM"/>
						</picture>
					</div>	
					<div class="w-full p-2">
						<h6 class="w-full text-sm text-slate-500">物件編號:{{ item.prodID }}</h6>
						<h1 class="w-full text-lg text-blue-700 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">({{ item.score }}){{ item.prodNM }}</h1>
						<h4 class="w-full text-md text-slate-600 mt-1">期望售價: NT$ {{ useThousandSep(item.sellPrice) }}</h4>
						<div class="w-full text-md text-slate-600 mt-1">已出價: {{ item.bidCount }}</div>
						<div class="w-full flex flex-row justify-between mt-4">
							<div v-if="item.status==2" class="w-2/4 text-red-600 font-bold text-center">斡旋中</div>
							<div v-else class="w-3/4 text-red-600 font-bold text-left text-sm">刊登到期日:{{ item.expDate }}</div>
							<div class="w-1/4 flex flex-row-reverse" @click.stop="setLike(index)">
								<!-- 若未登入, 跳到登入畫面, 若已登入, 設定收藏值 -->
								<IconHeart v-if="item.isLike == 0" class="w-7 h-7 text-red-400 font-bold" />
								<IconHeartFill v-else class="w-7 h-7 text-red-400 font-bold" />
							</div>
						</div>
						<div class="w-full flex flex-row">
							<div class="p-2 bg-slate-900 text-white text-xs">推薦指數</div>
							<liwaRating
								:starClass="'w-4 h-4 mx-1 text-orange-500'"
								:points="item.stars"
							/>
						</div>
					</div>		
				</div>					
			</div>
			<div v-else class="w-full py-8 flex flex-col overflow-y-auto">
				<div v-for="(item, index) in liwaFilter" :key="index" class="w-full bg-gray-100 flex flex-col mb-8 lg:mb-0 lg:flex-row px-0 lg:px-6 py-4 border-b-2 border-b-slate-300 cursor-pointer"
				@click="setMainID(item.prodID)"
				>
					<div class="w-full lg:w-3/4 px-2 py-4 flex flex-col lg:flex-row">
						<div class="w-full lg:w-1/3">
							<div class="w-[300px] mx-auto py-4">
								<picture>
									<source media="(min-width: 1024px)" :srcset="item.picpath">
									<source media="(min-width: 768px)" :srcset="item.picpath_sm">
									<img :src="item.picpath_sm" class="mx-auto" height="256" :alt="item.prodNM"/>
								</picture>
							</div>								
						</div>
						<div class="w-full lg:w-2/3 pt-6 flex flex-col">
							<div class="w-full py-2 text-sm text-slate-500">物件編號:{{ item.prodID }}</div>
							<div class="w-full py-2 text-lg text-blue-700 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">({{ item.score }}){{ item.prodNM }}</div>
							<div v-html="item.descp" class="hidden lg:block w-full py-4 text-md"></div>
						</div>
					</div>
					<div class="w-full lg:w-1/4 px-2 pt-8 lg:border-l-2 lg:border-l-slate-300">
						<h4 class="w-full py-2 text-md text-slate-600 mt-1">期望售價: NT$ {{ useThousandSep(item.sellPrice) }}</h4>
						<div class="w-full py-2 text-md text-slate-600 mt-1">已出價: {{ item.bidCount }}</div>
						<div class="w-full flex py-2 flex-row justify-between mt-1">
							<div v-if="item.status==2" class="w-2/4 text-red-600 font-bold text-center">斡旋中</div>
							<div v-else class="w-3/4 text-red-600 font-bold text-left text-sm">刊登到期日: {{ item.expDate }}</div>
							<div class="w-1/4 flex flex-row-reverse" @click.stop="setLike(index)">
								<!-- 若未登入, 跳到登入畫面, 若已登入, 設定收藏值 -->
								<IconHeart v-if="item.isLike == 0" class="w-7 h-7 text-red-400 font-bold" />
								<IconHeartFill v-else class="w-7 h-7 text-red-400 font-bold" />
							</div>
						</div>
						<div class="w-full flex flex-row">
							<div class="p-2 bg-slate-900 text-white text-xs">推薦指數</div>
							<liwaRating
								:starClass="'w-4 h-4 mx-1 text-orange-500'"
								:points="item.stars"
							/>
						</div>						
					</div>
				</div>
			</div>
			<div v-if="liwaData.length > 0" class="w-full bg-white px-4 py-2">
				<!-- 頁碼控制 -->
				<liwaPages
					:page="page"
					:totalPage="totalPage"
					@setActvPage="setActvPage"
				></liwaPages>	
			</div>		
		</div>
		<div v-else class="w-full lg:w-[1024px] h-[calc(100vh_-_7.5rem)] mx-auto my-0 pt-48">
			<div class="w-full text-center text-3xl font-semibold">暫無物件</div>
		</div>		
	</div>	
</div>
<teleport to="body">
	<div
		v-if="isMsg" 
		class="w-full h-full absolute top-[200px] left-0 bg-slate-100 z-[500]"
	>
		<liwaMsg 
		  	:msgTitle="objMsg.title"
		  	:msgBody="objMsg.body"
		  	:modalType="objMsg.modalType"
		  	@hideMsg="hideMsg"
		  	@confirmOK="confirmOK"
		/> 			
	</div>		
</teleport>	
</NuxtLayout>
</template>

<style scope>
	.btnItemType:hover {
		color:#FF9933;
	}
</style>