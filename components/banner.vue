<script setup lang="ts">
	import { ref, reactive } from "vue"

	const props = defineProps({
	  gemSysNM: {
	  	type: String,
	  	default: ''
	  },
	  gemSyslink: {
	  	type: String,
	  	default: ''
	  },
	  isSearch: {
	  	type: Boolean,
	  	default: false
	  },
	  detailFlg: {
	  	type: Boolean,
	  	default: false
	  },  
	  detailNM: {
	    type: String,
	    default: ''
	  },
	  isBanner: {
	  	type: Boolean,
	  	default: true
	  }
	})

	const state = reactive({
	  gemSysNM: props.gemSysNM,
	  gemSyslink: props.gemSyslink,
	  isSearch: props.isSearch,
	  detailFlg: props.detailFlg,
	  detailNM: props.detailNM,
	  isBanner: props.isBanner
	})
	console.log('isSearch =', state.isSearch)
</script>

<template>
<div class="w-full h-16 relative bg-black text-white">
	<div v-if="state.isBanner" class="w-full bg-transparent flex flex-row">
		<a href="/Products?imode=31"><div class="py-3 mx-0 lg:mx-2 mt-1 text-lg cursor-pointer">全館</div></a>
		<div class="text-2xl mx-1 lg:mx-2 mt-3" >&gt;</div>
		<div v-if="state.isSearch==true" class="py-3 mx-0 lg:mx-2 mt-1 text-lg">查詢結果</div>
		<div v-else class="py-3 mx-0 lg:mx-2 mt-1 text-lg cursor-pointer"><a :href="state.gemSyslink">{{ state.gemSysNM }}</a></div>
		<div v-if="state.detailFlg" class="max-w-[70%] py-3 flex flex-row">
			<div class="mx-1 lg:mr-2 text-2xl" >&gt;</div>
			<div class="mx-2 mt-1 text-lg overflow-x-hidden whitespace-nowrap text-ellipsis">{{ state.detailNM }}</div>
		</div>
	</div>
	<div v-else class="w-full py-4 bg-transparent flex flex-row">
		<a href="/Products?imode=31"><div class="mx-2 cursor-pointer">全館</div></a>
		<a href="/Products?imode=32"><div class="mx-2 cursor-pointer">鑽石館</div></a>
		<a href="/Products?imode=33"><div class="mx-2 cursor-pointer">彩寶館</div></a>
		<a href="/Products?imode=34"><div class="mx-2 cursor-pointer">翡翠館</div></a>
		<a href="/Products?imode=35"><div class="mx-2 cursor-pointer">軟玉館</div></a>
	</div>
</div>
</template>