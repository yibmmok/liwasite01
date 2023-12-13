<script setup lang="ts">
  /*********************************************************
  prog name: 使用者登入, author: James Lin, date: 2022/10/06
  Todo: 

  **********************************************************/
	import { ref, onMounted} from "vue"
	import { useFetch, createFetch, useStorage } from "@vueuse/core"
	import queryString from "query-string"
	import liwaMsg from "../../components/liwaMsg.vue"

	const APIsvr = ref('')
	const submitted = ref(false)
	const liwaData = ref({
		'mobile':'',
		'password':'',
		'siteKey': '6LfXLuwjAAAAAFXbAQPm82-X6ArjiMcEIEelQTXZ'
	})
	const res = ref({})
	const msg = ref('')
	// const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()

	const submitlogin = async () => {
		// liwaData 加入jwttoken pair
		let sJWT = window.localStorage.getItem('liwaJWT')
		liwaData.value.JWT = ((sJWT === 'undefined') || (sJWT === ''))? '' : sJWT
		liwaData.value.siteKey = '6LfXLuwjAAAAAFXbAQPm82-X6ArjiMcEIEelQTXZ';
		let datastr = JSON.stringify(liwaData.value)
		const useMyFetch = createFetch({
		  baseUrl: APIsvr.value,
		  options: {},
		  fetchOptions: {
		    mode: 'cors',
		    headers: new Headers({
		      'Content-Type': 'multipart/form-data'
		    }),
		    body: JSON.stringify(liwaData.value)
		  }
		})

		const { data } = await useMyFetch('web_login.php').post().json()
		if (data.value.arrSQL.length > 0) res.value = data.value.arrSQL[0]
		if (res.value.message == "") {
			// Login 成功, 先設定 sessionStorage
			window.localStorage.setItem('liwaJWT', res.value.token)
			window.sessionStorage.setItem('liwaUserIconPath', res.value.picpath)
			window.sessionStorage.setItem('liwaImgsvr', res.value.imgsvr)
			window.sessionStorage.setItem('liwaAPIsvr', res.value.apisvr)
			//取得 liwaNowLink, 若 liwaNowLink !== '/', 跳到 liwaNowLink, 否則 /Profile
			let NowLink = window.sessionStorage.getItem('liwaNowLink')
			window.location.href=(NowLink !== '/') ? NowLink : '/Profile'
		} else {
			msg.value = res.value.message

		}
	}

	const resetPswd = async () => {
		// 重設密碼, 先取得已輸入的手機號碼
		let sMobile = liwaData.value.mobile
		if (sMobile) {
			let passData = {
				// 'JWT': window.localStorage.getItem('liwaJWT'),
				'mobile': sMobile,
				'debug': 0
			}
			let datastr = JSON.stringify(passData)
			// 先檢查該手機是否存在
			let sQuery = queryString.stringify(passData)		
			let url = `${APIsvr.value}/sys_webChkMobile.php?${sQuery}`
			const dataMobile = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
			let msgMobile = dataMobile.data.value.message
			if (!msgMobile) {
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
			  const { data } = await useMyFetch('sys_webresetPSWD.php').post().json()
			  // 回傳2個結果: 1.發送成功, 2.發送失敗, 都顯示在msg
			  let sMsg = data.value.message
			  if (sMsg) msg.value = data.value.message
			  else msg.value = data.value.key				
			} else {
				// 手機號碼找不到, 導到 regis頁面
				msg.value = msgMobile
				const myTimeout = setTimeout(() => window.location.href = '/regis', 5000)
				
			}
		} else {
			msg.value = '請輸入註冊時的手機號碼'
		}
	}

	onMounted(() => {
		useHead({title:`登入`})
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
	})

	// definePageMeta({
	// 	colorMode:'light',
	//   layout:"web",
	// })  
</script>

<template>
<NuxtLayout name="web">		
<div class="w-full bg-white flex flex-col lg:flex-row justify-center lg:justify-end items-start">
	<div class="hidden md:block md:w-full lg:w-[80vw] lg:h-[90vh] bg-black relative">
		<img src="https://imgsvr.jewelrytrade.center/syspics/login_nuBK_raw.jpg" alt="JewelryTrade.Center" class="w-full mt-36 lg:mt-0 lg:h-[90vh]"/>
		<div class="absolute top-20 right-30 text-5xl lg:text-7xl text-yellow-200 tracking-[1.1rem]">安心交易</div>
		<div class="absolute left-1 bottom-1">
			<img src="https://imgsvr.jewelrytrade.center/syspics/Logo_web.jpg" alt="JewelryTrade.Center Logo" class="w-[150px] lg:w-[250px]">
		</div>
	</div>
	<div class="w-full lg:max-w-sm mt-2 pt-4 bg-white">
		<div class="bg-white m-2 rounded-xl pb-1">
			<div class="bg-white px-10 py-5 w-full lg:max-w-sm">
				<h1 class="text-center text-2xl font-semibold text-gray-600 underline underline-offset-8 decoration-orange-500 tracking-[1.5rem]">會員登入</h1>
			</div>
		</div>
		<FormKit 
		form-class="px-4 py-2 bg-gray-100 rounded-2xl w-11/12"
		v-model="liwaData"
		type="form"
		:form-class="submitted? 'hidden': 'block'"
		style="margin: 1rem auto;"
		submit-label="登入"
		@submit="submitlogin"
		>
	        <FormKit
	          name="mobile"
	          label="請輸入手機號碼"
	          type="text"
	          placeholder="請輸入手機號碼"
	          help="請輸入您的手機號碼, 共10碼, 無空白"
	          validation="required|number|length:10"
	        />
	        <FormKit
	          name="password"
	          label="密碼"
	          type="password"
	          help="請輸入密碼"
	          :validation="required"
	        />
<!-- 	        <div class="w-full h-12 my-2">
	        	<div class="w-32 h-12 bg-emerald-400 text-white py-2 text-center" @click="recaptcha">我不是機器人</div>
	        </div> -->
	        
		</FormKit>
		<div v-if="msg" class="w-full h-8 bg-white pl-4 text-red-400 mb-4">
			{{ msg }}
		</div>
		<div class="w-full flex flex-row justify-start text-red-400">
			<div class="w-1/2 h-8 bg-white text-left pl-4 cursor-pointer" @click="resetPswd">忘記密碼
			</div>
			<div class="w-1/2 h-8 text-indigo-400 text-right pr-4 cursor-pointer">
				<NuxtLink to="/regis">
					<div>註冊</div>
				</NuxtLink>				
			</div>
		</div>
	</div>  
</div>
</NuxtLayout>
</template>

<style scope>
  .formkit-outer {
    margin-bottom: 1.25rem;
  }
</style>