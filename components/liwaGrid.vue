<script setup lang="ts">
	/*********************************************************
	prog name: LiwaGrid元件, author: James Lin, date: 2022/12/06
	Descp: 資料列表顯示, 換頁及刪除
	Note: 元件外應設定
		變數: params, isGrid(true), isFilter, filters(設給 params) 
		函數: toggleFilter, goSearch, sendMsg(emit), setMainID(emit:link明細頁/開啟搜尋)
		PHP程式: 參考 021_havelist.php
	**********************************************************/	
	import { ref, reactive, onMounted } from "vue"
	import { useFetch, createFetch } from "@vueuse/core"
	import queryString from "query-string"
	import useShowmode from "../composables/use-showmode"
	import liwaPages from "./liwaPages"
	import { IconPlusLg, IconSearch, IconTrash, IconCheck, IconCheckSquare, IconDash, IconX, IconCaretDownFill, IconCaretUpFill } from '@iconify-prerendered/vue-bi'

	const props = defineProps({
		tblTitle: {
			type: String,
			required: true,
			default:''
		},
		progID: {
			type: String,
			required: true,
			default: ''
		},	
		viewUrl: {
			type: String,
			default: ''
		},	
		dataUrl: {
			type: String,
			required: true,
			default: ''
		},				
		params: {
			type:String,
			default: ''
		},
		page: {
			type: Number,
			default:1
		},
		pageSize: {
			type: Number,
			default: 10
		},
		showBtns: {
			type: Boolean,
			default: true
		}
	})

	const emits = defineEmits(["sendMsg", "setMainID", "setChecked"])
	
	const liwaData = ref([])
	const liwaHead = ref([])
	const liwaObject = ref({})
	const mainID = ref('')

	const orderCol = ref('')
	const sortIndex = ref(0)
	const sortDir = ref('asc')
	const arrChklist = ref([])
	const isChkAllMode = ref(-1)

	const paramstr = ref('')
	const action = ref('view')
	const totalPage = ref(1)
	
	const APIsvr = ref('')
	const Imgsvr = ref('')
	const route = useRoute()

	const state = reactive({
		'tblTitle': props.tblTitle,
		'progID':props.progID,
		'viewUrl': props.viewUrl,
		'dataUrl': props.dataUrl,
		'params': props.params,
		'page': props.page,
		'pageSize': props.pageSize,
		'showBtns': props.showBtns
	})

	const loadData = async () => {
		if (liwaData.value.length) liwaData.value = []
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT'),
			'params': paramstr.value,
			'page':state.page,
			'pageSize':state.pageSize,
			'orderCol': orderCol.value,
			'sortDir': sortDir.value,
			'action':'view'
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/${state.viewUrl}?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
	    if (data.data.value.arrSQL.length > 0) {
			liwaData.value = data.data.value.arrSQL
			liwaData.value.forEach((item) => {
				item.isShow = 0
				item.isChecked = 0
			})	
			if (arrChklist.value.length > 0) {
				// 將 liwaData 符合的mainID的 isChecked = 1
				arrChklist.value.forEach((n) => {
					let res = liwaData.value.filter((obj) => n == obj.mainID)
					if (res.length > 0) res[0].isChecked = 1	
				})
			}			    	
	    }
	    totalPage.value = data.data.value.totalPage	
	}

	const loadHead = async () => {
		let iShowMode = useShowmode()
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT'),
			'showMode': iShowMode,
			'progID':state.progID
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/sys_haveHead.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()	
		liwaHead.value = data.data.value.arrSQL
		// console.log('liwaHead =', liwaHead.value, 'showMode[1] =', liwaHead.value[1].showMode)
		liwaHead.value.forEach((m) => m.sort = 0)
	}

	const setArrOptions = (sFieldNM) => {
		let res = liwaHead.value.filter((m) => m.colField == sFieldNM)
		let tmpArr = JSON.parse(res[0].bodyOptions)
		let arrOption = []
		arrOption = [...tmpArr]
		return arrOption
	}

	const setOrder = (idx) => {
		// 用來對liwaData的資料排序
		// 若 sortIndex == idx, 直接排序, 若否, 先將所有欄位 sort設為0
		if (idx !== sortIndex.value) {
			liwaHead.value.forEach((m) => m.sort = 0)
		}
		let iSort = liwaHead.value[idx].sort
		if (iSort < 2) {
			// 設定昇冪
			// liwaData.value.sort((a, b) => { 
			// 	if (Object.values(b)[idx] < Object.values(a)[idx]) return -1
			// })	
			sortDir.value = 'asc'
			iSort = 2
		} else {
			// liwaData.value.sort((a, b) => { 
			// 	if (Object.values(a)[idx] < Object.values(b)[idx]) return -1
			// })		
			sortDir.value = 'desc'
			iSort --
		}
		liwaHead.value[idx].sort = iSort
		sortIndex.value = idx
		orderCol.value = liwaHead.value[idx].colField  //09/11 修改
		loadData()
	}

	const jumpDetail = (idx, idx1) => {
		// 先取得 liwaHead的slink 值
		let slink = liwaHead.value[idx1-1].slink
		//將 liwaData.value[idx] 的值設給 liwaObject
		mainID.value = (slink == 'progID')? liwaData.value[idx].progID+'/'+liwaData.value[idx].mainID:liwaData.value[idx].mainID
		emits('setMainID', mainID.value)
	}

	const get_sVal = (keyNM, idx) => {
		return liwaData.value[idx][keyNM]
	}

	const retrievePic = (idx1, idx) => {
		// 取得附屬圖檔的path, 先取得 liwaHead的fieldPic值
		let sCol = Object.values(liwaHead.value)[idx1].fieldPic
		let sFieldPic = (liwaData.value[idx][sCol])?Imgsvr.value + liwaData.value[idx][sCol]: ''
		return sFieldPic
	}

	const setChkList = (idx) => {
		let chkMainID = liwaData.value[idx].mainID
		let res = liwaData.value.filter((n) => n.mainID == chkMainID)
		let iCheck = (res[0].isChecked == 1)? 0: 1
		res[0].isChecked = iCheck
		let iCount = 0
		// 若 iCheck == 1(代表已被選), 將 idx加入 arrChklist內, 否則從 arrChklist移除
		if (iCheck == 1) {
			// arrChklist.value.push(idx)
			arrChklist.value.push(chkMainID)
			if (isChkAllMode.value == -1) isChkAllMode.value = 0
			else {
				// 檢查是否已全選, 若是, isChkAllMode = 1
				iCount = 0
				arrChklist.value.forEach((n1) => {
					// 逐筆檢查, 若已全選, isChkAllMode = 1
					let res1 = liwaData.value.filter((m1) => m1.mainID == n1)
					// 若在liwaData內找到 iCount +1
					if (res1.length > 0) iCount += 1
				})
				if (iCount == liwaData.value.length) isChkAllMode.value = 1		
			}
		} else {
			// unChecked
			let iIndex = arrChklist.value.indexOf(idx)
			arrChklist.value.splice(iIndex, 1)
			if (isChkAllMode.value == 1) isChkAllMode.value = 0
			else {
				// 檢查是否已全unChecked, 若是, isChkAllMode = -1
				iCount = 0
				arrChklist.value.forEach((n2) => {
					// 逐筆檢查, 若非全選, isChkAllMode = 0
					let res2 = liwaData.value.filter((m2) => m2.mainID == n2)
					// 若在liwaData內找到 iCount +1
					if (res2[0].length > 0) iCount += 1
				})
			}
			if (liwaData.value.length > iCount) isChkAllMode.value = 0
			else isChkAllMode.value = -1
		}
		emits('setChecked', arrChklist.value)
	}	

	const toggleChkAll = () => {
		if (isChkAllMode.value == -1) {
			// 設為全選
			isChkAllMode.value = 1
			checkAll()
			// 將arrChklist 存到 sessionStorage 內
		} else {
			// 設為全不選
			isChkAllMode.value = -1
			uncheckAll()
		}
		emits('setChecked', arrChklist.value)
	}

	const checkAll = () => {
		liwaData.value.forEach((n) => {
			let iCheck = n.isChecked
			if (iCheck == 0) {
				n.isChecked = 1
				arrChklist.value.push(n.mainID)
			}
		})
		emits('setChecked', arrChklist.value)
	}

	const uncheckAll = () => {
		liwaData.value.forEach((n) => {
			let iCheck = n.isChecked
			let iIndex = arrChklist.value.indexOf(n.mainID)
			if (iCheck == 1) {
				n.isChecked = 0
				arrChklist.value.splice(iIndex, 1)
			}
		})
		arrChklist.value = []
		emits('setChecked', arrChklist.value)
	}

	const addData = async () => {
		// 將 liwaObject 加入 liwaData.value
		mainID.value = 'add'
		emits('setMainID', mainID.value)
	}

	const filterData = () => {
		emits('setMainID', 'filter')
	}

	const sendActvPageNo = (iPage) => {
		state.page = iPage
		loadData()
	}

	const chkShowmode = (sMode) => {
		console.log('useShowmode =', useShowmode(), '; sMode =', Number(sMode))
		return useShowmode() > Number(sMode)
	}

	const deleteData = async () => {
		let details = arrChklist.value.toString()
		let keydata = {			
			'JWT': window.localStorage.getItem('liwaJWT'),
			'details': details,
			'action':'delete',
		}
		let datastr = JSON.stringify(keydata)
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
		const { data } = await useMyFetch(state.dataUrl).post().json()
		if (!data.value.message) {
			loadData()
		} else {
			// 送出錯誤訊息
			emits('sendMsg', msg)
		}
		arrChklist.value = []
		emits('setChecked', arrChklist.value)
	}

	onMounted(() => {
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		Imgsvr.value = window.sessionStorage.getItem('liwaImgsvr')
		let datastr = JSON.stringify(state.params)
		paramstr.value = (datastr)? datastr: ''
		loadHead()
		loadData()
	})		

