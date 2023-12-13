<script setup lang="ts">
	/*********************************************************
	prog name: 上傳檔案元件, author: James Lin, date: 2022/11/21
	Todo: 1. 傳入參數->progressCSS, 
		  2. 
	**********************************************************/	
	import { ref, reactive, onMounted, computed } from "vue"	
	import { useNow, useDateFormat, useTimeout } from "@vueuse/core"
	import queryString from "query-string"
	import { IconPlusLg, IconX } from '@iconify-prerendered/vue-bi'

	const props = defineProps({
		mainID: {
			type: String,
			required: true,
			default: ""
		},		
		imgboxCSS: {
			type: String,
			required: true,
			default:"h-72"
		},
		fieldLabel: {
			type: String,
			required: true,
			default: "欄位標題"
		},
		phpurl: {
			type: String,
			required: true,
			default: ""		
		},
		sAccept: {
			type: String,
			required: true,
			default: "image/*"		
		},
		liwaFiles: {
			type: Array,
			required: true,
			default: []		
		},		
	})

	const state = reactive({
		mainID: props.mainID,
		imgboxCSS: props.imgboxCSS,
		fieldLabel: props.fieldLabel,
		phpurl: props.phpurl,
		sAccept: props.sAccept,
		liwaFiles: props.liwaFiles,
	})

	const emits = defineEmits(["setFiles", "setDelete"])
	const APIsvr = ref('')
	const dropArea = ref(null)
	const progressBar = ref(null)
	const uploadProgress = ref([])
	const respText = ref('')
	const liwaOBJ = ref([])
	const tmpJSON = ref([])
	const finalJSON = ref({"src":"", "alt":""})
	const areaCSS = ref('hidden')
	const fileinput = ref(null)

	const showDlg = () => {
		areaCSS.value = 'block'
	}

	const closeDlg = () => {
		areaCSS.value = 'hidden'
	}

	const preventDefaults = (e) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDrop = (e) => {
		let dt = e.dataTransfer
		let files = dt.files
		handleFiles(files)
	}

	const handleFiles = (element) => {
		let files = element.target.files
		initialProgress(files.length)
		if (state.mainID == '') {
			const d = new Date()
			const mainID1 = useDateFormat(useNow(), 'MMDDHHmmss')
			state.mainID = mainID1.value + d.getMilliseconds()
		}
		for(let i=0; i<files.length; i++) {
			uploadFile(files[i], i)					
		}
	}	

	const initialProgress = (numFiles) => {
		progressBar.value.value = 0
		for(let i = numFiles; i > 0; i--) {
			uploadProgress.value.push(0)
		}
	}

	const updateProgress = (fileNumber, percent) => {
		uploadProgress.value[fileNumber] = percent
		let total = uploadProgress.value.reduce((tot, curr) => tot + curr, 0) / uploadProgress.value.length
		progressBar.value.value = total
	}

	const uploadFile = (file, i) => {
		let url = window.sessionStorage.getItem('liwaAPIsvr') + state.phpurl
		 // 上傳檔案的api
		let JWT = window.localStorage.getItem('liwaJWT')

		let xhr = new XMLHttpRequest()
		let formData = new FormData()
		
		xhr.open('POST', url, true)
		xhr.setRequestHeader('X-Requested-with', 'XMLHttpRequest')

		// Update progress (can be used to show progress indicator)
		xhr.upload.addEventListener("progress", (e) => {
			updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
		})

		xhr.addEventListener('readystatechange', (e) => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				updateProgress(i, 100)  // <- Add this
				respText.value = xhr.responseText
			console.log('respText =', respText.value)
				if (respText.value) {
					liwaOBJ.value.pop()
					let fullPath = APIsvr.value + respText.value
					let arrTmp = {
						"src": fullPath,
						"alt": respText.value
					}
					tmpJSON.value.push(fullPath)
					liwaOBJ.value.push(arrTmp)
					liwaOBJ.value.push(finalJSON)
					emits("setFiles", tmpJSON.value)
				}				
			} else if (xhr.readyState == 4 && xhr.status !== 200) {
				// Error, Inform the user
			}
			areaCSS.value = 'hidden'
		})

		formData.append('fileinput', file)
		formData.append('JWT', JWT)
		formData.append('mainID', state.mainID)
		xhr.send(formData)
	}

	const delOBJ = (iIndex)	=> {
		let spath = liwaOBJ.value[iIndex].alt
		let tmpIndex = tmpJSON.value.findIndex(e => e==spath)
		tmpJSON.value.splice(tmpIndex, 1)		
		liwaOBJ.value.splice(iIndex,1)
		let objDel = {
			'filePath':spath,
			'fileList': tmpJSON.value
		}		
		emits("setDelete", objDel)
	}

	onMounted(() => {
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		// document.getElementById("fileinput").value = ""
		fileinput.value = ''
		if (state.liwaFiles.length > 0) {
			let itemLength = window.sessionStorage.getItem('liwaImgsvr').length
			for (let m=0; m<state.liwaFiles.length; m++) {
				let tmpPath = state.liwaFiles[m].slice(itemLength)
				let arrTmp = {
						"src":  state.liwaFiles[m],
						"alt": 	tmpPath
				}
				// tmpJSON.value.push(tmpPath)
				tmpJSON.value.push(state.liwaFiles[m])
				liwaOBJ.value.push(arrTmp)
			}
		}
		liwaOBJ.value.push(finalJSON.value)
		console.log('liwaOBJ =', liwaOBJ.value)
	})
