<script setup lang="ts">
    /*********************************************************
    prog name: liwaCombo元件, author: James Lin, date: 2022/08/07
    Todo: 
    附註: arrOption必須包括2個欄位 - id & val
    **********************************************************/	
	import { ref, onMounted } from "vue"

	const isShow = ref(false)
	const arrOption = ref([])
	const keyID = ref('')
	const props = defineProps({
		context: {
			type: Object as PropType<FormKitFrameworkContext & { sVal: string,  arrOption: []}>,
			required: true
		}
	})

	const showValue = ref('')
	const comboData = ref([])

	const inputVal = ref<HTMLInputElement | null>(null)
	const context = toRef(props, 'context')

	const handleInput = (e) => {
		props.context.node.input(e.target.value)
	}

	const filterData = () => {
		isShow.value = true
		let iLen = showValue.value.length
		if (iLen > 0) {
			comboData.value = arrOption.value.filter(liwaItem => 
				liwaItem.label.substr(0, iLen) == showValue.value
			)
		} else {
			comboData.value = arrOption.value
		}
	}	

	const clearInput = () => {
		showValue.value = ''
		filterData()
	}	

	const toggleMenu = () => {
		isShow.value = !isShow.value
		if (isShow.value == true) {
			filterData()
		}
	}

	const getItems = (sValue, sID) => {
		showValue.value = sValue
		props.context.node.input(sID)
		keyID.value = sID
		isShow.value = false
	}

	onMounted(() => {
		showValue.value = props.context.sVal
		arrOption.value = props.context.arrOption
		comboData.value = arrOption.value
	})


</script>

<template>
	<input 
		ref="inputVal"
		class="w-full h-8 outline-2 text-md pl-3"
		v-model="showValue"
		:data-ID="keyID"
		@click="toggleMenu"
		@keyup="filterData"
		@keydown.esc="clearInput"
	/>
	<div v-if="isShow==true" 
		class="max-w-[16rem] w-full h-48 bg-slate-50 absolute top-15 left-1 text-md outline outline-1 overflow-x-hidden overflow-y-auto"
	>
		<ul class="bg-slate-50">
			<li v-for="item in comboData" 
				class="w-full h-8 border-b-2 ml-1 border-b-slate-200 bg-slate-100 cursor-pointer" 
				@click="getItems(item.label, item.value)"
			>{{ item.label }}
			</li>
		</ul>			
	</div>	
</template>

<style scope>
	li:hover {
		color:white;
		background-color:#333;
	}
</style>