</script>

<template>
<div class="w-full min-h-[100vh] lg:min-h-[calc(100vh_-_235px)] border-2 border-gray-400">
	<div class="barPanel h-12 rounded-3xl ml-2 mb-2 px-1 relative">
		<slot>
			<div v-if="state.showBtns" class="py-2 absolute left-0 top-2 flex flex-row">
				<div class="top-icon ml-2 -mt-1" title="查詢" @click="filterData()">
					<IconSearch class="w-7 h-7 pt-1 text-white font-bold" />
				</div>
				<div class="top-icon ml-2 -mt-1" title="新增" @click="addData()">
					<IconPlusLg class="w-8 h-8 text-white font-bold" />
				</div>
				<div class="top-icon ml-2 -mt-1 pt-[.125rem] pl-[.125rem]" title="刪除" @click="deleteData()">
					<IconTrash class="w-7 h-7 text-white font-bold" />
				</div>
			</div>
		</slot>
		<slot name="FullBtns"></slot>
		<div class="w-full px-2 text-center">{{ tblTitle }}</div>	
	</div>
    <div v-if="liwaHead.length > 0" class="w-[99%] h-[calc(100vh_-_285px)] mx-[0.4%] shadow border-b border-gray-500 bg-white overflow-x-hidden overflow-y-auto">
		<table class="min-w-full divide-x divide-y divide-gray-200 bg-white">
			<thead class="min-w-full bg-white ring-1 ring-gray-200">
				<tr class="bg-emerald-600">
					<th v-for="(item, index) in liwaHead" class="thPanel relative text-white bg-emerald-600" :class="item.headCSS">
						<div v-if="item.isOrder == 1" class="flex flex-row">
							<div v-if="index==0" class="w-8 h-8 border-4 border-amber-400 ml-[0.5rem]" @click="toggleChkAll()">
								<div v-if="isChkAllMode == 1" class="-mx-1 -mt-2">
									<IconCheck class="w-7 h-7 mt-1 text-amber-300 font-bold" />
								</div>
								<div v-if="isChkAllMode == 0">
									<IconDash class="w-7 h-7 -ml-[0.125rem] -mt-[.125rem] text-amber-300 font-bold" />
								</div>
							</div>							
							<div class="w-[calc(100%_-_2rem)] py-2" @click="setOrder(index)">
								{{ item.colNM }}
							</div>
							<div v-if="item.sort > 0" class="w-8 ">
				        		<div v-if="item.sort==1">
				        			<!-- 昇冪排列 -->
				        			<IconCaretUpFill class="w-7 h-7 absolute right-1 top-4 text-yellow-300 font-bold" />
				        		</div>
				        		<div v-if="item.sort==2">
				        			<!-- 降冪排列 -->
				        			<IconCaretDownFill class="w-7 h-7 absolute right-1 top-4 text-yellow-300 font-bold" />
				        		</div>
							</div>
						</div>
						<div v-else>
							<div class="w-full">
								{{ item.colNM }}
							</div>						
						</div>
					</th>
				</tr>
			</thead>
			<tbody v-if="liwaData.length > 0" class="w-full min-h-[calc(100vh_-_260px)] bg-white ring-1 ring-gray-50">
				<tr 
					class="odd:bg-white even:bg-slate-200 relative"
					v-for="(object, index) in liwaData"
					:key="index"
				>
					<td scope="col" class="border-b py-1 text-sm font-medium text-gray-500 uppercase tracking-wider" :class="liwaHead[index1-1].headCSS" v-for="index1 in liwaHead.length">
						<div class="w-full border-r-2 odd:border-r-gray-300 even:border-r-slate-800 cursor-pointer flex flex-row" >
							<div>
								<!-- 核可方塊 -->
								<div v-if="index1==1" class="flex flex-row justify-start pl-2 ">
									<div class="w-8 h-8 border-4 border-slate-500 mt-1 mr-1" @click.stop.prevent="setChkList(index)">
										<div v-if="object.isChecked==1">
											<IconCheck class="w-7 h-7 text-green-400 font-bold" />
										</div>
									</div>	
								</div>							
							</div>
							<!-- 資料主體 -->
							<div class="w-full py-1">
								<div v-if="liwaHead[index1-1].fieldPic" class="flex flex-row" :class="liwaHead[index1-1].bodyCSS">
									<div class="w-[45px] h-[45px] mx-2 mt-2">
										<img :src="retrievePic(index1-1, index)" height="40" />
									</div>
									<div v-if="liwaHead[index1-1].slink" class="px-1 py-4" @click.stop="jumpDetail(index, index1)">{{ Object.values(object)[index1-1] }}</div>
									<div v-else class="px-2 py-1">{{ Object.values(object)[index1-1] }}</div>
								</div>
								<div v-else class="w-full py-1" :class="liwaHead[index1-1].bodyCSS">
									<div v-if="liwaHead[index1-1].slink" class="px-2 py-1" @click.stop="jumpDetail(index, index1)">{{ Object.values(object)[index1-1] }}</div>
									<div v-else class="px-2 py-1">{{ Object.values(object)[index1-1] }}</div>
								</div>							
							</div>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
    </div>
</div>
<div v-if="liwaData.length" class="w-full bg-slate-200 px-4 py-2">
	<!-- 頁碼控制 -->
	<liwaPages
		:page="state.page"
		:totalPage="totalPage"
		@setActvPage="sendActvPageNo"
	></liwaPages>	
</div>
</template>