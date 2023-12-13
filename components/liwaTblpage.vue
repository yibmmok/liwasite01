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
		canEdit: {
			type: Boolean,
			default: true
		},		
	})

	const emits = defineEmits(["setList", "sendMsg"])
	
	const liwaData = ref([])
	const liwaHead = ref([])
	const liwaSchema = ref({})
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

	const state = reactive({
		'tblTitle': props.tblTitle,
		'progID':props.progID,
		'viewUrl': props.viewUrl,
		'dataUrl': props.dataUrl,
		'params': props.params,
		'canEdit':props.canEdit
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
    	liwaSchema.value = data.value.arrSchema[0]
		if (!state.dataUrl) {
			emits('setList', liwaData.value)
		}    	
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
		if(state.canEdit) liwaData.value[idx].isShow = '1'
	}

	const get_sVal = (keyNM, idx) => {
		return liwaData.value[idx][keyNM]
	}

	const retrievePic = (idx1, idx) => {
		// 取得附屬圖檔的path, 先取得 liwaHead的fieldPic值
		let sCol = Object.values(liwaHead.value)[idx1].fieldPic
		let sFieldPic = Imgsvr.value + liwaData.value[idx][sCol]
		return sFieldPic
	}

	const saveData = async (idx) => {
		// 先取得 liwaHead中 bodyOptions !== null
		let res = liwaHead.value.filter((m) => (m.bodyOptions !== null) && (m.bodyOptions !== ""))
		let iLength = res.length
		for (let i=0; i< iLength; i++) {
			let iIndex = Number(res[i].iIndex)-1
			// 取得下拉選項主鍵值的物件順序 
			let iKeyIndex = Object.keys(liwaSchema.value).indexOf(liwaHead.value[iIndex].colField)
			// 取得下拉選項 sVal 的物件順序
			let iKeyIndex2 = Object.keys(liwaSchema.value).indexOf(liwaHead.value[iIndex].valField)
			let keyNM = Object.keys(liwaSchema.value)[iKeyIndex2]
			// 取得下拉選項主鍵值的物件值
			let tmpArr = JSON.parse(res[i].bodyOptions)
			// 用 filter 比對bodyOptions 中與主鍵值的物件值的object
			let res1 = tmpArr.filter((n) => n.value == Object.values(liwaObject.value)[iKeyIndex])
			// 將找到 object 的顯示值設給下拉選項的 sVal
			liwaObject.value[keyNM] = res1[0].label
			liwaData.value[idx][keyNM] = res1[0].label
		}
		if(state.canEdit) liwaData.value[idx].isShow = '0'
		let strTmp = JSON.stringify(liwaObject.value)
		if (state.dataUrl)	{
			if (paramstr.value) liwaObject.value.params = paramstr.value
			liwaObject.value.mainID = liwaData.value[idx].mainID	
			liwaObject.value.action = action.value
			liwaObject.value.JWT = window.localStorage.getItem('liwaJWT')
			let datastr = JSON.stringify(liwaObject.value)
			console.log('datastr =', datastr)		
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
		    let msg = data.value.message
		    if (!msg) {
		    	isEdit.value = false
		    	action.value = 'view'
		    	loadData()
		    	emits('setList', liwaData.value)
		    } else {
		    	// 送出錯誤訊息
		    	emits('sendMsg', msg)
		    }			
		} else {
	    	isEdit.value = false
	    	action.value = 'view'
	    	let objTmp = JSON.parse(strTmp)
	    	// 將 liwaObject 設到 liwaData.value[idx]
	    	liwaData.value.splice(idx, 1, objTmp)
	    	emits('setList', liwaData.value)			
		}
	}

	const closeBox = (idx) => {
		liwaData.value[idx].isShow = '0'
		if (action.value == 'add') liwaData.value.pop()
		action.value = 'view'
		isEdit.value == false
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
				arrChklist.value.push(n.mainID)
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

	const addData = async () => {
		// 將 liwaObject 加入 liwaData.value
		liwaObject.value = liwaSchema.value
		liwaObject.value.isShow = 0
		liwaObject.value.isChecked = 0		
		liwaData.value.push(liwaObject.value)
		let iFinalIdx = liwaData.value.length - 1
		boxCSS.value = 'top-[0.25rem] z-50'
		action.value = 'add'
		isEdit.value = true
		if(state.canEdit) liwaData.value[iFinalIdx].isShow = '1'		
	}

	const deleteData = async () => {
		let details = arrChklist.value.toString()
		if (state.dataUrl) {
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
		    	emits('setList', liwaData.value)
		    } else {
		    	// 送出錯誤訊息
		    	emits('sendMsg', msg)	    	
		    }
		} else {
			// 刪除 liwaData.value.isChecked 的資料
			let i = 0
			let arrIdx = []
			liwaData.value.forEach((n) => {
				let iCheck = n.isChecked
				// let iIndex = arrChklist.value.indexOf(n.mainID)
				if (iCheck == 1) {
					arrIdx.push(i)
				}
				i++
			})
			arrIdx.reverse()
			arrIdx.forEach((p) => {
				liwaData.value.splice(p, 1)
			})
			emits('setList', liwaData.value)
		}
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
		<div v-if="state.canEdit" class="py-2 absolute left-0 top-2 flex flex-row">
			<div class="top-icon add ml-2 -mt-1" @click="addData()">
				<IconPlusLg class="w-8 h-8 text-white font-bold" />
			</div>
			<div class="top-icon ml-2 -mt-1 pt-[.125rem] pl-[.125rem]" @click="deleteData()">
				<IconTrash class="w-7 h-7 text-white font-bold" />
			</div>
		</div>
		<div class="w-full px-2 text-center">{{ tblTitle }}</div>	
	</div>
	<table class="min-w-full divide-x divide-y divide-gray-200 bg-white">
		<thead class="w-full bg-white ring-1 ring-gray-200">
			<tr class="bg-gray-50 h-12">
				<th v-for="(item, index) in liwaHead" class="thPanel relative text-white bg-violet-900" :class="item.headCSS">
					<div v-if="item.isOrder == 1" class="flex flex-row">
						<div v-if="state.canEdit">
							<div v-if="index==0" class="w-8 h-8 border-4 border-amber-400 -ml-[0.825rem]" @click="toggleChkAll()">
								<div v-if="isChkAllMode == 1" class="-mx-1 -mt-2">
									<IconCheck class="w-7 h-7 mt-1 text-amber-300 font-bold" />
								</div>
								<div v-if="isChkAllMode == 0">
									<IconDash class="w-7 h-7 -ml-[0.125rem] -mt-[.125rem] text-amber-300 font-bold" />
								</div>
							</div>							
						</div>
						<div class="w-[calc(100%_-_2rem)] py-2" @click="setOrder(index)">
							{{ item.colNM }}
						</div>
						<div v-if="item.sort > 0" class="w-8 ml-12">
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
				<td scope="col" class="border-b py-2 text-sm font-medium text-gray-500 uppercase tracking-wider" :class="liwaHead[index1-1].headCSS" v-for="index1 in liwaHead.length">
					<div class="w-full border-r-2 odd:border-r-gray-300 even:border-r-slate-800 cursor-pointer flex flex-row" @click.stop="setMainID(index)">
						<div v-if="state.canEdit">
							<!-- 核可方塊 -->
							<div v-if="index1==1" class="flex flex-row justify-start pl-2 ">
								<div class="w-8 h-8 border-4 border-slate-500 mt-2 mr-1" @click.stop.prevent="setChkList(index)">
									<div v-if="object.isChecked==1">
										<IconCheck class="w-7 h-7 text-green-400 font-bold" />
									</div>
								</div>	
							</div>							
						</div>
						<!-- 資料主體 -->
						<div class="w-full py-2">
							<div v-if="liwaHead[index1-1].fieldPic" class="flex flex-row" :class="liwaHead[index1-1].bodyCSS">
								<div class="w-[45px] h-[45px] mx-2">
									<img :src="retrievePic(index1-1, index)" height="40" class="rounded-full"/>
								</div>
								<div class="py-4">{{ Object.values(object)[index1-1] }}</div>
							</div>
							<div v-else class="w-full py-2" :class="liwaHead[index1-1].bodyCSS">
								{{ Object.values(object)[index1-1] }}
							</div>							
						</div>
					</div>
				</td>
				<div v-if="object.isShow == '1'" class="w-full py-0 absolute left-0 bg-transparent flex flex-col" :class="boxCSS">
					<div v-if="isEdit" class="w-full relative">
						<FormKit 
						form-class="px-0 py-2 bg-violet-100 "
						type="form"
						v-model="liwaObject"
						:form-class="submitted? 'hidden': 'block'"
						submit-label="存檔"
						@submit="saveData(index)"
						>
							<div class="w-full px-0 py-2 flex flex-row">
								<div v-for="index1 in liwaHead.length" :class="liwaHead[index1-1].headCSS">
									<div v-if="(liwaHead[index1-1].canEdit=='0') && action=='edit'" class="pt-6 pb-6 " :class="liwaHead[index1-1].bodyCSS">
										{{ Object.values(object)[index1-1] }}
									</div>
									<div v-else class="py-0">
										<div v-if="liwaHead[index1-1].fieldType == 'liwaDrop'" class="w-full text-left px-2 relative" >
											<FormKit 
												:name="liwaHead[index1-1].colField"
												:label="liwaHead[index1-1].colNM"
												:type="liwaHead[index1-1].fieldType"
												:arrOption="setArrOptions(liwaHead[index1-1].colField)"
												:sVal="get_sVal(liwaHead[index1-1].valField, index)"
											/>
										</div>
										<div v-else class="w-full text-left px-2">
											<FormKit 
												:name="liwaHead[index1-1].colField"
												:label="liwaHead[index1-1].colNM"
												:type="liwaHead[index1-1].fieldType"
											/>
										</div>
									</div>
								</div>						
							</div>						
						</FormKit>
						<div class="w-10 h-10 mx-2 my-2 absolute left-[8rem] bottom-[1.5rem]">
							<IconX class="w-10 h-10 text-red-500 font-bold" @click.stop="closeBox(index)"/>
						</div>					
					</div>
				</div>
			</tr>
		</tbody>
	</table>
</div>
</template>