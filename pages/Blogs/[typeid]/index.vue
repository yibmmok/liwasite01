<script setup lang="ts">
	/*********************************************************
	prog name: 部落格文章列表, author: James Lin, date: 2022/09/07
	Todo: 
	**********************************************************/
	// import { ref, onMounted } from "vue"
	import { useFetch, createFetch, useTitle } from "@vueuse/core"
	// import banner from "../../components/banner"
	// import liwaPages from "../../components/liwaPages"
	import queryString from "query-string"
	import { IconX, IconHouseFill } from '@iconify-prerendered/vue-bi'

	const proglink = ref('/Blogs')
	const APIsvr = ref('')
	const liwaData = ref([])

	const mainID = ref('')
	const itemType = ref('')
	const page = ref(1)
	const pageSize = ref(10)
	const totalPage = ref(1)	

	const setMain = (sID) => {
		window.location.href = `${proglink.value}/${mainID.value}/${sID}`
	}

	const setActvPage = (iPage) => {
		page.value = iPage
		loadData()
	}	

	const loadData = async () => {
		let keydata = {
			'itemTypeID':mainID.value,
			'page': page.value,
			'limit': 10
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/Blogs_M.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL
		// liwaFilter.value = [...liwaData.value]
		totalPage.value = data.data.value.totalPage	
	}

	const goBlogHome = () => {
		window.location.href = proglink.value
	}

	const getItemType = async () => {
		let keydata = {
			'itemTypeID':mainID.value,
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/Blogs_haveItemType.php?itemTypeID=${mainID.value}`
		const dataType = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()		
		itemType.value = dataType.data.value.key
		useHead({ title:`${itemType.value}文章列表` })
	}

	onMounted(() => {
		const route = useRoute()
		console.log('params =', route.params)
		const { typeid } = route.params	
		mainID.value = route.params.typeid	
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		getItemType()		
		// console.log('typeID =', typeid.valu)
		loadData()
	})

	// definePageMeta({
	// 	colorMode:'light',
	// 	layout: "web",
	// })	
</script>

<template>	
<NuxtLayout name="web">		
	<div class="w-full lg:min-h-[calc(100vh_-_7.15rem)] py-2 ">
		<div class="w-full bg-yellow-700 text-white">
			<div class="w-full lg:w-[900px] lg:mx-auto py-2">
				<div v-if="itemType!==''" class="w-full h-12 flex flex-row justify-start py-2">
					<div class="top-icon ml-4 mt-0 bg-yellow-700" @click="goBlogHome()">
						<IconHouseFill class="w-7 h-7 text-white font-bold" />
					</div>
					<div class="text-white text-2xl mr-4" >&gt;</div>
					<div class="text-white text-lg mr-4">
						{{ itemType }}
					</div>					
				</div>				
			</div>
		</div>	
		<div class="w-full lg:w-[900px] lg:mx-auto -mt-2 mb-4 overflow-x-hidden overflow-y-auto">
			<div v-if="liwaData.length > 0" class="w-full">
				<div v-for="(post, index) in liwaData" :key="post.mainID" class="w-full flex flex-col" @click="setMain(post.mainID)">
					<div v-if="index==0" class="flex flex-col lg:flex-row py-4 border-b-2 border-b-slate-400 border-dashed cursor-pointer">
						<div class="w-full lg:w-1/3 p-8">
							<img :src="post.picpath" :alt="post.altName">
						</div>			
						<div class="w-full lg:w-2/3 py-8 px-2">
							<h1 class="w-full text-2xl font-bold">{{ post.title }}</h1>
							<p class="w-full whitespace-normal overflow-hidden text-ellipsis text-stone-400 pt-4 pb-20">{{ post.altName }}</p>
							<div class="text-slate-400 text-md">{{ post.pDate }}</div>
						</div>						
					</div>
					<div v-else class="flex flex-col lg:flex-row py-4 border-y-2 border-y-slate-400 border-dashed cursor-pointer">
						<div class="w-full lg:w-1/3 p-8">
							<img :src="post.picpath" :alt="post.altName">
						</div>			
						<div class="w-full lg:w-2/3 py-8 px-2">
							<h1 class="w-full text-2xl font-bold">{{ post.title }}</h1>
							<p class="w-full whitespace-normal overflow-hidden text-ellipsis text-stone-400 pt-4 pb-20">{{ post.altName }}</p>
							<div class="text-slate-400 text-md">{{ post.pDate }}</div>
						</div>							
					</div>
				</div>					
			</div>		
			<div v-else class="w-full h-[calc(100vh_-_19rem)] mx-auto my-0 pt-48">
				<div class="w-full text-center text-3xl font-semibold">暫無文章 | 文章載入中 </div>
			</div>		
		</div>
		<liwaPages
			:page="page"
			:totalPage="totalPage"
			@setActvPage="setActvPage"
		></liwaPages>	
	</div> 
</NuxtLayout>	
</template>

<style scope>

</style>