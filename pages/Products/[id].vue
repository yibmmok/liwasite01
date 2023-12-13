<script setup lang="ts">
	/*********************************************************
	prog name: 物件明細, author: James Lin, date: 2022/09/01
	Todo: 1. 串資料庫
	**********************************************************/
	import { ref, onMounted } from "vue"
	import { useWindowSize, useFetch, createFetch } from "@vueuse/core"
	import queryString from "query-string"
	import { copyText } from "vue3-clipboard"
	import useShowmode from "../../composables/use-showmode"
	import banner from "../../components/banner"
	import Carousel from '../../components/Carousel.vue'
	import Thumbnail from '../../components/Thumbnail.vue'	
	import liwaMsg from "../../components/liwaMsg.vue"
	import useThousandSep from "../../composables/use-ThousandSep.js"
	import useTimeAgo from "../../composables/use-timeagotw"
	import { IconPersonPlusFill, IconHeart, IconHeartFill, IconX, IconFacebook, IconLine, IconLink45deg, IconChevronDown, IconChevronUp } from '@iconify-prerendered/vue-bi'
	import 'swiper/css'
	import 'swiper/css/navigation'

	const route = useRoute()
	// banner starts
	const gemSysNM = ref('')
	const gemSyslink = ref('')
	const detailNM = ref('')
	const detailFlg = ref(true)
	const isSearch = ref(false)
	const isBanner = ref(true)
	// banner ends	
	const mainID = ref('')
	const userID = ref('')
	const APIsvr = ref('')
	const imgsvr = ref('')
	const liwaData = ref([])
	const liwaD1 = ref([])
	const liwaPDF = ref([])
	const liwa007M = ref([])
	const full_Path = ref('')
	const stitle = ref('')
	const descp = ref('')
	const shareDescp = ref('')

	const liwaPics = ref([])
	const Slide_imgWidth = ref('w-96')
	const slide = ref(0)
	const thumbs = ref(null)
	const liwaDirection = ref('vertical')
	const liwaClass = ref('h-[500px]')		
	const isLike = ref(false)
	const isQues = ref(false)

	const iPicWidth = ref(650)
	const isDone = ref(false)
	const isSeller = ref(false)
	const isCerti = ref(false)
	const certiPath = ref('')
	const isBargain = ref(false)
	const isMsg = ref('')
	const msgBargain = ref('')
	const lastBid = ref(0)
	const bidPrice = ref(0)
	const showBidPrice = ref(true)
	const isOff = ref(false)
	const status = ref(0)
	const sComment = ref('')
	const sysIcon = ref('')

	const loadData = async () => {
		let keydata = {
			'JWT':window.localStorage.getItem('liwaJWT'),
			'mainID': mainID.value
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/w021_haveDetail.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL[0]
		userID.value = data.data.value.userID
		status.value = liwaData.value.status
		stitle.value = liwaData.value.prodNM + ' | JT.C'
		if (Number(liwaData.value.hideScore==1)) liwaData.value.score == ''
		if (liwaData.value.BidPriceFinal == 0) liwaData.value.BidPriceFinal = '尚無出價記錄'
		shareDescp.value = liwaData.value.descp+liwaData.value.mktgDescp
		useHead({title:stitle.value})
		afterLoadData()	
	}

	const loadD3 = async () => {
		let keydata = {
			'JWT':window.localStorage.getItem('liwaJWT'),
			'mainID': mainID.value
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/w021_haveD3.php?${sQuery}`		
		const dataD3 = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaPics.value = dataD3.data.value.arrSQL
	}

	const loadD4 = async () => {
		let keydata = {
			'JWT':window.localStorage.getItem('liwaJWT'),
			'mainID': mainID.value
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/w021_haveD4.php?${sQuery}`			
		const dataD4 = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()	
		liwaPDF.value = dataD4.data.value.arrSQL
	}

	const loadLike = async () => {
		let keydata = {
			'JWT':window.localStorage.getItem('liwaJWT'),
			'mainID': mainID.value
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/w021_haveLike.php?${sQuery}`			
		const dataLike = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()	
		if (dataLike.data.value.arrSQL.length > 0) isLike.value = dataLike.data.value.arrSQL[0].isLike
	}

	const load021D1 = async () => {
		let keydata = {
			'JWT':window.localStorage.getItem('liwaJWT'),
			'mainID': mainID.value,
			'isSeller':1
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/w021_have021D1.php?${sQuery}`
		const dataD1 = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaD1.value = dataD1.data.value.arrSQL
	}

	const loadLastBid = async () => {
		let keydata = {
			'JWT':window.localStorage.getItem('liwaJWT'),
			'mainID': mainID.value
		}
		let sQuery = queryString.stringify(keydata)
		// let url = `${APIsvr.value}/w021_have021D1.php?${sQuery}`
		let url = `${APIsvr.value}/w021_haveBid.php?${sQuery}`
		const dataBid = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		lastBid.value = dataBid.data.value.arrSQL[0].bidPrice
		// let lastResult = dataBid.data.value.arrSQL[0].bidResult
		// console.log('lastResult =', lastResult)
		switch (Number(lastBid.value)) {
			case 0:
				showBidPrice.value = false
				msgBargain.value = `賣家尚未回覆您的出價, 請稍候`
				break;
			case 1:
				showBidPrice.value = false
				msgBargain.value = `恭喜您, 您的出價已成交, 請留意您的信箱通知`
				break;
			case -1:
					msgBargain.value = '您上次的出價, 因賣家逾期回覆, 系統自動拒絕, 您可以繼續出價。';
					break;
			case -2:
					showBidPrice.value = false
					msgBargain.value = '您上次的出價, 因賣家逾期回覆, 系統自動拒絕並結束本次斡旋, 您可於斡旋冷卻期過後, 再次進行斡旋。'
					isBargain.value = false
					liwaData.value.tmpBiderID = ''
					liwaData.value.remainBargain = 3
					liwaData.value.status = "1"
					status.value = "1"
					// console.log('liwaData =', liwaData.value)
					break;
			default:
				msgBargain.value = '您上次的出價 $' + useThousandSep(lastBid.value) + ' 已被拒絕, 您可以提高出價金額繼續'
		}
	}

	const load007M = async () => {
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT'),
			'mainID': mainID.value
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/w021_have007M.php?${sQuery}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwa007M.value = data.data.value.arrSQL
		liwa007M.value.forEach((n) => {
			n.isShow = 0
			n.postTime = useTimeAgo(n.postTime)
			n.arrDetail.forEach((r) => {
				r.replyTime = useTimeAgo(r.replyTime)
			})
		})
		// console.log('liwa007M =', liwa007M.value)
	}	

	const afterLoadData = () => {
		if (userID.value) {
			loadLike()
			if (userID.value == liwaData.value.sellerID) {
				// 若為賣家的處理
				isSeller.value = true
				// 載入該物件所有出價記錄
				load021D1()
			} else {
				if (userID.value == liwaData.value.tmpBiderID) {
					// 若為出價買家
					isBargain.value = true
					if (liwaData.value.remainBargain < 3) {
						// 本物件已至少出價一次, 顯示出價失敗訊息, 先取得上次出價
						loadLastBid()
					} else {
						msgBargain.value = '您已取得本物件的斡旋權利, 可針對本物件出價3次'
					}
					// 若物件進入待成交, isDone = true
					if (liwaData.value.status > 2) isDone.value = true
				}
			}
			load007M()
		}
		detailNM.value = liwaData.value.prodNM
		switch(liwaData.value.gemSys) {
			case 'A':
				gemSysNM.value = '鑽石館'
				gemSyslink.value = '/Products?imode=32'
				break;
			case 'B':
				gemSysNM.value = '彩寶館'
				gemSyslink.value = '/Products?imode=33'
				break;
			case 'C':
				gemSysNM.value = '翡翠館'
				gemSyslink.value = '/Products?imode=34'
				break;
			case 'D':
				gemSysNM.value = '軟玉館'
				gemSyslink.value = '/Products?imode=35'
				break;
		}				
	}

	const doCopy = () => {
		// 將 path 寫入 clipboard內
		copyText(full_Path.value, undefined, (error, event) => {
			if (error) {
				// 若複製失敗, 顯示錯誤訊息
				console.log('error =', error)
			} 
		})
	}

	const shareOnLINE = () => {
      const urlToShare = full_Path.value; // 將這裡替換為你想分享的網頁連結
      const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(urlToShare)}&text=${encodeURIComponent(stitle.value + " - " + shareDescp.value)}`;
      window.open(lineShareUrl, "_blank");		
	}

	const shareOnFacebook = () => {
      const urlToShare = full_Path.value; // 將這裡替換為你想分享的網頁連結
      const facebookAppId = "127440291228313"; // 請替換為你的Facebook App ID
      const facebookShareUrl = `https://www.facebook.com/dialog/share?app_id=${facebookAppId}&href=${encodeURIComponent(urlToShare)}&quote=${encodeURIComponent(stitle.value)}&description=${encodeURIComponent(shareDescp.value)}`;
      window.open(facebookShareUrl, "_blank");
	}		

	const toggleLike = async () => {	
		isLike.value = !isLike.value
		let sJWT = window.localStorage.getItem('liwaJWT')
		if (sJWT) {
			// 已登入可以設定收藏
			let keyData = {
				'JWT':sJWT,
				'mainID':mainID.value,
				'isLike': isLike.value
			}
			let datastr = JSON.stringify(keyData)
			// let nuAPI = '/api'
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
		    const { data } = await useMyFetch('w041_setD1.php').post().json()
		    let msg = data.value.message

		    if (msg) {
		    	// 顯示錯誤訊息
		    	showMsg('系統訊息', msg, 2)
		    }
		} else {
			// 未登入先設liwaNowLink, 再導到 login頁面
			window.sessionStorage.setItem('liwaNowLink', route.fullPath)
			window.location.href = '/login'			
		}
	}

	const toggleCerti = () => {
		isCerti.value = !isCerti.value
	}

	const closeCerti = () => {
		isCerti.value = false
	}

	const openBargain = async () => {
		// 先檢查是否登入, 若未登入, 跳login界面, 若已登入, 檢查物件是否斡旋或待成交, 再檢查買家的出價資格
		let sJWT = window.localStorage.getItem('liwaJWT')
		if (sJWT) {
			// 先檢查物件的 status > 1(是否斡旋或待成交)
			if ((status.value == 2) || (status.value == 3)) {
				showMsg('系統訊息', '本物件斡旋中, 請於斡旋失敗再出價', 1)
			} else {
				// 檢查user 是否被停權
				let keydata = {
					'JWT': sJWT,
					'prodID':mainID.value
				}
				let sQuery = queryString.stringify(keydata)
				let url = `${APIsvr.value}/w021_chkOffuser.php?${sQuery}`
				const datachk = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
				let msgOff = datachk.data.value.isOff

				if (msgOff) {
					msgBargain.value = msgOff
				} else {
					// 檢查該物件status及會員的斡旋金帳戶, 若有足夠餘額, 進入斡旋, 否則顯示斡旋金餘額不足訊息
					let keydata1 = {
						'JWT': window.localStorage.getItem('liwaJWT'),
						'mainID': mainID.value
					}
					let sQuery1 = queryString.stringify(keydata1)
					let url = `${APIsvr.value}/w021_openBargain.php?${sQuery1}`
					const dataBargain = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
					let msg = dataBargain.data.value.message
					if (msg) {
						// showMsg('斡旋訊息', msg, 1)
						msgBargain.value = msg
					} else {
						isBargain.value = true
						msgBargain.value = '您已取得本物件的斡旋權利, 可針對本物件出價3次'
					}				
				}
			}
		} else {
			// window.sessionStorage.setItem('liwaNowLink', route.fullPath)
			// window.location.href = '/login'	
			goLogin()			
		}	
	}

	const goLogin = () => {
		window.sessionStorage.setItem('liwaNowLink', route.fullPath)
		window.location.href = '/login'			
	}

	const submitPrice = async () => {

		let bStopFlag = false	
		// 出價必須大於0 且大於上次出價
		if (liwaData.value.remainBargain == 3) {
			if (bidPrice.value < 1 ) {
				bStopFlag = true
				msgBargain.value = '您的出價必須大於0'
			}
		} else {
			if (bidPrice.value < lastBid.value) {
				bStopFlag = true
				msgBargain.value = '您的出價必須大於或等於上次出價'
			}
		}
		if (bStopFlag == false) {	
			showMsg('系統訊息', '系統處理中, 請稍候...', 2)
			let keyData = {
				"JWT": window.localStorage.getItem('liwaJWT'),
				"prodID": mainID.value,
				"sellerID": liwaData.value.sellerID,
				"bidPrice": bidPrice.value
			}
			let datastr = JSON.stringify(keyData)
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
		    const dataSubmit = await useMyFetch('w021_setBidPrice.php').post().json()
			let msg = dataSubmit.data.value.message
			hideMsg()
		    if (!msg) {
		    	msgBargain.value = '您的出價('+bidPrice.value+')已送出'
		    	liwaData.value.remainBargain -= 1
		    	liwaData.value.BidPriceFinal =  bidPrice.value
		    	showBidPrice.value = false
		    } else {
		    	showMsg('系統訊息 - 出價錯誤', msg+'; 請聯絡平台服務人員, 並提供錯誤訊息', 2)	
		    }
		}
	}

	const setPriceBack = async (idx, iRes) => {
		showMsg('系統訊息', '系統處理中, 請稍候...', 2)
		let keyData = {
			"JWT": window.localStorage.getItem('liwaJWT'),
			"prodID": mainID.value,
			"sellerID": userID.value,
			"bidDateTime": liwaD1.value[idx].bidDateTime,
			"bidResult": iRes
		}
		let datastr = JSON.stringify(keyData)
		// console.log('datastr in setPriceBack =', datastr)
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
	    const dataBack  = await useMyFetch('w021_setPriceBack.php').post().json()
	    console.log('data in setPriceBack =', dataBack, 'isMsg =', isMsg.value)
	    let msg = dataBack.data.value.message
	    hideMsg()
	    if (!msg) {	    	
	    	liwaD1.value[idx].bidResult =1
	    } else {
	    	showMsg('系統訊息', msg+'; 請聯絡平台服務人員, 並提供錯誤訊息', 2)
	    }
	}

	const cancelBargain = async () => {
		// 取消斡旋
		showMsg('系統訊息', '結束斡旋處理中, 請稍候...', 2)
		let keydata = {
			'JWT':window.localStorage.getItem('liwaJWT'),
			'mainID': mainID.value
		}
		let sQuery = queryString.stringify(keydata)
		let url = `${APIsvr.value}/w021_closeBargain.php?${sQuery}`
		const dataBargainOff = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		// console.log('dataBargainOff in cancelBargain =', dataBargainOff)
		let msg = dataBargainOff.data.value.message
		hideMsg()
		// console.log('isMsg =', isMsg.value)
		if (msg) {
			showMsg('系統訊息 - 結束斡旋錯誤', msg+';請聯絡平台服務人員, 並提供錯誤訊息', 2)
		} else {
			isBargain.value = false
			msgBargain.value = ''
		}	
	}

	const setSlide = (idx) => {
		slide.value = idx
	}

	const getSellerLink = () => {
		return '/Products?memberID=' + liwaData.value.sellerID
	}

	const replaceTxt = (str) => {
		return str.replace(/n/g, "</p><p>")? `<p>${str.replace(/n/g, "</p><p>")}</p>`:str
	}

	const toggleShow007M = (idx) => {
    	let iShow = liwa007M.value[idx].isShow
        let iNuShow = (iShow == "0")? "1": "0"
        liwa007M.value[idx].isShow = iNuShow
    } 	

    const send007M = async () => {
    	if (sComment.value) {
    		let keydata = {
    			'JWT': window.localStorage.getItem('liwaJWT'),
    			'prodID': mainID.value,
    			'sContent': sComment.value
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
		    const { data } = await useMyFetch('w021_007Medit.php').post().json()
		    let msg = data.value.message
		    console.log('msg =', msg)	
		 	if (!msg) {
		 		sComment.value = ''
		 		liwa007M.value = []
		 		load007M()
		 	} else {
		 		showMsg('系統訊息', '存檔錯誤'+data.value.message, 2)
		 	}	
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
		// alert("Press the Confirm button")
		isMsg.value = false
	}
	// 設定對話盒相關 ends	

	onMounted(() => {
		const { width, height } = useWindowSize()
		// 若小於預設螢幕寬度, 則設為預設螢幕寬度
		if (width.value < iPicWidth.value) {
			iPicWidth.value = width.value - 20
		}

		// 取得 mainID, 由mainID取得
		mainID.value = route.params.id
		full_Path.value = route.fullPath
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		full_Path.value = 'https://www.jewelrytrade.center' + full_Path.value
		loadD3()
		loadD4()			
		loadData()
		sysIcon.value = window.sessionStorage.getItem('liwaImgsvr') + '/syspics/sysIcon.png'
	})

	// definePageMeta({
	//   layout: "web",
	//   colorMode: "light"
	// })		

</script>

<template>
<NuxtLayout name="web">		
	<div class="w-full h-[100vh] bg-white absolute top-[148px] lg:top-[100px] left-0 z-50" v-if="liwaData.length == 0">
		<div class="w-48 mx-auto pt-[45vh] text-4xl text-black">資料載入中, 請稍候</div>
	</div>
	<div v-else class="w-full">
		<div class="w-full h-28 lg:h-16 -mt-3 pt-1 bg-black flex flex-row justify-between relative">
			<banner
				:gemSysNM="gemSysNM"
				:gemSyslink="gemSyslink"
				:isSearch="isSearch"
				:detailFlg="detailFlg"
				:detailNM="detailNM"
				:isBanner="isBanner"
			></banner>
			<div class="w-36 absolute top-[4rem] lg:top-6 right-2">
				<div class="w-auto h-8 flex flex-row-reverse justify-evenly">
					<!-- 連結分享 -->
					<div class="w-8 h-8 cursor-pointer" @click="doCopy()">
						<IconLink45deg class="w-8 h-8 text-slate-50" />
					</div>
					<!-- 社交媒體分享 -->
					<div class="w-8 h-8 rounded bg-black pt-[.125rem]" @click="shareOnLINE()">
						<IconLine class="w-8 h-8 text-slate-50" />
					</div>
					<div class="w-8 h-8 rounded bg-black pt-[.125rem] pl-[.125rem]" @click="shareOnFacebook()">
						<IconFacebook class="w-7 h-7 text-sm text-white" />
					</div>						
				</div>
			</div>		
		</div>
		<div class="mainBox relative w-full flex flex-col lg:flex-row bg-stone-100 py-4 lg:py-8">
			<div class="w-full lg:w-2/5">
				<div class="w-full min-h-[380px] lg:h-[500px] mx-auto my-0 relative flex flex-row">
					<div class="hidden lg:block lg:w-1/3 min-h-[380px] lg:h-[500px] ml-8 mt-12 bg-transparent">
						<Thumbnail  
							:currentSlide="slide" 
							:liwaData="liwaPics" 
							:liwaClass="liwaClass"
							:liwaDirection="liwaDirection"
							:slideCSS="'h-[100px]'"
							@thumbs="thumbs"
							@setSlide="setSlide"
						/>
					</div>
					<div class="w-full lg:w-3/5 h-auto ml-0 lg:ml-[40px] pt-[50px] bg-transparent">
						<Carousel 
							:currentSlide="slide" 
							:thumbs="thumbs" 
							:liwaData="liwaPics" 
							:imgWidth="Slide_imgWidth"
							:slideSpace="30"
						/>
					</div>
				</div>
			</div>
			<div class="w-full lg:w-3/5 px-4 lg:px-16 pt-4 relative">
				<h1 class="w-full text-4xl text-slate-700 font-bold mt-2 mb-6 pb-6 border-b-2 border-b-slate-200 word-wrap">{{ liwaData.prodNM }}<span v-if="status==3">(待成交)</span></h1>
				<div class="w-full flex flex-row my-12">
					<div class="w-1/2">
						<p class="text-sm font-bold text-slate-400 mb-2">期望售價</p>
						<p class="text-lg pl-3 text-slate-600">NTD {{ useThousandSep(liwaData.sellPrice) }}</p>
					</div>
					<div class="w-1/2 border-l-2 border-l-slate-100" v-if="status == 9">
						<p class="text-sm font-bold text-slate-400 mb-4">成交價</p>
						<p class="text-lg pl-3 text-slate-600">NTD {{ useThousandSep(liwaData.donePrice) }}</p>			
					</div>
				</div>
				<div class="w-full flex flex-row my-12">
					<div class="w-full">
						<p class="text-sm font-bold text-slate-400 mb-2">賣家</p>
						<p class="text-lg pl-3 text-slate-600 cursor-pointer"><a :href="getSellerLink()">{{ liwaData.sellerID }}  (<span class="text-blue-500">{{ liwaData.sellerCount }}</span>)</a></p>
					</div>
				</div>
				<div class="w-full my-12">
					<p class="text-sm font-bold text-slate-400 mb-2">上架截止日</p>
					<p class="text-lg pl-3 text-slate-600">{{ liwaData.expDate }}</p>
				</div>
				<div class="w-full my-12">
					<p class="text-sm font-bold text-slate-400 mb-2">最後出價</p>
					<p class="text-lg pl-3 text-slate-600">{{ useThousandSep(liwaData.BidPriceFinal) }}</p>
				</div>			
				<!-- 收藏該物件按鈕 -->
				<div class="w-28 h-12 pl-4 pt-3 absolute right-4 bottom-0 bg-emerald-500 rounded-2xl flex flex-row" v-if="isSeller == false" @click.once="toggleLike">
					<IconHeart v-if="isLike==false" class="w-7 h-7 text-red-400 font-bold" />
					<IconHeartFill v-else class="w-7 h-7 text-red-400 font-bold" />
					<span class="w-12 text-white ml-2 ">收藏</span>
				</div>
			</div>
		</div>
		<div class="w-full bg-stone-200 py-12" v-if="isDone == false">
			<div v-if="isSeller == false" class="w-full lg:w-[800px] mx-auto py-4" >
				<div class="w-full flex flex-row">
					<span>斡旋人次:</span>
					<span class="ml-4 mr-4">{{ liwaData.bargainCount }}</span>
				</div>
				<div v-if="isBargain == false" class="w-full pt-6 pb-12 ">
					<p v-if="msgBargain" class="py-1 text-red-500">{{ msgBargain }}</p>
					<div class="w-24 h-8 rounded-lg bg-emerald-500 text-white text-center pt-1 mx-auto cursor-pointer" @click.once="openBargain()">我要出價</div>
				</div>
				<div v-else class="w-full py-4">
					<p class="py-4">可出價次數: {{ liwaData.remainBargain }}</p>
					<p class="py-4 text-red-500">{{ msgBargain }}</p>
					<div v-show="showBidPrice" class="w-full h-12">
						<div class="w-full lg:w-[60%] flex flex-row lg:mx-auto">
							<div class="w-8 h-full">NT$</div>
							<input type="text" class="text-right border-0 border-b-2 border-b-slate-700 pr-4" placeholder="請輸入出價" v-model="bidPrice">
							<div class="w-24 h-8 rounded-lg bg-emerald-400 text-white text-center pt-1 ml-2 cursor-pointer" @click.once="submitPrice()">送出</div>
							<div class="w-24 h-8 rounded-lg bg-red-400 text-white text-center pt-1 ml-2 cursor-pointer" @click.once="cancelBargain()">取消斡旋</div>
						</div>
					</div>
				</div>
			</div>		
			<div v-else class="w-full lg:w-[900px] mx-auto py-2" style="min-height:8rem;">
				<div class="w-full h-10 font-bold bg-white pl-4 pt-2">斡旋記錄</div>
				<div class="w-full min-h-[350px] border-2 border-slate-600 bg-white">
					<div class="pb-2 align-middle inline-block min-w-full">
						<div class="shadow border-b border-gray-500 bg-white">
							<table class="min-w-full divide-x divide-y divide-gray-200 bg-white">
								<thead class="bg-gray-50">
									<tr class="bg-slate-300">
										<th class="w-1/3 text-center">日期</th>
										<th class="w-1/3 text-center">買方</th>
										<th class="w-1/3 text-center">出價</th>
									</tr>
								</thead>
								<tbody v-if="liwaD1.length > 0" class="w-full bg-white ring-1 ring-gray-50">
									<tr v-for="(record, index) in liwaD1" class="odd:bg-white even:bg-slate-200">
										<td scope="col" class="tdPanel w-1/3">{{ record.bidDateTime }}</td>
										<td scope="col" class="tdPanel w-1/3">{{ record.biderID }}</td>
										<td scope="col" class="tdPanel w-1/3">
											<span class="float-left">NTD {{ useThousandSep(record.bidPrice) }}</span>
											<div v-if="record.bidResult==0" class="w-24 flex flex-row ml-4">
												<div class="w-12 h-6 ml-2 rounded-lg bg-emerald-400 text-white text-center cursor-pointer"
												@click.once="setPriceBack(index, 1)"
												>
													同意
												</div>
												<div class="w-12 h-6 ml-2 rounded-lg bg-red-400 text-white text-center cursor-pointer"
												@click.once="setPriceBack(index, -1)"
												>
													拒絕
												</div>
											</div>
										</td>
									</tr>
								</tbody>
							</table>						
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="w-full bg-white">
			<div class="w-full lg:w-[900px] mx-auto py-4 flex flex-col lg:flex-row">
				<div class="w-full pl-4 py-4 text-md flex flex-row" v-if="useShowmode()==1">
					<span class="text-slate-400">評分:</span>
					<span class="ml-2 text-blue-500 font-semibold">{{ liwaData.score }}</span>
				</div>
				<div class="w-72" v-else>
					<p class="text-sm font-bold text-slate-400 mb-2">評分</p>
					<p v-if="liwaData.hideScore==0" class="text-5xl pl-3 text-blue-500 font-bold">{{ liwaData.score }}</p>
					<p v-else class="text-5xl pl-3 text-blue-500 font-bold">無評分</p>
				</div>
				<div class="w-full flex flex-col lg:w-[calc(100%_-_18rem) lg:px-4">
					<div class="w-full p-4">
						<p class="text-sm font-bold text-slate-400 mb-2">說明</p>
						<div class="descp w-full mb-2 leading-8" v-html="liwaData.descp">
						</div>
						<div class="descp w-full leading-8" v-html="liwaData.mktgDescp"></div>
					</div>
					<div class="w-full p-4">
						<p class="text-sm font-bold text-slate-400 mb-2">鑑定證書</p>
						<div class="descp w-full ">
							<span v-for="(item, index) in liwaPDF">
								[<a :href="item">證書{{ index+1 }}</a>]
							</span>
						</div>
					</div>				
					<div class="w-full p-4 border-b-2 border-b-slate-300">
						<div class="w-full flex flex-row">
							<div class="text-sm font-bold text-slate-400 mb-2 mr-2">鑑定師意見</div>
						</div>
						<div class="descp w-full" v-text="liwaData.certiMemo">
						</div>
					</div>
					<div class="w-full flex flex-row pt-8">
						<div class="w-24 pl-3 border-r-2 border-r-slate-400 cursor-pointer"><a href="/BargainInfo">斡旋須知</a></div>
						<div class="w-32 pl-8 cursor-pointer"><a href="/QnA">常見Q & A</a></div>
						<!-- <div class="w-64 pl-8 cursor-pointer" @click="isQues = !isQues">我要提問</div> -->
					</div>
				</div>
			</div>
		</div>		
		<div class="w-full min-h-[280px] bg-stone-200 text-white">
			<div class="w-full lg:w-[900px] mx-auto mt-8 py-2 flex flex-col  rounded-2xl">
				<div v-if="userID" class="w-full py-2 px-8">
					<div v-if="!isSeller" class="w-full">
						<FormKit
							label=""
							type="text"
							v-model="sComment"
							placeholder="請添加意見或問題..."
							help="請添加意見或問題, 並按[Enter]送出"
							@keyup.stop.enter="send007M()"
						/>						
					</div>
				</div>
				<div v-else class="w-full py-2 px-8">
					<div class="w-full px-8 py-2 rounded-lg bg-emerald-500 text-white text-center pt-1 mx-auto cursor-pointer" @click="goLogin()">請先登入再提出問題或發表意見</div>
				</div>
			</div>
			<div v-if="liwa007M.length > 0" class="w-full lg:w-[900px] mx-auto py-2 px-8 flex flex-col overflow-x-hidden overflow-y-auto ">
				<div v-for="(obj007M, indexM) in liwa007M" class="w-full py-2">
					<div class="w-full flex flex-row relative text-slate-600">
						<div class="w-24 h-20 flex flex-col">
							<div class="w-12 h-12 mx-auto">
								<img :src="obj007M.picpath" height="45" class="rounded-full"/>
							</div>
							<div class="w-full mt-2 text-center text-sm">{{ obj007M.userNM }}</div>
						</div>
						<div class="w-[calc(100%_-_4rem)] p-2 ml-8 leading-8 flex flex-col">
							<div class="w-full">{{ obj007M.sContent }}</div>
							<div class="w-full text-sm text-gray-500 text-left">{{ obj007M.postTime }}
							</div>
						</div>
						<div class="w-8 absolute right-1 top-0" @click="toggleShow007M(indexM)">
	                        <IconChevronDown v-if="obj007M.isShow=='0'" class="w-7 h-7 text-slate-500 font-bold" />
	                        <IconChevronUp v-else class="w-7 h-7 text-slate-500 font-bold" />
						</div>
					</div>
					<div v-if="obj007M.isShow == '1'" class="w-full text-slate-600">
						<div v-if="obj007M.arrDetail.length > 0" class="w-full m-2 ">
							<div v-for="(obj007MD, indexD) in obj007M.arrDetail.length" class="w-full pl-16 pr-2 py-2 box-border">
								<div class="w-full flex flex-row">
									<div class="w-24 h-20 py-2 flex flex-col border-2 border-gray-200">
										<div class="w-12 h-12 mx-auto">
											<img :src="sysIcon" height="40" class="rounded-full"/>
										</div>
										<div class="w-full text-center text-sm">JT.C</div>
									</div>
									<div class="w-[calc(100%_-_4rem)] p-2 ml-8 leading-8 flex flex-col">
										<div class="w-full">
											{{ Object.entries(obj007M.arrDetail)[indexD][1].replyContent }}
										</div>
										<div class="w-full text-sm text-gray-500 text-left">{{ Object.entries(obj007M.arrDetail)[indexD][1].replyTime }}</div>
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
		</div>
	</div>	

	<teleport to="body">
		<div class="w-full h-[70vh] absolute top-[70px] bg-slate-100" v-if="isCerti == true">
			<div class="w-full lg:w-[800px] h-full mx-auto my-0 relative">
				<h1 class="w-full h-12 text-2xl">鑑定證書</h1>
				<div class="w-full h-full border-2 border-emerald-400 overflow-x-hidden overflow-y-auto">
					<iframe :src="certiPath" frameborder="0" class="w-full h-full"></iframe>
				</div>
				<div class="w-12 h-12 absolute top-0 right-0 cursor-pointer" @click.stop="closeCerti">
					<IconX class="w-7 h-7 text-white font-bold" />
				</div>				
			</div>
		</div>
	</teleport>
	<teleport to="body">
		<div
			v-if="isMsg" 
			class="w-full h-[150vh] fixed top-[200px] left-0 bg-slate-100 z-[500]"
		>
			<liwaMsg 
			  	:msgTitle="objMsg.title"
			  	:msgBody="objMsg.body"
			  	:modalType="objMsg.modalType"
			  	@hideMsg="hideMsg"
			  	@confirmOK="confirmOK"
			/> 			
		</div>		
	</teleport>	
</NuxtLayout>	
</template>

<style scoped>
	@font-face {
	    font-family:"SungTC";
	    src: local("SungTC"), url('../../assets/fonts/SungTC.otf') format("opentype");
	}

	body {
		position:relative;
	}

	.swiper {
		min-height:380px;
	}

	.swiper-android .swiper-slide, .swiper-wrapper  {
		min-height:350px;
		transform: translate3d(0px, 0px, 0px);
	}

/*	.descp p
	{
		margin: 1rem 1rem;
		line-height: 25px;
	}*/

	.descp span
	{
		margin-left:0.5rem;
	}

	.descp021 {
		font-family: SungTC;
		letter-spacing: 0.2rem;
		font-size: 1.2rem;
		font-style: italic;
		margin: 1rem 1rem;
		line-height: 25px;
	}	

	.descp >>> .b {
		font-family: SungTC;
		letter-spacing: 0.2rem;
		font-size: 1.2rem;
		font-style: italic;
		margin: 1rem 1rem;
		line-height: 25px;
	}
</style>