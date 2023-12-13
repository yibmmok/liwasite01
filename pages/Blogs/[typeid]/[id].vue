<script setup lang="ts">
	/*********************************************************
	prog name: 部落格文章列表, author: James Lin, date: 2022/09/07
	**********************************************************/
	import { ref, onMounted } from "vue"
	import { useFetch, createFetch, useTitle } from "@vueuse/core"
	import { IconFacebook, IconLine, IconLink45deg } from "@iconify-prerendered/vue-bi"
	import { copyText } from "vue3-clipboard"
	import queryString from "query-string"
	import { IconX, IconHouseFill } from '@iconify-prerendered/vue-bi'

	const mainID = ref('')	
	const typeID = ref('')
	const APIsvr = ref('')
	const fullPath = ref('')
	const stitle = ref('')
	const descp = ref('')
	const liwaData = ref([])
	const route = useRoute()

	const loadData = async () => {
		let keydata = {
			'mainID': mainID.value
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/Blogs_haveDetail.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL[0]
	console.log('liwaData =', liwaData.value)
		stitle.value = liwaData.value.title
		useHead({title:liwaData.value.title})
		descp.value = liwaData.value.altName
	}

	const doCopy = () => {
		// 將 path 寫入 clipboard內
		copyText(fullPath.value, undefined, (error, event) => {
			if (error) {
				// 若複製失敗, 顯示錯誤訊息
				console.log('error =', error)
			} 
		})
	}

	const shareOnLINE = () => {
      const urlToShare = fullPath.value; // 將這裡替換為你想分享的網頁連結
      const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(urlToShare)}&text=${encodeURIComponent(stitle.value + " - " + descp.value)}`;
      window.open(lineShareUrl, "_blank");		
	}

	const shareOnFacebook = () => {
      const urlToShare = fullPath.value; // 將這裡替換為你想分享的網頁連結
      const facebookAppId = "127440291228313"; // 請替換為你的Facebook App ID
      const facebookShareUrl = `https://www.facebook.com/dialog/share?app_id=${facebookAppId}&href=${encodeURIComponent(urlToShare)}&quote=${encodeURIComponent(stitle.value)}&description=${encodeURIComponent(descp.value)}`;
      window.open(facebookShareUrl, "_blank");
	}	

	const goBlogHome = () => {
		window.location.href = `/Blogs`
	}	

	const goBlogType = () => {
		window.location.href = `/Blogs/${liwaData.value.itemTypeID}`
	}

	onMounted(() => {
		mainID.value = route.params.id
		typeID.value = route.params.typeid
		fullPath.value = route.fullPath
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		fullPath.value = 'https://www.jewelrytrade.center' + fullPath.value
		loadData()
	})

	// definePageMeta({
	//   layout: "web",
	//   colorMode: "light"
	// })		
</script>

<template>
<NuxtLayout name="web">		
	<div class="w-full bg-yellow-700 text-white">
		<div class="w-full lg:w-[900px] lg:mx-auto py-2 pl-12">
			<div v-if="stitle" class="w-full h-12 flex flex-row justify-start py-2">
				<div class="top-icon ml-4 mt-0 bg-yellow-700 cursor-pointer" @click="goBlogHome()">
					<IconHouseFill class="w-7 h-7 text-white font-bold" />
				</div>
				<div class="text-white text-2xl mr-4" >&gt;</div>
				<div class="text-white text-lg mr-4 cursor-pointer" @click="goBlogType()">
					{{ liwaData.itemType }}
				</div>	
				<div class="text-white text-2xl mr-4" >&gt;</div>
				<div class="text-white text-lg mr-4 cursor-pointer">
					{{ liwaData.title }}
				</div>				
			</div>				
		</div>
	</div>		
	<div class="w-full lg:w-[760px] lg:max-w-[760px] mx-auto my-0">
		<h1 class="w-full text-4xl font-bold mt-8">{{ liwaData.title }}</h1>
		<div class="w-full flex flex-row">
			<div class="w-2/3 mt-4 pt-1">{{ liwaData.author }}/{{ liwaData.unit }}</div>
			<div class="w-1/3 mt-4 flex flex-row-reverse justify-start">
				<!-- 連結分享 -->
				<div class="w-8 h-8 ml-2 cursor-pointer" @click="doCopy()">
					<IconLink45deg class="w-8 h-8 text-slate-500" />
				</div>
				<!-- 社交媒體分享 -->
				<div class="w-8 h-8 rounded bg-black ml-2 pt-[.125rem]" @click="shareOnLINE()">
					<IconLine class="w-8 h-8 text-slate-50" />
				</div>
				<div class="w-8 h-8 rounded bg-black pt-[.125rem] pl-[.125rem]" @click="shareOnFacebook()">
					<IconFacebook class="w-7 h-7 text-sm text-white" />
				</div>	
			</div>
		</div>
		<div class="w-full mt-4 text-slate-400">{{ liwaData.pDate }}</div>
		<div class="mainbox w-full mt-4 mb-32">
			<div v-html="liwaData.sContent">
			</div>
		</div>
	</div>
</NuxtLayout>	
</template>

<style scope>
	.mainbox p
	{
		color:#6d6d6d;
		font-size:1.2rem;
		line-height:1.8rem;
		margin:1rem 0;
		letter-spacing:0.15rem;
	}

	ol
	{
		list-style-type:decimal;
		margin-left: 2rem;
	}

	ol>li
	{
		color:#6d6d6d;
		font-size:1.2rem;
		line-height:1.8rem;
		margin:1rem 0;
		letter-spacing:0.15rem;
	}
</style>