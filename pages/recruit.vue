<script setup lang="ts">
	/*********************************************************
	prog name: 二手賣家招募網頁, author: James Lin, date: 2023/08/24
	主要功能: 顯示二手賣家招募訊息
	**********************************************************/
	const APIsvr = ref('')
	const Imgsvr = ref('')
	const bgUrlmain = ref('')

	onMounted(() => {
		useHead({title:'二手珠寶賣家招募中'})
		APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr')
		Imgsvr.value = window.sessionStorage.getItem('liwaImgsvr')
		bgUrlmain.value = `${Imgsvr.value}/syspics/recruit_main.png`
	})
</script>

<template>
<NuxtLayout name="web">		
	<div class="w-full flex flex-col" style="background-color:#231815;">
		<section class="w-full lg:w-[1024px] mx-auto">
			<h1 class="mt-4 mb-4 text-3xl md:text-5xl text-white text-center">二手珠寶賣家招募中</h1>
		</section>
		<section class="w-full py-8">
			<div class="w-full lg:w-[1024px] mx-auto flex flex-col lg:flex-row justify-end relative" style="background-image: url('//imgsvr.jewelrytrade.center/syspics/recruit_Bg01.png');">
				<div class="w-full lg:hidden ">
					<img :src="bgUrlmain" alt="二手珠寶賣家招募中" />
				</div>
				<div class="w-full lg:w-1/2 p-8 bg-white">
					<h2 class="my-2 text-orange-500 text-2xl">珠寶交易新模式</h2>
					<p class="my-2 text-sm italic">探索珠寶交易的全新模式！歡迎來到我們的二手珠寶交易網站，一個專為熱愛珠寶的您而設計的平台。我們深知，每一件珠寶背後都有一個故事，而這些珍貴的故事值得被分享和傳承。為了確保每一次的交易都是真實可信的，我們提供專業的鑑定服務，確保您所購買或出售的二手珠寶都是真貨。不再擔心造假的風險，我們致力於打造一個安全可靠的二手珠寶交易平台。</p>
					<h2 class="my-2 text-orange-500 text-2xl">無壓力交易</h2>
					<p class="my-2 text-sm italic">我們的交易方式與房屋仲介的模式相似，讓您在交易過程中保有更多的自主權。我們絕不介入買家與賣家的喊價，更不會干涉交易的定價。這就是我們致力於創建公正交易環境的承諾。在交易成功後，我們會在確保買家支付交易金額後，再將款項轉至賣家帳戶。這一機制不僅保障了買家的權益，同時也確保了賣家的收益安全。</p>
					<h2 class="my-2 text-orange-500 text-2xl">擴展市場 專業支持</h2>
					<p class="my-2 text-sm italic">成為我們的賣家，將為您帶來更廣闊的市場機會。您的物品將在我們的平台上展示，吸引眾多網上買家的目光。我們的平台不僅為您提供曝光機會，同時也為您的物品提供買家的驗證，確保您能夠得到令您滿意的出價。最重要的是，現在加入我們的賣家行列完全免費！前100名註冊的賣家更有幸免除上架費用，立即把握這個難得的機會。</p>
					<h2 class="my-2 text-orange-500 text-2xl">現在加入 享受優惠</h2>
					<p class="my-2 text-sm italic">我們邀請您成為我們的一員，一同開啟您的二手珠寶之旅。在這裡，您不僅能夠交易珠寶，更能夠分享您的故事、收藏和熱愛。我們的使命是建立一個安全、透明且有趣的交易平台，讓每一個人都能夠輕鬆愉悅地參與其中。立即註冊，成為前100名賣家之一，一同享受優惠，開啟屬於您的珠寶交易新篇章！</p>
					<div class="w-full rounded-lg py-2 text-center bg-red-900 text-white text-2xl"><NuxtLink to="/regis">按我加入會員!</NuxtLink></div>
				</div>
			</div>
		</section>
	</div>
</NuxtLayout>
</template>

<style scope>
	@font-face {
	    font-family:"SungTC";
	    src: local("SungTC"), url('../assets/fonts/SungTC.otf') format("opentype");
	}

	.paragTitle {
		font-family: SungTC;
		font-size:2rem;
		margin: 1rem 0;
	}
</style>