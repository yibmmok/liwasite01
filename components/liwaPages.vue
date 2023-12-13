<script setup lang="ts">
	import { ref, reactive, onMounted } from "vue"
	import useShowmode from "../composables/use-showmode"

	const arrPage = ref([])

	const props = defineProps({
	  page: {
	    type: Number,
	    default:1
	  },
	  totalPage: {
	    type: Number,
	    default: []
	  }
	})

	const state = reactive({
		page: props.page,
		totalPage: props.totalPage
	})

	const emits = defineEmits(["setActvPage"])

	const setPages = () => {
		let actvClass = ''
		let totItems = arrPage.value.length
		if (state.totalPage < (totItems - 1)) {
			// 若總頁數少於arrPage.length的處理
			for(let i=0; i<state.totalPage; i++) {
				// 為當前頁設定class
				actvClass = (i == (state.page-1)) ? ' bg-pink-600 text-white': 'bg-gray-200'
				arrPage.value[i] = {
					isShow: true,
					sVal: i+1,
					pageID: i+1,
					activeClass: actvClass
				}
			}
		} else {
			let pageLimit = (useShowmode() > 1)? 6 : 4
			let pageRange = (useShowmode() > 1)? 8 : 6 // dynamic pages 頁位
			for(let i=0; i<totItems; i++) {
				actvClass = (state.page == (i+1))?' bg-pink-600 text-white':'bg-gray-200'
				arrPage.value[i] = {
					isShow: true,
					sVal: i+1,
					pageID: i+1,
					activeClass: actvClass
				}
			}
			// 取得當前頁之前的頁位數
			let iStartLimit = (useShowmode() > 1)? 3: 2
			// 設定dynamic pages, 若為最末段頁, 限定最末段頁的起始頁
			let iStart = ((state.page - iStartLimit) > (state.totalPage - (pageRange - 1)))?state.totalPage - (pageRange - 1) :state.page - iStartLimit
			if ((iStart - iStartLimit) >2) {
				// 若非最末段頁, 設定dynamic pages 的頁碼段
				for(let j=2; j < (totItems - 1); j++) {
					actvClass = (iStart==state.page) ? ' bg-pink-600 text-white': 'bg-gray-200 text-black'
					arrPage.value[j] = {
						isShow: true,
						sVal: iStart,
						pageID: iStart,
						activeClass: actvClass
					}
					iStart++
				}
				if (state.page > pageLimit) {
					// 設定第二頁碼位的顯示
					let superPrev = ((state.page - pageLimit) < pageLimit)? 2: state.page - pageLimit
					arrPage.value[1] = {
						isShow: true,
						sVal: '...',
						pageID: superPrev,
						activeClass: 'bg-gray-200 text-black'
					}
				} 
			} else {	
				// 	若最末段頁, 設定dynamic pages的頁碼段		
				for(let j=2; j < pageRange; j++) {
					actvClass = (j==state.page-1) ? ' bg-pink-600 text-white': 'bg-gray-200 text-black'
					arrPage.value[j] = {
						isShow: true,
						sVal: j+1,
						pageID: j+1,
						activeClass: actvClass
					}
					iStart++
				}				
			}
			// 設定總頁數位
			actvClass = (state.page == (state.totalPage))?' bg-pink-600 text-white':' bg-gray-200 text-black'
			let lastItem = totItems - 1
			arrPage.value[lastItem] = {
				isShow: true,
				sVal: state.totalPage,
				pageID: state.totalPage,
				activeClass: actvClass
			}
			// 設定總頁數位前一位
			let last2 = totItems - 2
			let lastRange = (useShowmode() > 1 )? 4: 3
			if ((state.totalPage - state.page) > lastRange) {
				// 若最末段頁, 設為totalPage-1, 否則設為目前頁+頁位Range
				let superNext = ((state.page + pageLimit) > state.totalPage - 1)? state.totalPage - 1 :state.page + pageLimit
				if (state.page < (totItems - 1)) {
					// 設定首段的superNext
					superNext = pageRange + iStartLimit + 1
				}
				arrPage.value[last2] = {
					isShow: true,
					sVal: '...',
					pageID: superNext,
					activeClass: 'bg-gray-200 text-black'
				}
			} else {
				// 跳到下個頁段
				actvClass = (state.page == (state.totalPage - 1))?' bg-pink-600 text-white':''
				arrPage.value[last2] = {
					isShow: true,
					sVal: state.totalPage - 1,
					pageID: state.totalPage - 1,
					activeClass: actvClass
				}				
			}			
		}
	}

	const prevPage = () => {
		if (state.page > 1) {
			state.page = state.page - 1
			setPages()
			emits("setActvPage", state.page)
		} else {
			return
		}
	}

	const nextPage = () => {
		if (state.page < state.totalPage) {
			state.page = state.page + 1
			setPages()
			emits("setActvPage", state.page)
		} else {
			return
		}
	}

	const jumpPage = (pageID) => {
		state.page = pageID
		setPages()
		emits("setActvPage", state.page)
	}	

	onMounted(() => {
		if (useShowmode() > 1) {
			let tmpPage = new Array(10).fill({
				isShow: false,
				sVal: 1,
				pageID: 1,
				activeClass: 'bg-gray-200 text-black'
			})
			arrPage.value = tmpPage
		} else {
			let tmpPage1 = new Array(8).fill({
				isShow: false,
				sVal: 1,
				pageID: 1,
				activeClass: 'bg-gray-200 text-black'
			})	
			arrPage.value = tmpPage1
		}
		setPages()
	})
</script>

<template>
	<div class="flex flex-col items-center my-2">
	    <div class="flex text-gray-700">
	        <div 
	        	class="h-8 w-8 mr-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer"
	        	@click="prevPage()"
	        >
	            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left w-4 h-4">
	                <polyline points="15 18 9 12 15 6"></polyline>
	            </svg>
	        </div>
	        <div 
	        	class="flex justify-between h-8 font-medium rounded-full"
	    		v-for="(pageItem) in arrPage"
	    		:key="pageItem.pageID"	        	
	        >	        
	            <div 
	            	v-if="pageItem.isShow"
	            	class="w-8 mr-1 md:mr-2 flex justify-center items-center  cursor-pointer leading-8 transition duration-150 ease-in rounded-full "
	            	:class="pageItem.activeClass"
	            	:data-pageID="pageItem.pageID"
	            	@click="jumpPage(pageItem.pageID)"
	            	>{{ pageItem.sVal }}</div>
	        </div>	    	
	        <div 
	        	class="h-8 w-8 ml-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer"
	        	@click="nextPage()"
	        >
	            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right w-4 h-4">
	                <polyline points="9 18 15 12 9 6"></polyline>
	            </svg>
	        </div>
	    </div>
	</div>	
</template>