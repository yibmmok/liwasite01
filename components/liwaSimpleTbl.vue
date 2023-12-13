<script setup lang="ts">
	/*********************************************************
	prog name: 單欄列表元件, author: James Lin, date: 2022/12/06
	Descp: 單欄列表元素處理
	Note: 所有傳入 liwaData的資料, 最後都要加上slink 欄位, 
		  若該儲存格要設超連結, 在slink 欄位設定 route path
	**********************************************************/	
	import { ref, reactive, onMounted } from "vue"
	import { useFetch, createFetch } from "@vueuse/core"
	import queryString from "query-string"
	import { IconCaretDownFill, IconCaretUpFill  } from '@iconify-prerendered/vue-bi'

	const props = defineProps({
		tblTitle: {
			type: String,
			required: true,
			default:''
		},
		headUrl: {
			type: String,
			required: true,
			default: ''
		},	
		progID: {
			type: String,
			required: true,
			default: ''
		},	
		dataUrl: {
			type: String,
			required: true,
			default: ''
		}
	})

	const emits = defineEmits(["setList"])
	const route = useRoute()
	const liwaData = ref([])
	const liwaHead = ref([])
	const sortIndex = ref(0)	
	const APIsvr = ref('')

	const state = reactive({
		'tblTitle': props.tblTitle,
		'headUrl': props.headUrl,
		'progID':props.progID,
		'dataUrl': props.dataUrl
	})

	const loadData = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT')
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/${state.dataUrl}?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL
	}

	const loadHead = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT'),
			'progID':state.progID
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/${state.headUrl}?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()	
		liwaHead.value = data.data.value.arrSQL
		liwaHead.value.forEach((m) => m.sort = 0)	
	}

	const setOrder = (idx) => {
		// 用來對liwaData的資料排序
		// 若 sortIndex == idx, 直接排序, 若否, 先將所有欄位 sort設為0
		if (idx !== sortIndex.value) {
			liwaHead.value.forEach((m) => m.sort = 0)
		}
		let iSort = liwaHead.value[idx].sort
		if (iSort < 2) {
			liwaData.value.sort((a, b) => { 
				if (Object.values(b)[idx] < Object.values(a)[idx]) return -1
			})	
			iSort = 2
		} else {
			liwaData.value.sort((a, b) => { 
				if (Object.values(a)[idx] < Object.values(b)[idx]) return -1
			})		
			iSort --
		}
		liwaHead.value[idx].sort = iSort
		sortIndex.value = idx
	}

	onMounted(() => {
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		loadHead()
		loadData()
	})		

</script>

<template>
<div class="w-full h-full mt-2 border-2 border-gray-200">
	<div class="w-full h-12 pt-3 text-white text-center bg-emerald-400">{{ tblTitle }}</div>
	<table class="min-w-full divide-x divide-y divide-gray-200 bg-white">
		<thead class="w-full bg-white ring-1 ring-gray-200">
			<tr class="bg-gray-50 h-12">
				<th v-for="(item, index) in liwaHead" class="thPanel relative" :class="item.headCSS">
					<div class="w-[calc(100%_-_2rem)]" @click="setOrder(index)">
						{{ item.colNM }}
					</div>
					<div v-if="item.sort > 0" class="w-8 ml-12">
		        		<div v-if="item.sort==1">
		        			<!-- 昇冪排列 -->
		        			<IconCaretUpFill class="w-7 h-7 absolute right-1 top-3 text-amber-300 font-bold" />
		        		</div>
		        		<div v-if="item.sort==2">
		        			<!-- 降冪排列 -->
		        			<IconCaretDownFill class="w-7 h-7 absolute right-1 top-3 text-amber-300 font-bold" />
		        		</div>
					</div>						
				</th>
			</tr>
		</thead>
		<tbody class="w-full bg-white ring-1 ring-gray-200 overflow-x-hidden overflow-y-auto">
			<tr 
				class="odd:bg-white even:bg-slate-200"
				v-for="(object, index) in liwaData"
				:key="index"
			>
				<td scope="col" class="py-3 border-b order-gray-300 text-sm font-medium text-gray-500 uppercase tracking-wider" :class="liwaHead[index1-1].headCSS" v-for="index1 in liwaHead.length">
					<div v-if="object.slink" :class="liwaHead[index1-1].bodyCSS"><NuxtLink :to="object.slink" target="_self">{{ Object.values(object)[index1-1] }}</NuxtLink></div>
					<div v-else :class="liwaHead[index1-1].bodyCSS">{{ Object.values(object)[index1-1] }}</div>					
				</td>
			</tr>
		</tbody>
	</table>
</div>
</template>