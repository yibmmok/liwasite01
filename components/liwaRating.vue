<script setup lang="ts">
	import { ref, reactive, onMounted } from "vue"
	import { IconStar, IconStarFill, IconStarHalf } from '@iconify-prerendered/vue-bi'

	const props = defineProps({
	  starClass: {
	  	type: String,
	  	default: ''
	  },
	  points: {
	  	type: String,
	  	default: '0'
	  }
	})

	const state = reactive({
	  starClass: props.starClass,
	  points: props.points
	})

	const starArray = ref([])

	const setStarArray = (iPoint) => {
		// console.log('iPoint =', iPoint)
		let arrTmp = iPoint.toString().split('.')
		let integerPart = arrTmp[0]
		let decimalPart = (arrTmp[1]) ? '1' : '0'
		let integerArray = new Array(parseInt(integerPart)).fill(2)
		let decimalArray = new Array()
		decimalArray.push(parseInt(decimalPart))

		starArray.value = [...integerArray, ...decimalArray]
		let iLength = starArray.value.length
		if (iLength < 6) {
			for (let i = 0; i < (5-iLength); i++) {
				starArray.value.push(0)
			}
		} else {
			starArray.value = [2,2,2,2,2]
		}	
	}

	onMounted(() => {
		starArray.value = []
		setStarArray(state.points)
	})	

</script>

<template>
<div v-if="starArray.length > 0">
	<div v-if="state.points >= '2.5'" class="w-full p-1 flex flex-row justify-between">
		<div v-for="(obj, index) in starArray" :class="state.starClass">
			<div v-if="Number(obj)==2">
				<IconStarFill class="font-bold" :class="state.starClass" />
			</div>
			<div v-if="Number(obj)==1">
				<IconStarHalf class="font-bold" :class="state.starClass" />
			</div>
			<div v-if="Number(obj)==0">
				<IconStar class="font-bold" :class="state.starClass" />
			</div>
		</div>		
	</div>
</div>
</template>