<script setup lang="ts">
	/*********************************************************
	prog name: 計算列表元件, author: James Lin, date: 2023/07/07
	Descp: 可自動計算列表元素處理
	Note: 列表的下拉或combo選單的欄位, 一律命名為itemID, 顯示為itemNM 
		  選項的帶出值一律為var1, 列表中的數量改名var2, 小計改名var3
	UnDo: 列表的排序重新 reload loadData
	**********************************************************/	
	import { ref, reactive, onMounted, watch, computed } from "vue"
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

	const emits = defineEmits(["setList", "sendMsg", "setMainID"])
	
	const liwaData = ref([])
	const liwaHead = ref([])
	const liwaSchema = ref({})
	const liwaObject = ref({"itemID":"","var1":"","var2":"","var3":""})
	const mainID = ref('')
	const arrOption = ref([])

	const orderCol = ref('')
	const sortIndex = ref(0)
	const sortDir = ref('asc')
	const arrChklist = ref([])
	const isChkAllMode = ref(-1)

	const isAdd = ref(false)
	const isEdit = ref(false)

	const debug = ref(true)

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
    	liwaSchema.value.isShow = 0
    	liwaSchema.value.isChecked = 0
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
		let res = liwaHead.value.filter((m) => (m.fieldType == "liwaDrop") || (m.fieldType == 'liwaCombo'))
		let tmpArr = JSON.parse(res[0].bodyOptions)
		arrOption.value = [...tmpArr]
	}

	// const setArrOptions = (sFieldNM) => {
	// 	// 設定 type == liwaDrop 的下拉選項值
	// 	let res = liwaHead.value.filter((m) => m.bodyOptions !== "null")
	// 	let tmpArr = JSON.parse(res[0].bodyOptions)
	// 	arrOption.value = [...tmpArr]
	// 	return arrOption
	// }

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

	const setMainID1 = (idx) => {
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
		if(state.canEdit) liwaData.value[idx].isShow = '1'
	}

	const jumpDetail = (idx) => {
		//將 liwaData.value[idx] 的值設給 liwaObject
		mainID.value = liwaData.value[idx].mainID
		emits('setMainID', mainID.value)
	}

	const get_sVal = (keyNM, idx) => {
		return liwaData.value[idx][keyNM]
	}

	const retrievePic = (idx1, idx) => {
		// 取得附屬圖檔的path, 先取得 liwaHead的fieldPic值
		let sCol = Object.values(liwaHead.value)[idx1-1].fieldPic
		let sFieldPic = Imgsvr.value + liwaData.value[idx][sCol]
		return sFieldPic
	}

	const retrieveValField = (idx1, idx) => {
		let sCol = Object.values(liwaHead.value)[idx1-1].valField
		let sFieldVal = liwaData.value[idx][sCol]
		return sFieldVal
	}

	const saveData = async (idx) => {
		let iLength = Object.keys(liwaObject.value).length
		let str = ''
		for (let i=0; i<iLength; i++) {
			str += (i == iLength -1)? '"'+ Object.keys(liwaObject.value)[i] + '":"'+ Object.values(liwaObject.value)[i] +'"': '"'+ Object.keys(liwaObject.value)[i] + '":"'+Object.values(liwaObject.value)[i]+'",'
		}
		str = '{' + str + '}'
		let liwaTmp = JSON.parse(str)
			// console.log('liwaTmp =', liwaTmp)
		// 將 liwaObject 加到 liwaData 內
		if (action.value == 'add') {
			liwaData.value.push(liwaTmp)
		} else {
	    	liwaData.value.splice(idx, 1, liwaTmp)
		}			
		// 先判斷是否需直接存DB => state.dataUrl; 若要, 先fetch
		if (state.dataUrl)	{
/*			
			if (paramstr.value) liwaObject.value.params = paramstr.value
			liwaObject.value.mainID = liwaData.value[idx].mainID	
			liwaObject.value.action = action.value
			liwaObject.value.JWT = window.localStorage.getItem('liwaJWT')
*/
			if (paramstr.value) liwaTmp.params = paramstr.value
			if (action.value == 'edit') liwaTmp.mainID = liwaData.value[idx].mainID	
			liwaTmp.action = action.value
			liwaTmp.JWT = window.localStorage.getItem('liwaJWT')			
			let datastr = JSON.stringify(liwaTmp)
			// console.log('datastr =', datastr)		
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
		    // 不管存成功與否, 先關 editBox
		    if (action.value == 'add') isAdd.value = false
		    else liwaData.value[idx].isShow = 0		    
		    if (!msg) {
		    	action.value = 'view'
		    	loadData()
		    	emits('setList', liwaData.value)
		    } else {
		    	// 送出錯誤訊息
		    	emits('sendMsg', msg)
		    }
		} else {
			// 將 liwaObject 加到 liwaData 內
			if (action.value == 'add') {
				isAdd.value = false
			} else {
		    	// 將 liwaObject 設到 liwaData.value[idx]
				liwaData.value[idx].isShow = 0
			}	
	    	action.value = 'view'
	    	emits('setList', liwaData.value)			
		}
	}

	const closeAddBox = () => {
		action.value = 'view'
		isAdd.value = false
	}

	const closeBox = (idx) => {
		liwaData.value[idx].isShow = '0'
		// if (action.value == 'add') liwaData.value.pop()
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
		} else {
			// unChecked
			let iIndex = arrChklist.value.indexOf(idx)
			arrChklist.value.splice(iIndex, 1)		
		}
		// 設定 isChkAllMode
		if ((arrChklist.value.length > 0) && (arrChklist.value.length < liwaData.value.length)) {
			isChkAllMode.value = 0
		} else if (arrChklist.value.length == 0) isChkAllMode.value = -1 
		else isChkAllMode.value = 1
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
		// 將 liwaSchema 設為 liwaObject.value
		let iLength = Object.keys(liwaSchema.value).length
		let str = ''
		for (let i=0; i<iLength; i++) {
			str += (i == iLength -1)? '"'+ Object.keys(liwaSchema.value)[i] + '":"'+ Object.values(liwaSchema.value)[i] +'"': '"'+ Object.keys(liwaSchema.value)[i] + '":"'+Object.values(liwaSchema.value)[i]+'",'
		}
		str = '{' + str + '}'
		liwaObject.value = JSON.parse(str)
		console.log('liwaObject =', liwaObject.value)
		liwaObject.value.isShow = 0
		liwaObject.value.isChecked = 0
		liwaObject.value.var2 = 1
		liwaObject.value.itemID = ''	
		liwaObject.value.itemNM = ''
		boxCSS.value = 'top-[0.25rem] z-50'
		action.value = 'add'
		isAdd.value = true
	}

	const deleteData = async () => {
		let details = arrChklist.value.toString()
		if (state.dataUrl) {
			let keydata = {			
				'JWT': window.localStorage.getItem('liwaJWT'),
				'details': details,
				'action':'delete',
			}
			if (paramstr.value) keydata.params = paramstr.value
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
		    	isChkAllMode.value = -1
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
			isChkAllMode.value = -1
			emits('setList', liwaData.value)
		}
	}

	watch(()=>liwaObject.value.itemID, (Val, oldVal) => {
		if (Val !== oldVal) {
			if ((Val !== undefined) && (Val !== '')) {
				let res = arrOption.value.filter((m) => m.value == Val)
				if (res.length > 0) {
					liwaObject.value.var1 = Number(res[0].var1)
					liwaObject.value.var3 = Number(liwaObject.value.var1) * Number(liwaObject.value.var2)
					liwaObject.value.itemNM = res[0].label					
				}
			}
		}
	})

	watch(() => liwaObject.value.var1, (Val, oldVal) => {
		if (Val !== oldVal) {
			liwaObject.value.var3 = Number(Val) * Number(liwaObject.value.var2)		
		}
	})

	watch(() => liwaObject.value.var2, (Val, oldVal) => {
		if (Val !== oldVal) {
			liwaObject.value.var3 = Number(liwaObject.value.var1) * Number(Val)		
		}
	})

	const iItemCount = computed(() => {
		return liwaData.value.length
	})

	const iTotalAmt = computed(() => {
		let iTotal = 0
		if (liwaData.value.length > 0) {
			liwaData.value.forEach((m) => {
				iTotal += Number(m.var3)
			})			
		}
		return iTotal;
	})

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
<div class="w-full h-[calc(100vh_-_360px)] mt-2 border-2 border-gray-400 overflow-x-hidden overflow-y-auto relative">
	<div class="w-full h-12 pt-3 text-white text-center bg-violet-800 relative">
		<div v-if="state.canEdit" class="py-2 absolute left-0 top-2 flex flex-row">
			<div class="top-icon add ml-2 -mt-1" @click="addData()">
				<IconPlusLg class="w-8 h-8 text-white font-bold" />
			</div>
			<div class="top-icon ml-2 -mt-1 pt-[.125rem] pl-[.125rem]" @click="deleteData()">
				<IconTrash class="w-7 h-7 text-white font-bold" />
			</div>
			
		</div>
		<slot name="custom"></slot>
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
			<tr v-if="isAdd">
				<td :colspan="liwaHead.length">
					<div class="w-full py-0 bg-transparent flex flex-col" :class="boxCSS">
						<div class="w-full relative">
							<FormKit 
							form-class="px-0 py-1 bg-violet-100 "
							type="form"
							v-model="liwaObject"
							:form-class="submitted? 'hidden': 'block'"
							submit-label="存檔"
							@submit="saveData(liwaData.length)"
							>
								<div class="w-full px-0 py-1 flex flex-row">
									<div v-for="index1 in liwaHead.length" :class="liwaHead[index1-1].headCSS">
										<div v-if="liwaHead[index1-1].canEdit=='0'" class="pt-6 pb-6 " :class="liwaHead[index1-1].bodyCSS">
											{{ Object.values(liwaObject)[index1-1] }}
										</div>
										<div v-else class="py-0">
											<div v-if="(liwaHead[index1-1].fieldType == 'liwaDrop') || (liwaHead[index1-1].fieldType == 'liwaCombo')" class="w-full text-left px-[4px] relative" >
												<FormKit 
													:name="liwaHead[index1-1].colField"
													:label="liwaHead[index1-1].colNM"
													:type="liwaHead[index1-1].fieldType"
													:arrOption="arrOption"
													:sVal="Object.values(liwaObject)[index1-1]"
												/>
											</div>
											<div v-else class="w-full text-left px-[4px]">
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
								<IconX class="w-10 h-10 text-red-500 font-bold" @click.stop="closeAddBox()"/>
							</div>					
						</div>
					</div>						
				</td>
			</tr>
			<tr 
				class="odd:bg-white even:bg-slate-200 relative"
				v-for="(object, index) in liwaData"
				:key="index"
			>
				<td scope="col" class="border-b py-1 text-sm font-medium text-gray-500 uppercase tracking-wider" :class="liwaHead[index1-1].headCSS" v-for="index1 in liwaHead.length">
					<div class="w-full border-r-2 odd:border-r-gray-300 even:border-r-slate-800 cursor-pointer flex flex-row" @click.stop="setMainID1(index)">
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
						<div class="w-full py-1">
							<div v-if="liwaHead[index1-1].fieldPic" class="flex flex-row" :class="liwaHead[index1-1].bodyCSS">
								<div class="mx-2 py-1">
									<img :src="retrievePic(index1, index)" class="h-[40px] border-2 border-slate-300 rounded-full"/>
								</div>
								<div v-if="liwaHead[index1-1].slink" class="px-1 py-4" @click.stop="jumpDetail(index)">
									<div v-if="(liwaHead[index1-1].fieldType=='liwaDrop') || (liwaHead[index1-1].fieldType=='liwaCombo')">{{  retrieveValField(index1, index)  }}</div>
									<div v-else>{{ Object.values(object)[index1-1] }}</div>
								</div>
								<div v-else class="px-2 py-1">
									<div v-if="(liwaHead[index1-1].fieldType=='liwaDrop') || (liwaHead[index1-1].fieldType=='liwaCombo')">{{  retrieveValField(index1, index)  }}</div>
									<div v-else>{{ Object.values(object)[index1-1] }}</div>
								</div>	
							</div>
							<div v-else class="w-full py-1" :class="liwaHead[index1-1].bodyCSS">
								<div v-if="liwaHead[index1-1].slink" class="px-2 py-1" @click.stop="jumpDetail(index)">
									<div v-if="(liwaHead[index1-1].fieldType=='liwaDrop') || (liwaHead[index1-1].fieldType=='liwaCombo')">{{  retrieveValField(index1, index)  }}</div>
									<div v-else>{{ Object.values(object)[index1-1] }}</div>	
								</div>
								<div v-else class="px-2 py-1">
									<div v-if="(liwaHead[index1-1].fieldType=='liwaDrop') || (liwaHead[index1-1].fieldType=='liwaCombo')">{{  retrieveValField(index1, index)  }}</div>
									<div v-else>{{ Object.values(object)[index1-1] }}</div>
								</div>
							</div>			
						</div>
					</div>
				</td>
				<div v-if="object.isShow == 1" class="w-full py-0 absolute left-0 bg-transparent flex flex-col" :class="boxCSS">
					<div class="w-full relative">
						<FormKit 
						form-class="px-0 py-1 bg-violet-100 "
						type="form"
						v-model="liwaObject"
						:form-class="submitted? 'hidden': 'block'"
						submit-label="存檔"
						@submit="saveData(index)"
						>
							<div class="w-full px-0 py-1 flex flex-row">
								<div v-for="index1 in liwaHead.length" :class="liwaHead[index1-1].headCSS">
									<div v-if="(liwaHead[index1-1].canEdit=='0') && action=='edit'" class="pt-6 pb-6 " :class="liwaHead[index1-1].bodyCSS">
										{{ Object.values(object)[index1-1] }}
									</div>
									<div v-else class="py-0">
										<div v-if="(liwaHead[index1-1].fieldType == 'liwaDrop') || (liwaHead[index1-1].fieldType == 'liwaCombo')" class="w-full text-left px-[4px] relative" >
											<FormKit 
												:name="liwaHead[index1-1].colField"
												:label="liwaHead[index1-1].colNM"
												:type="liwaHead[index1-1].fieldType"
												:arrOption="arrOption"
												:sVal="get_sVal(liwaHead[index1-1].valField, index)"
											/>
										</div>
										<div v-else class="w-full text-left px-[4px]">
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
	<div class="w-full absolute bottom-0 bg-gray-100">
		<div class="w-full h-8 flex flex-row justify-between border-t-2 border-t-slate-400">
			<div class="p-1">數量: {{ iItemCount }}</div>
			<div class="p-1">總計: {{ iTotalAmt }}</div>
		</div>			
	</div>
</div>
</template>