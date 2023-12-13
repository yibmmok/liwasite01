<script setup lang="ts">
	/*********************************************************
	prog name: liwaTabs元件, author: James Lin, date: 2023/07/10
	功用: 用來顯示及切換 active 的 Tab
	父代設定: arrTabs: array, 設定各 Tab的名稱
	Emit 函數: setActvTab => 變更 active Tab
	**********************************************************/

	import { ref, reactive, onMounted } from "vue"

	const props = defineProps({
	  arrTabs: {
	  	type: Array,
	  	default: []
	  }
	})

	const emits = defineEmits(["setActvTab"])

	const state = reactive({
	  arrTabs: props.arrTabs
	})

	const step = ref('')
	const stepNames = ref([])

	const setStepNames = () => {
		if (stepNames.value.length > 0) stepNames.value = []
		let iLength = state.arrTabs.length
		for (let i = 0; i < iLength; i++) {
			let sCSS = (i == 0)? "bg-red-700 text-white": "bg-gray-200 text-black"
			let objItem = {
				"Name":state.arrTabs[i],
				"Class": sCSS
			}
			stepNames.value.push(objItem)
		}
		step.value = state.arrTabs[0]
	}

	const getActvSubStep = (idx) => {
		stepNames.value.forEach((m) => m.Class="bg-gray-200 text-black")
		step.value = stepNames.value[idx].Name
		stepNames.value[idx].Class = 'bg-red-700 text-white'
		emits('setActvTab', idx)
	}

	onMounted(() => {
		setStepNames()
	})	

</script>

<template>
	<div class="w-full bg-gray-100">
		<div v-if="stepNames.length > 0" class="w-full my-2 p-2 flex flex-row flex-wrap justify-start rounded-lg bg-white">
			<div v-for="(objTab, index) in stepNames" 
				class="min-w-24 h-12 px-4 py-3 text-center border-r-2 border-white cursor-pointer" :class="objTab.Class"
				@click="getActvSubStep(index)"
			>
				{{ objTab.Name }}
			</div>
		</div>
	</div>
</template>