</script>

<template>
<div class="w-full min-h-[12rem] relative pt-2">
	<div class="absolute top-1 left-2 z-10 text-center bg-white text-lg text-slate-600 px-3">{{ state.fieldLabel }}</div>
	<div id="gallery" class="w-full min-h-[12rem] mx-auto mt-2 border-2 border-slate-300 border-dashed rounded-2xl px-4 py-4 flex flex-row flex-wrap overflow-x-hidden overflow-y-auto relative" :class="state.imgboxCSS">
		<div v-for="(item, index) in liwaOBJ" class="w-[120px] m-1 relative">
			<div v-if="index==liwaOBJ.length-1" class="w-full h-[120px]">
				<div v-if="state.phpurl" class="w-full h-full bg-white rounded-2xl border-2 border-dashed border-slate-500 pt-2" @click="showDlg()">
					<IconPlusLg class="w-24 h-24 text-slate-500 font-bold mx-auto my-auto" />
				</div>
			</div>
			<div v-else class="w-full h-[120px] relative">
				<div class="w-full h-full rounded-2xl border-dashed border-2 border-slate-400 pt-2 pb-1 px-2">
					<img :src="item.src" :alt="item.alt" height="110" style="vertical-align: baseline;"/>
				</div>
				<div class="w-7 h-7 absolute top-2 right-2 pt-[0.125rem] pl-[0.125rem] bg-gray-100 rounded-full cursor-pointer">
					<IconX class="w-6 h-6 text-red-400 font-bold" 
						@click="delOBJ(index)"
					/>
				</div>				
			</div>
		</div>
	</div>

	<div id="drop-area" ref="dropArea" class="w-[480px] bg-gray-100 absolute top-8 left-4 border-2 border-slate-300 border-dashed rounded-2xl px-8" :class="areaCSS">
		<form class="mb-6">
			<p class="my-2">請點擊「選擇檔案」按鈕開啟對話盒</p>
			<input type="file" id="fileinput" ref="fileinput" :accept="state.sAccept" multiple @change="handleFiles">
		</form>
		<div >
			<progress id="progress-bar" ref="progressBar" class="w-11/12 h-4 mb-4" max="100" value="0"></progress>		
		</div>
		<div class="w-8 h-8 absolute top-1 right-1 bg-transparent cursor-pointer">
			<IconX class="w-7 h-7 text-red-400 font-bold" 
				@click="closeDlg()"
			/>
		</div>
	</div>		
</div>	
</template>

<style scope>
	progress[value] {
		/*appearance:; none;*/
		border: none;
		color: #e52e71;
	}

	progress[value]::-webkit-progress-value {
		background-color: #30cc7e;
	}

	progress[value]::-moz-progress-bar {

	}	
</style>