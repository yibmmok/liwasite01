<script setup lang="ts">
	/*********************************************************
	prog name: 關於我們, author: James Lin, date: 2022/12/31
	To Do: 缺內容
	**********************************************************/
	import { ref, onMounted } from "vue"
	import { useFetch } from "@vueuse/core"
	import queryString from "query-string"

	const APIsvr = ref('')
	const liwaData = ref([])

	const loadData = async () => {
		let keydata = {
			'mainID': 'BargainInfo'
		}
		let sQuery = queryString.stringify(keydata)	
		let url = `${APIsvr.value}/WPages_haveDetail.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL[0]	
	}

	onMounted(() => {
		useHead({title:'斡旋須知'})
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		loadData()
	})

	// definePageMeta({
	//   layout: "web",
	//   colorMode: "light"
	// })		

</script>

<template>
<NuxtLayout name="web">		
	<div class="w-full lg:w-[900px] mx-auto my-4">
		<h1 class="w-full text-5xl text-sky-500 text-center underline underline-offset-8 mb-2">斡旋須知</h1>
		<p class="my-4">以下說明會員進行斡旋時的步驟, 您可以觀看影片, 或是閱讀本平台的說明。</p>
		<iframe width="560" height="315" src="https://www.youtube.com/embed/4qVdCjSgjvk?si=EJogU5YXpoyBzYOk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
		<div class="w-full mt-4" v-html="liwaData.sContent"></div>
	</div>
</NuxtLayout>
</template>

<style scope>
	h2 {
		font-size:2rem;
		font-weight: bold;
		margin: 1rem 0;
	}
</style>