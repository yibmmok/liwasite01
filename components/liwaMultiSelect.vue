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
	import { IconPlusLg, IconSearch, IconTrash, IconCheck, IconCheckSquare, IconDash, IconX, IconCaretDownFill, IconCaretUpFill, IconCloudArrowUpFill } from '@iconify-prerendered/vue-bi'

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
	})

	const emits = defineEmits(["setList", "sendMsg"])
	
	const liwaData = ref([])
	const liwaHead = ref([])
	// const liwaSchema = ref({})
	const liwaObject = ref({})

	const orderCol = ref('')
	const sortIndex = ref(0)
	const sortDir = ref('asc')
	const arrChklist = ref([])
	const isChkAllMode = ref(-1)

	const isEdit = ref(false)
	const boxCSS = ref('')
	const paramstr = ref('')
	const action = ref('view')
	
	const APIsvr = ref('')
	const Imgsvr = ref('')
	const route = useRoute()
	const iTotal = ref(0)

	const state = reactive({
		'tblTitle': props.tblTitle,
		'progID':props.progID,
		'viewUrl': props.viewUrl,
		'dataUrl': props.dataUrl,
		'params': props.params
	})

	const loadData = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT'),
			'params': paramstr.value,
			'action':'view'
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
	    const { data } = await useMyFetch(state.viewUrl).post().json()
	    if (data.value.arrSQL.length > 0) {
			liwaData.value = data.value.arrSQL
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
    	// liwaSchema.value = data.value.arrSchema[0]
		// if (!state.dataUrl) {
		// 	emits('setList', liwaData.value)
		// }  
		iTotal.value = liwaData.value.length  	
	}

	const loadHead = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT'),
			'progID':state.progID
		}
		let sQuery = queryString.stringify(keydata)
		// let url = `${APIsvr.value}/${state.headUrl}?${sQuery}`
		let url = `${APIsvr.value}/sys_haveHead.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()	
		liwaHead.value = data.data.value.arrSQL
		liwaHead.value.forEach((m) => m.sort = 0)
		// console.log('liwaHead =', liwaHead.value)
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
		// console.log('liwaData =', liwaData.value)
		liwaHead.value[idx].sort = iSort
		sortIndex.value = idx
	}

	const setMainID = (idx) => {
		//將 liwaData.value[idx] 的值設給 liwaObject
		let iLength = Object.keys(liwaData.value[idx]).length
		let str = ''
		for (let i=0; i<iLength; i++) {
			str += (i == iLength -1)? '"'+ Object.keys(liwaData.value[idx])[i] + '":"'+ Object.values(liwaData.value[idx])[i] +'"': '"'+ Object.keys(liwaData.value[idx])[i] + '":"'+Object.values(liwaData.value[idx])[i]+'",'
		}
		str = '{' + str + '}'
		liwaObject.value = JSON.parse(str)
		boxCSS.value = 'top-[4.25rem] z-50'
		action.value = 'edit'
		isEdit.value = true
	}

	// const get_sVal = (keyNM, idx) => {
	// 	return liwaData.value[idx][keyNM]
	// }

	const retrievePic = (idx1, idx) => {
		// 取得附屬圖檔的path, 先取得 liwaHead的fieldPic值
		let sCol = Object.values(liwaHead.value)[idx1-1].fieldPic
		let sFieldPic = Imgsvr.value + liwaData.value[idx][sCol]
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
			// arrChklist.value.push(chkMainID)
			arrChklist.value.push(liwaData.value[idx])
			if (isChkAllMode.value == -1) isChkAllMode.value = 0
			else {
				// 檢查是否已全選, 若是, isChkAllMode = 1
				iCount = 0
				arrChklist.value.forEach((n1) => {
					// 逐筆檢查, 若已全選, isChkAllMode = 1
					let res1 = liwaData.value.filter((m1) => m1.mainID == n1.mainID)
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
					let res2 = liwaData.value.filter((m2) => m2.mainID == n2.mainID)
					// 若在liwaData內找到 iCount +1
					if (res2[0].length > 0) iCount += 1
				})
			}
			if (liwaData.value.length > iCount) isChkAllMode.value = 0
			else isChkAllMode.value = -1
		}
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
	}

	const checkAll = () => {
		liwaData.value.forEach((n) => {
			let iCheck = n.isChecked
			if (iCheck == 0) {
				n.isChecked = 1
				// arrChklist.value.push(n.mainID)
				arrChklist.value.push(n)
			}
		})
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
	}

	const submitData = () => {
		if (arrChklist.value.length > 0) emits('setList', arrChklist.value)
		else emits('sendMsg', '請先勾選列表中項目再繼續')
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
<div class="w-full h-[calc(100vh_-_360px)] mt-2 border-2 border-gray-400 overflow-x-hidden overflow-y-auto">
	<div class="w-full h-12 pt-3 text-white text-center bg-violet-800 relative">
		<div class="w-full px-2 text-center">{{ tblTitle }}</div>
		<div v-if="liwaData.length > 0" class="top-icon add ml-4 mt-0 mb-1 absolute right-1 top-2 cursor-pointer" @click="submitData()">
			<IconCloudArrowUpFill class="w-7 h-7 pl-[0.125rem] pt-[0.2rem] text-white font-bold" />
		</div>
	</div>
	<table class="min-w-full divide-x divide-y divide-gray-200 bg-white">
		<thead class="w-full bg-white ring-1 ring-gray-200">
			<tr class="bg-gray-50 h-12">
				<th v-for="(item, index) in liwaHead" class="thPanel relative text-white bg-violet-900" :class="item.headCSS">
					<div v-if="item.isOrder == 1" class="flex flex-row justify-between">
						<div v-if="index==0" class="w-8 h-8 border-4 border-amber-400 -ml-[0.825rem]" @click="toggleChkAll()">
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
						<div v-if="item.sort > 0" class="w-8">
			        		<div v-if="item.sort==1">
			        			<!-- 昇冪排列 -->
			        			<IconCaretUpFill class="w-7 h-7 absolute right-1 top-3 text-yellow-300 font-bold" />
			        		</div>
			        		<div v-if="item.sort==2">
			        			<!-- 降冪排列 -->
			        			<IconCaretDownFill class="w-7 h-7 absolute right-1 top-3 text-yellow-300 font-bold" />
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
		<tbody class="w-full bg-white ring-1 ring-gray-50">
			<tr 
				class="odd:bg-white even:bg-slate-200 relative"
				v-for="(object, index) in liwaData"
				:key="index"
			>
				<td scope="col" class="border-b py-1 text-sm font-medium text-gray-500 uppercase tracking-wider" :class="liwaHead[index1-1].headCSS" v-for="index1 in liwaHead.length">
					<div class="w-full border-r-2 odd:border-r-gray-300 even:border-r-slate-800 cursor-pointer flex flex-row">
						<!-- 核可方塊 -->
						<div v-if="index1==1" class="flex flex-row justify-start pl-2 ">
							<div class="w-8 h-8 border-4 border-slate-500 mt-2 mr-1" @click.stop.prevent="setChkList(index)">
								<div v-if="object.isChecked==1">
									<IconCheck class="w-7 h-7 text-green-400 font-bold" />
								</div>
							</div>	
						</div>
						<!-- 資料主體 -->
						<div class="w-full py-1">
							<div v-if="liwaHead[index1-1].fieldPic" class="flex flex-row" :class="liwaHead[index1-1].bodyCSS">
								<div class="mx-2 py-1">
									<img :src="retrievePic(index1, index)" class="h-[40px] border-2 border-slate-300 rounded-full"/>
								</div>
								<div class="py-4">{{ Object.values(object)[index1-1] }}</div>
							</div>
							<div v-else class="py-1" :class="liwaHead[index1-1].bodyCSS">
								{{ Object.values(object)[index1-1] }}
							</div>							
						</div>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</div>
<div class="w-full border-2 border-slate-300 text-right">Total: {{ iTotal }}</div>
</template>