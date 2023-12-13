<script setup lang="ts">
    /*********************************************************
    prog name: 常見Q&A, author: James Lin, date: 2022/11/02
    Todo: 
    **********************************************************/	
    import { ref, onMounted } from "vue"
    import { useFetch, createFetch, useTitle } from "@vueuse/core"
    import queryString from "query-string"
    import { IconChevronDown, IconChevronUp } from '@iconify-prerendered/vue-bi'

    // const isShow = ref(false)
    const iValue = ref(-1)
    const APIsvr = ref('')
    const liwaData = ref([])

    const toggleShow = (idx) => {
    	iValue.value = idx
    	let iShow = liwaData.value[idx].isShow
        let iNuShow = (iShow == "0")? "1": "0"
        liwaData.value[idx].isShow = iNuShow
    }

    const loadData = async () => {
        let url = `${APIsvr.value}/WQnA_havelist.php`
        const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
        liwaData.value = data.data.value.arrSQL     
    }

    onMounted(() => {
        useHead({title:`常見Q&A`})
        APIsvr.value = window.sessionStorage.getItem('liwaAPIsvr') 
        loadData()
    })

    // definePageMeta({
    //   layout: "web",
    //   colorMode: "light"
    // })       	
</script>

<template>
<NuxtLayout name="web">     
<div class="w-full lg:w-[1024px] lg:mx-auto">
    <div class="w-full ">
        <!-- 網頁內容由此開始 -->
		<div v-if="liwaData.length" class="w-full min-h-[80vh] mt-5 overflow-x-hidden overflow-y-auto bg-white relative">
			<div
				v-for="(ques,index) in liwaData"
				:key="index"
				class="flex flex-col"
			>
				<div class="w-full flex flex-row cursor-pointer">
					<div class="w-[calc(100%_-_2rem)] text-2xl font-semibold text-black-500 mt-5 ml-3">{{ ques.question }}
					</div>
					<div class="w-8 pt-6" @click="toggleShow(index)">
                        <IconChevronDown v-if="ques.isShow=='0'" class="w-7 h-7 text-slate-500 font-bold" />
                        <IconChevronUp v-else class="w-7 h-7 text-slate-500 font-bold" />
					</div>	
								
				</div>
				<div 
					v-if="ques.isShow=='1'" 
					class="w-full bg-white pb-8"
				>
					<div 
                        v-html="ques.answer"
                        class="pAns text-md mt-5 ml-3 bg-slate-100"></div>			
				</div>					
			</div>
		</div>
	</div>
</div>
</NuxtLayout>
</template>

<style scope>
    .pAns p{
        line-height:30px;
    }
</style>