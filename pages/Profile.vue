<script setup lang="ts">
	/*********************************************************
	prog name: 關於我, author: James Lin, date: 2022/08/10
	主功能: 變更使用者profile, 重設密碼, 

	**********************************************************/	
	import { ref, reactive, onMounted, computed } from "vue"
	import { useStorage, useFetch, createFetch } from "@vueuse/core"
	import queryString from "query-string"
	import TinyMceEditor from "@tinymce/tinymce-vue"
	import liwaObjList from "../components/liwaObjList.vue"
	import liwaSimpleTbl from "../components/liwaSimpleTbl.vue"
	import liwaMsg from "../components/liwaMsg.vue"
	import useThousandSep from "../composables/use-ThousandSep.js"
	import useTimeAgo from "../composables/use-timeagotw"
	import useShowmode from "../composables/use-showmode"
	import { IconChevronDown, IconChevronUp, IconArrowLeftShort, IconArrowRightShort } from '@iconify-prerendered/vue-bi'

	const debug = ref(0)
	const route = useRoute()
	const mainID = ref('')
	const step = ref('A02')
	const liwaData = ref({})
	const liwaD01 = ref([])
	const liwaD02 = ref([])
	const APIsvr = ref('')
	const submitted = ref(false)
	const submitted2 = ref(false)
	const newpass1 = ref('')
	const sUrl = ref('/Products?imode=21')
	const Bopen = ref(true)
	//圖檔處理變數
	const imgInput = ref(null)
	const imgInput2 = ref(null)
	const gender1 = ref('')	
	//個人簡介變數
	const sContent = ref('')
	const liwaEditor = ref(null)
	const isEditor = ref(true)
	const arrBank = ref([])
	const sBankNM = ref('')
	const isSeller = ref(false)
	const C01_totalAmt = ref(0)
	const C02_totalAmt = ref(0)
	const C03_totalAmt = ref(0)
	const isMsg = ref(false)
	const inFund = ref(0)
	const outFund = ref(0)
	const iValueD01 = ref(-1)
	
	const C01Validation = ref('')
	const D02_Comment = ref('')
	const iValueD02 = ref(-1)
	const sysIcon = ref('')
	const showList = ref('block')
	const showContent = ref('hidden')

	const toggleListContent = () => {
		if (showList.value == 'block') {
			showList.value = 'hidden'
			showContent.value = 'block'
		} else {
			showList.value = 'block'
			showContent.value = 'hidden'
		}

	}

	const setActive = (sID) => {
		let iShowMode = useShowmode()
		if (iShowMode < 3) toggleListContent()
		step.value = sID
		if (sID == 'D02') {
			// 將未讀訊息清空
			clearUnread()
		}
	}

	// 圖檔處理 starts
	const callDialog = () => {
		imgInput.value.click()
	}

	const handleImage = (e) => {
		const selectedImage = e.target.files[0]
		createBase64Image(selectedImage)
	}

	const createBase64Image = (fileObject) => {
		const reader = new FileReader()

		reader.onload = (e) => {
			liwaData.value.picpath = e.target.result
		}
		reader.readAsDataURL(fileObject)
	}	

	const iconSrc = computed(() => {
		let AA = ''
		if (liwaData.value.picpath !== undefined) {
			let iconHead = liwaData.value.picpath.substr(0, 5)
			if (iconHead !== 'data:') {
				// 使用者未變更圖檔
				if (iconHead !== '/sysp') {
					// 圖檔先前已變更, 存在imgSvr內
					AA = window.sessionStorage.getItem('liwaImgsvr') + liwaData.value.picpath
				} else {
					// 圖檔為預設
					AA = (liwaData.value.gender == '先生') ? window.sessionStorage.getItem('liwaImgsvr') + '/syspics/man-icon.png': window.sessionStorage.getItem('liwaImgsvr') + '/syspics/woman-icon.png'	
				}
			} else {
				// 使用者已變更 icon, iconSrc設為已變更的圖檔(data:)
				AA = liwaData.value.picpath
			}
		}
		return AA
	})
	// 圖檔處理 ends

	// liwaEditor starts
	const InitVal = ref({
		height: 400,
		language:"zh_TW",
		menubar: true,
		content_style:"../../assets/css/tinyMCE.css",
	    plugins: [
	    	'emoticons', 'fullscreen', 'lists', 'link', 'image', 'help', 'wordcount'
	    ],
	    fullscreen_native: true,
	    toolbar: 'fullscreen | undo redo | blocks |  forecolor backcolor | indent outdent | emoticons | link image | bold italic | help',
	    file_picker_callback: function(callback, value, meta) {
		  	if (meta.filetype == 'image') {
		  		// const imgInput = document.createElement('input')
				// imgInput.setAttribute('type', 'file');
				// imgInput.setAttribute('accept', 'image/*');
				imgInput2.value.addEventListener('change', (e) => {
					const file = e.target.files[0]
					const reader = new FileReader()
					reader.onload = (e) => {
						callback(e.target.result, { alt: ''})
					}
					reader.readAsDataURL(file)
				})
				imgInput2.value.click()
			}
		},
	})
	// liwaEditor ends

	const loadData = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT')
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/wProf_web.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL[0]
		liwaData.value.action = 'edit'
		sBankNM.value = liwaData.value.bankname+'('+liwaData.value.bankID+')'
	}	

	const loadB02 = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT')
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/wProf_B02.php?${sQuery}`
		const dataB02 = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		let sKey = dataB02.data.value.key
		isSeller.value = (Number(sKey) > 0)? true: false
	}

	const loadD01 = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT')
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/wProf_005M.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaD01.value = data.data.value.arrSQL
		liwaD01.value.forEach((m) => m.isShow = 0)
	}

	const loadD02 = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT')
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/wProf_007.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaD02.value = data.data.value.arrSQL
		liwaD02.value.forEach((n) => {
			n.isShow = 0
			n.postTime = useTimeAgo(n.postTime)
			n.arrDetail.forEach((r) => {
				r.replyTime = useTimeAgo(r.replyTime)
			})			
		})
	}

	const loadW32 = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT')
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/wProf_W32.php?${sQuery}`
		const dataW32 = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		arrBank.value = dataW32.data.value.arrSQL
	}

	const saveData = async () => {
		//  若 iconSrc.substr(0, 5)=='', liwaData.value.picpath = iconSrc
		let picHead = iconSrc.value.substr(0, 5)
		if (picHead == 'data:') liwaData.value.picpath = iconSrc.value
		if (sContent.value) {
			liwaData.value.userBrief = sContent.value
		}
		liwaData.value.JWT = window.localStorage.getItem('liwaJWT')	
		let datastr = JSON.stringify(liwaData.value)
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
	    const dataA01  = await useMyFetch('wProf_webedit.php').post().json()
	    let msg = dataA01.data.value.message
	 	if (msg) {
	 		showMsg('系統訊息-存檔錯誤', msg, 2)
	 	} else {
	 		let sKey = dataA01.data.value.key
	 		if (sKey) {
	 			window.localStorage.setItem('liwaJWT', sKey)
	 		}
	 		showMsg('系統訊息', '存檔成功', 2)	 		
	 	}
	}

	const saveD02 = async () => {
		if (D02_Comment.value) {
			let keydata = {
				'JWT': window.localStorage.getItem('liwaJWT'),
				'sContent': D02_Comment.value
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
		    const dataD02  = await useMyFetch('wProf_D02edit.php').post().json()
		    let msg = dataD02.data.value.message
		 	if (!msg) {
		 		D02_Comment.value = ''
		 		loadD02()
		 	} else {
		 		showMsg('系統訊息', '存檔錯誤'+dataD02.data.value.message, 2)
		 	}				
		 }
	}

	const clearUnread = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT')
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
	    const dataUnread = await useMyFetch('wProf_clearUnread.php').post().json()
	    let msg = dataUnread.data.value.message
	    if (!msg) {
	    	window.sessionStorage.setItem('liwaUnread', '0')
	    } else {
	    	showMsg('系統訊息', '無法清除未讀訊息-'+msg, 2)
	    }
	}	

	// 訊息對話盒相關 starts
	const objMsg = ref({
		title: '',
		body: '',
		modalType: ''
	})
	
	const showMsg = (sTitle, sBody, iType = 1) => {
  		objMsg.value.title = sTitle
  		objMsg.value.body = sBody
  		objMsg.value.modalType = iType
  		isMsg.value = true
	}

	const hideMsg = () => {
		isMsg.value = false
	}

	const confirmOK = () => {
		alert("Press the Confirm button")
		isMsg.value = false
	}
	// 設定對話盒相關 ends		

	const resetPSWD = async () => {
		// 必須已設定帳號後才能更改密碼
		if (liwaData.value.memberMail) {
			let keydata = { 
				"JWT": window.localStorage.getItem('liwaJWT'),
				"mobile":liwaData.value.mobile,
				"pswd": newpass1.value,
				"debug": debug.value
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
		    const dataPSWD = await useMyFetch('sys_webresetPSWD.php').post().json()	
		    let msg = dataPSWD.data.value.message
		    if (!msg) {
		    	let sKey = dataPSWD.data.value.key
		    	showMsg('系統訊息', sKey, 2)
		    	newpass1.value = ''
		    } else {
		    	showMsg('系統訊息', '密碼變更失敗 - '+msg, 2)
		    } 
		} else {
			showMsg('步驟錯誤', '請先設定您的Email 帳號才能變更密碼。', 2)
		}
	}

	const loadTotal_C01 = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT')
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/w041M_haveTotal.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()	
		C01_totalAmt.value = data.data.value.message
		C01Validation.value = `max:${C01_totalAmt.value}`
	}	

	const loadTotal_C02 = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT')
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/w041_haveTotalC02.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()	
		C02_totalAmt.value = data.data.value.message
	}

	const loadTotal_C03 = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT')
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/w041_haveTotalC03.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()	
		C03_totalAmt.value = data.data.value.message
	}	

	const inFundSubmit = async () => {
		let keydata = { 
			"JWT": window.localStorage.getItem('liwaJWT'),
			"inFund": inFund.value
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
	    const dataInFund = await useMyFetch('w041_setInFund.php').post().json()
	    let msg = dataInFund.data.value.message
	    if (msg) {
	    	showMsg('系統訊息', '斡旋金轉入通知錯誤 -'+msg, 2)
	    } else {
	    	inFund.value = 0
	    	showMsg('系統訊息', '您的斡旋金入帳通知已發送', 2)
	    }
	}

	const outFundSubmit = async () => {
		// 檢查匯出金額是否小於C01_totalAmt
		if (C01_totalAmt.value >= inFund.value) {
			let keydata = { 
				"JWT": window.localStorage.getItem('liwaJWT'),
				"outFund": inFund.value
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
		    const dataOutFund = await useMyFetch('w041_setOutFund.php').post().json()
		    let msg = dataOutFund.data.value.message
		    if (msg) {
		    	showMsg('訊息通知', '斡旋金轉出通知錯誤 -'+msg, 2)
		    } else {
		    	outFund.value = 0
		    	showMsg('訊息通知', '您的斡旋金提領通知已發送', 2)
		    }				
		} else {
			showMsg('訊息通知', '匯出金額不得大於帳戶餘額', 2)
		}
	
	}

	// D01 section starts
	const toggleShow = (idx) => {
    	iValueD01.value = idx
    	let iShow = liwaD01.value[idx].isShow
        let iNuShow = (iShow == "0")? "1": "0"
        liwaD01.value[idx].isShow = iNuShow
    }

    // D01 section ends

	// D02 section starts
	const toggleShowD02 = (idx) => {
    	iValueD02.value = idx
    	let iShow = liwaD02.value[idx].isShow
        let iNuShow = (iShow == "0")? "1": "0"
        liwaD02.value[idx].isShow = iNuShow
    }   

    // D02 section ends

	// definePageMeta({
	//   layout: "web",
	//   colorMode: "light"
	// })	

	onMounted(() => {
		useHead({title:`我的管理中心`})
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		loadData()
		loadB02()
		loadTotal_C01()
		loadTotal_C02()
		loadD01()
		loadD02()
		loadW32()
		sysIcon.value = window.sessionStorage.getItem('liwaImgsvr') + '/syspics/sysIcon.png'
		let sUrl = route.fullPath
		let arrParam = sUrl.split('?')
		if (arrParam.length > 1) {
			let sParam = arrParam[1]
			let objParam = queryString.parse(sParam)
			let sValue = Object.entries(objParam)[0][1]	
			setActive(sValue)		
		}
		let iShowMode = useShowmode()
		console.log('iShowMode =', iShowMode)
		if (iShowMode == 3) {
			showList.value = 'block'
			showContent.value = 'block'
		} else {
			showList.value = 'block'
			showContent.value = 'hidden'
		}
		
	})
</script>

<template>
<NuxtLayout name="web">		
	<div class="w-full bg-slate-200 px-4 py-2">
		<div class="w-full flex flex-row justify-start">
			<div class="w-[calc(100%_-_2rem)] md:w-[calc(100%_-_6rem)] lg:w-[320px] p-2 border-[0.125rem] border-slate-400 relative" :class="showList">
				<div class="actItem" @click.stop="setActive('A02')">基本資料設定<div class="btnGT">&gt;</div></div>
				<div class="actItem mb-4" @click.stop="setActive('A03')">變更密碼<div class="btnGT">&gt;</div></div>
				<div class="actItem" @click.stop="setActive('B01')">收藏物件<div class="btnGT">&gt;</div></div>				
				<div v-if="isSeller" class="actItem" @click.stop="setActive('B02')">已上架物件<div class="btnGT">&gt;</div></div>
				<div class="actItem" @click.stop="setActive('B03')">斡旋中物件<div class="btnGT">&gt;</div></div>
				<div class="actItem" @click.stop="setActive('B04')">已同意物件<div class="btnGT">&gt;</div></div>				
				<div class="actItem" @click.stop="setActive('B05')">已成交物件<div class="btnGT">&gt;</div></div>
				<div class="actItem mb-4" @click.stop="setActive('B06')">待付款物件<div class="btnGT">&gt;</div></div>
				<div class="actItem" @click.stop="setActive('C01')">我的斡旋金<div class="btnGT">&gt;</div></div>
				<div class="actItem" @click.stop="setActive('C02')">已轉出斡旋金<div class="btnGT">&gt;</div></div>
				<div class="actItem" @click.stop="setActive('C03')">待付餘額<div class="btnGT">&gt;</div></div>
				<div class="actItem mb-4" @click.stop="setActive('C04')">斡旋金匯入/匯出<div class="btnGT">&gt;</div></div>
				<div class="actItem" @click.stop="setActive('D01')">系統訊息<div class="btnGT">&gt;</div></div>
				<div class="actItem" @click.stop="setActive('D02')">訊息中心<div class="btnGT">&gt;</div></div>
			</div>
			<div class="w-full lg:w-[calc(100vw_-_350px)] lg:ml-4 border-[0.125rem] border-slate-300 bg-gray-100 relative" :class="showContent">
				<div v-if="useShowmode() < 3 " class="w-8 h-8 rounded-full bg-emerald-500 fixed top-[240px] left-0" @click="toggleListContent()">
					<div class="w-7 h-7 pl-1 text-white text-2xl text-center">&lt;</div>
				</div>
				<section v-show="step=='A02'">
					<div class="w-full h-full my-0 bg-gray-100">
						<div class="w-full bg-gray-100 mx-auto my-2 rounded-xl pb-1">
							<FormKit 
							form-class="px-4 py-2 bg-white rounded-2xl w-11/12"
							type="form"
							v-model="liwaData"
							:form-class="submitted? 'hidden': 'block'"
							style="margin: 1rem auto;"
							submit-label="存檔"
							@submit="saveData()"
							>
								<fieldset class="border-[1px] border-slate-500 rounded-lg p-2 mb-4">
									<legend>基本設定</legend>
									<div class="w-full h-[200px] mb-8">
										<img 
											class="border-2 w-[200px] h-full bg-yellow-200"
											:src="iconSrc" 
											width="200" 
											:alt="liwaData.nickname" 
											@click="callDialog"
										/>	
										<p class="w-full text-center text-red-600 text-sm">請上傳頭像, 以供面交時辨識之用</p>
									</div>
									<div class="w-full flex flex-col lg:flex-row">
										<div class="w-full lg:w-1/2">
											<FormKit
									          name="memberNM"
									          label="姓名*"
									          type="text"
									          placeholder="請輸入姓名"
									          help="可輸入中英文名字(字數限制100字)"
									          validation="required"
									          input-class="py-8"
									        />							
										</div>
										<div class="w-full lg:w-1/2 lg:ml-8 mt-2">
									        <FormKit
									          name="gender"
									          label="稱謂"
									          type="radio"
									          :options="['先生', '小姐']"
									          help="請選擇性別"
									          outer-class="mt-2"
									        />
										</div>				
									</div>				        
							        <div class="w-full my-4">
							        	<span class="mr-4 font-bold text-sm text-slate-700">聯絡手機</span>
							        	<span class="text-lg">{{ liwaData.mobile }}</span>
							        </div>
							        <FormKit
							          name="birthday"
							          label="生日/公司設定日"
							          type="date"
							          min="1960-01-01"
							          help="請輸入生日/公司設定日期"
							        />
							        <FormKit
							          name="memberMail"
							          label="Email *"
							          type="email"
							          help="請設定聯絡Email"
							          validation="required"
							        />	
						        	<FormKit
							          name="uniqID"
							          label="身份證字號/統一編號*"
							          type="text"
							          help="請設定身份證字號/統一編號"
							          validation="required"
							        />
							        <div class="flex flex-col lg:flex-row justify-start lg:justify-between">
							        	<div class="w-full lg:w-16">
									        <FormKit
									        	name="zip"
									        	label="郵遞區號"
									        	type="text"
									        />		        		
							        	</div>
								        <div class="w-full lg:w-[calc(100%_-_4rem)]">
									        <FormKit
									        	name="addr"
									        	label="地址"
									        	type="text"
									        />				        	
								        </div>       	
							        </div>
							        <div class="flex flex-row">
								        <div class="w-20 text-sm font-bold m-2 border-2 border-slate-200 rounded-lg">  	
											<div class="text-6xl text-center text-orange-500">{{ liwaData.grade }}</div>
											<div class="w-full text-md text-center text-black py-2">會員等級</div>
										</div>	
								        <div class="w-20 text-sm font-bold m-2 border-2 border-slate-200 rounded-lg">
											<div class="text-6xl text-center text-orange-500">{{ liwaData.scores }}</div>
											<div class="w-full text-md text-center text-black py-2">本級積分</div>
										</div>	
										<div class="mt-4 pt-14 box-border">您還需要 {{ liwaData.remainScores }} 積分可以升到下一級</div>
							        </div>
							        <div v-if="arrBank.length > 0" class="w-full relative">
								        <FormKit
								        	name="bankID"
								        	label="往來銀行"
								        	type="liwaCombo"
								        	:sVal="sBankNM"
								        	:arrOption="arrBank"
								        	help="請注意:不接受農會及漁會的帳戶"
								        />							        	
							        </div>
							        <FormKit
							        	name="branch"
							        	label="所屬分行"
							        	type="text"
							        />	
							        <FormKit
							        	name="acctName"
							        	label="銀行戶名"
							        	type="text"
							        /> 
									<FormKit
							        	name="acctNo"
							        	label="銀行帳戶"
							        	type="text"
							        />								
								</fieldset>
							</FormKit>
						</div>
					</div>
				</section>
				<section v-show="step=='A03'">
					<div class="w-full h-full bg-gray-200">
						<div class="w-full h-[82vh] my-1 bg-gray-100 px-4 py-2">
							<FormKit 
						        form-class="px-4 py-2 bg-white rounded-2xl w-11/12"
						        type="form"
						        :form-class="submitted2? 'hidden': 'block'"
						        style="margin: 1rem auto;"
						        submit-label="送出"
						        @submit="resetPSWD"
						    >		    
						        <FormKit
						          name="newpass"
						          label="密碼"
						          type="password"
						          help="請輸入密碼, 必須8字元以上, 必須含英文大小寫字元及數字"
						          validation="required|alphanumeric:latin|length:8"
						          :validation-messages="{
						            length: '密碼長度必須8字元以上',
						          }"
						          v-model="newpass1"
						        />
						        <FormKit
						          name="newpass_confirm"
						          label="密碼確認"
						          type="password"
						          help="確認密碼"
						          validation="required|confirm"
						          validation-visibility="live"
						        />
							</FormKit>
						</div>
					</div>						
				</section>
				<section v-show="step=='B01'">
					<liwaObjList 
						:sUrl="'/Products?imode=21'"
					/>							
				</section>
				<section v-show="step=='B02'">
					<liwaObjList 
						:sUrl="'/Products?imode=22'"
					/>							
				</section>
				<section v-show="step=='B03'">
					<liwaObjList 
						:sUrl="'/Products?imode=23'"
					/>							
				</section>	
				<section v-show="step=='B04'">
					<liwaObjList 
						:sUrl="'/Products?imode=24'"
					/>							
				</section>
				<section v-show="step=='B05'">
					<liwaObjList 
						:sUrl="'/Products?imode=25'"
					/>							
				</section>
				<section v-show="step=='B06'">
					<liwaObjList 
						:sUrl="'/Products?imode=26'"
					/>							
				</section>				
				<section v-show="step=='C01'">
					<div class="w-full h-12 pt-4">
						目前斡旋金總金額:  NT${{ useThousandSep(C01_totalAmt) }}
					</div>
					<liwaSimpleTbl
						:tblTitle="'斡旋金明細'"
						:headUrl="'w041_haveHead.php'"
						:progID="'wProfile_C01'"
						:dataUrl="'w041_haveD3.php'"
					></liwaSimpleTbl>				
				</section>
				<section v-show="step=='C02'">
					<div class="w-full h-12 pt-4">
						已轉出斡旋金總金額:  NT${{ C02_totalAmt }}
					</div>
					<liwaSimpleTbl
						:tblTitle="'已轉出斡旋金明細'"
						:headUrl="'w041_haveHead.php'"
						:progID="'wProfile_C02'"
						:dataUrl="'w041_haveD3B.php'"
					></liwaSimpleTbl>				
				</section>
				<section v-show="step=='C03'">
					<div class="w-full h-12 pt-4">
						待付餘額總金額:  NT${{ C03_totalAmt }}
					</div>
					<liwaSimpleTbl
						:tblTitle="'待付餘額明細'"
						:headUrl="'w041_haveHead.php'"
						:progID="'wProfile_C03'"
						:dataUrl="'w041_haveD3C.php'"
					></liwaSimpleTbl>									
				</section>	
				<section v-show="step=='C04'">
					<div class="px-4 flex flex-col ">
						<div class="w-1/3 mt-8 mb-4 mx-1 px-8 py-12 rounded border-2 border-slate-400 bg-white">
							<FormKit 
								type="number"
								label="匯入斡旋金"
								v-model="inFund"
								value="1"
								min="1"
								validation="number"
								help="請輸入已匯入的斡旋金金額, 待我方人員確認後, 會於下一個工作日為您入帳"
							/>
							<div class="w-20 h-12 bg-orange-500 text-white rounded text-center pt-3" @click="inFundSubmit()">送出</div>
						</div>
						<div class="w-1/3 mt-8 mb-4 mx-1 px-8 py-12 rounded border-2 border-slate-400 bg-white">
							<div class="w-full text-lg">目前的斡旋金總額:{{ useThousandSep(C01_totalAmt) }}</div>
							<FormKit 
								type="number"
								label="匯出斡旋金"
								v-model="outFund"
								value="1"
								min="1"
								:validation="C01Validation"
								help="請輸入要匯出的斡旋金金額, 我方人員會於下一個工作日為您轉帳, 銀行手續費將從出金金額中扣除，如金額較大將需要數個工作日。"
							/>
							<div class="w-20 h-12 bg-orange-500 text-white rounded text-center pt-3" @click="outFundSubmit()">送出</div>
						</div>
					</div>
				</section>							
				<section v-show="step=='D01'">
					<div v-if="liwaD01.length > 0" class="px-4 py-2 flex flex-col overflow-x-hidden overflow-y-auto">
						<div v-for="(object, index) in liwaD01" class="w-full py-2">
							<div class="flex flex-row relative">
								<div class="px-2 mr-4">{{ object.pDate }}</div>
								<div class="pr-20">{{ object.shortItems }}</div>
								<div class="w-8 absolute right-1 top-0" @click="toggleShow(index)">
			                        <IconChevronDown v-if="object.isShow=='0'" class="w-7 h-7 text-slate-500 font-bold" />
			                        <IconChevronUp v-else class="w-7 h-7 text-slate-500 font-bold" />
								</div>								
							</div>
							<div v-if="object.isShow == 1" class="mt-2">
								<div v-html="object.items" class="w-full px-8 py-2 bg-gray-200"></div>
							</div>
						</div>
					</div>
					<div v-else class="">暫無系統公告</div>
				</section>	
				<section v-show="step=='D02'">
					<div class="w-full mx-auto mt-2 py-2 flex flex-col bg-white border-8 border-gray-100 rounded-2xl">
						<div class="w-full py-2 px-8">
							<FormKit
								label=""
								type="text"
								v-model="D02_Comment"
								placeholder="請添加意見或問題..."
								help="請添加意見或問題"
								@keyup.stop.enter="saveD02()"
							/>
						</div>
					</div>
					<div v-if="liwaD02.length > 0" class="w-full py-2 px-8 flex flex-col overflow-x-hidden overflow-y-auto">
						<div v-for="(objD02, indexM) in liwaD02" class="w-full py-2">
							<div class="w-full flex flex-row relative">
								<div class="w-24 h-20 flex flex-col border-2 border-gray-200">
									<div class="w-12 h-12 mx-auto">
										<img :src="objD02.picpath" height="45" class="rounded-full"/>
									</div>
									<div class="w-full mt-2 text-center text-sm">{{ objD02.userNM }}</div>
								</div>
								<div class="w-[calc(100%_-_4rem)] p-2 ml-8 leading-8 flex flex-col">
									<div class="w-full">{{ objD02.sContent }}</div>
									<div class="w-full text-sm text-gray-500 text-left">{{ objD02.postTime }}
									</div>
								</div>
								<div v-if="Number(objD02.iType)==1" class="w-8 absolute right-1 top-0" @click="toggleShowD02(indexM)">
			                        <IconChevronDown v-if="objD02.isShow=='0'" class="w-7 h-7 text-slate-500 font-bold" />
			                        <IconChevronUp v-else class="w-7 h-7 text-slate-500 font-bold" />
								</div>
							</div>
							<div v-if="objD02.isShow == '1'" class="w-full ">
								<div v-if="objD02.arrDetail.length > 0" class="w-full m-2 ">
									<div v-for="(objD02D, indexD) in objD02.arrDetail.length" class="w-full pl-16 pr-2 py-2 box-border">
										<div class="w-full flex flex-row">
											<div class="w-24 h-20 py-2 flex flex-col border-2 border-gray-200">
												<div class="w-12 h-12 mx-auto">
													<img :src="sysIcon" height="40" class="rounded-full"/>
												</div>
												<div class="w-full text-center text-sm">JT.C</div>
											</div>
											<div class="w-[calc(100%_-_4rem)] p-2 ml-8 leading-8 flex flex-col">
												<div class="w-full">
													{{ Object.entries(objD02.arrDetail)[indexD][1].replyContent }}
												</div>
												<div class="w-full text-sm text-gray-500 text-left">{{ Object.entries(objD02.arrDetail)[indexD][1].replyTime }}</div>
											</div>
										</div>
									</div>
								</div>
								<div v-else class="w-full m-2">
									<div class="text-center py-20 font-bold text-gray-800 text-3xl">尚無回復</div>
								</div>							
							</div>
						</div>
					</div>
					<div v-else class="text-center py-20 font-bold text-gray-800 text-3xl">尚無意見或問題</div>
				</section>
			</div>
		</div>
	</div>
	<div class="invisible">
		<input 
			ref="imgInput" 
			class="w-11/12 h-8 bg-grey-100 hidden" 
			type="file" 
			accept="image/*" 
			@change.stop="handleImage"
		/>		
	</div>	
	<div class="invisible">
		<input 
			ref="imgInput2" 
			class="w-11/12 h-8 bg-grey-100 hidden" 
			type="file" 
			accept="image/*" 
		/>		
	</div>
	<Teleport to="body">
		<div
			v-if="isMsg" 
			class="w-full h-[100vh] fixed top-0 left-0 bg-slate-100 z-[500]"
		>
			<liwaMsg 
			  	:msgTitle="objMsg.title"
			  	:msgBody="objMsg.body"
			  	:modalType="objMsg.modalType"
			  	@hideMsg="hideMsg"
			  	@confirmOK="confirmOK"
			/> 			
		</div>		
	</Teleport>
</NuxtLayout>	
</template>

<style scope>
	.formkit-option {
		width:50%;
		float:left;
	}

	.actItem {
/*		max-width:calc(100% - 6rem);*/
		width:100%;
		line-height:4rem;
		border:1px solid #888;
		padding-left:1rem;
		position:relative;
		background-color: white;
	}

	.btnGT {
		width:3rem;
		height:3rem;
		position:absolute;
		top: 0rem;
		right:0px;
		text-align:center;
		font-size:1.5rem;
		cursor:pointer;
	}
</style>
