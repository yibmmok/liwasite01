<script setup lang="ts">
	import { ref, onMounted } from "vue"
	import { useElementBounding, useWindowSize } from "@vueuse/core"
	import { IconCaretDownFill } from '@iconify-prerendered/vue-bi'

	const isShow = ref(false)
	const arrOption = ref([])
	const keyID = ref('')
	const HeightLimit = ref(200)
	const listPos = ref('top-14')
	const props = defineProps({
	  context: {
	    type: Object as PropType<FormKitFrameworkContext & { sVal: string,  arrOption: []}>,
	    required: true
	  }
	})

	const showValue = ref('')

	const inputVal = ref<HTMLInputElement | null>(null)
	const context = toRef(props, 'context')

	const handleInput = (e) => {
		props.context.node.input(e.target.value)
	}

	const toggleMenu = () => {
	const { x, y, top, bottom, width, height } = useElementBounding(inputVal.value)	
		if (bottom.value > HeightLimit.value) {
			listPos.value = "-top-[16.5rem]"
		} else {
			listPos.value = "top-[4.3rem]"
		}
		isShow.value = !isShow.value
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
		const { height } = useWindowSize()
		HeightLimit.value = height.value * 3/4
	})
</script>

<template>
	<input 
		ref="inputVal"
		class="w-[87%] h-10 outline-0 text-md pl-3"
		:value="showValue"
		:data-ID="keyID"
		readonly="readonly"
		@click="toggleMenu"
	/>
	<div v-if="isShow==true" 
		class="w-full h-72 absolute left-2 bg-white text-md outline-1 z-[100]"
		:class="listPos"
	>
		<ul class="w-[95%] h-72 overflow-x-hidden overflow-y-auto border-2 border-slate-300">
			<li v-for="(item, index) in arrOption" 
				class="w-full min-h-[2rem] h-auto pl-2 pt-2 border-b-2 border-b-slate-300 bg-slate-50 cursor-pointer lg:hover:bg-slate-500"
				@click="getItems(item.label, item.value)"
			>{{ item.label }}
			</li>
		</ul>			
	</div>
	<div class="w-[20px] h-[20px] absolute top-8 right-3"
		@click="toggleMenu"
	>
		<IconCaretDownFill class="w-7 h-7 text-slate-600 font-bold"/>
	</div>


</template>