<script setup lang="ts">
	const props = defineProps({
		context: Object,
	})

	const digits = Number(props.context.digits)
	const tmp = ref(props.context.value || '')

	const handleInput = (index, e) => {
		const prev = tmp.value

		if (tmp.value.length <= index) {
			// if new digit
			tmp.value = '' + tmp.value + e.target.value
		} else {
			// if this digit is in the middle somewhere, cut the string into two pieces at the index, and insert our new digit in
			tmp.value = '' + tmp.value.substr(0, index) + e.target.value + tmp.value.substr(index + 1)
		}

		// Get all the digit inputs
		const inputs = e.target.parentElement.querySelectorAll('input')
		if (index < digits - 1 && tmp.value.length >= prev.length) {
			// If this is a new input and not at the end, focus the next input
			inputs.item(index + 1).focus()
		} else if (index > 0 && tmp.value.length < prev.length) {
			// in the case we deleted a value, focus backwards
			inputs.item(index - 1).focus()
		}

		if (tmp.value.length == digits) {
			// if our input is complete, commit the value
			props.context.node.input(tmp.value)
		} else if (tmp.value.length < digits && props.context.value !== '') {
			// If our input is incomplete, it should have no value
			props.context.node.input('')
		}		
	}

	function handleFocus (e) {
		e.target.select()
	}

	function handlePaste(e) {
		const paste = e.clipboardData.getData('text')
		console.log('paste =', paste)
		if (typeof paste === 'string') {
			// If it is the right length, paste it
			tmp.value = paste.substr(0, digits)
			const inputs = e.target.parentElement.querySelectorAll('input')
			// Focus on the last character
			inputs.item(tmp.value.length - 1).focus()
		}
	}
</script>

<template>
	<div class="w-full">
		
	</div>
	<input 
		v-for="index in digits"
		maxlength="1"
		class="w-8 h-10 border-2 border-black mr-1 text-center"
		:class="context.classes.digit"
		:value="tmp[index - 1] || ''"
		@input="handleInput(index - 1, $event)" 
		@focus="handleFocus"
		@paste="handlePaste"
	/>

</template>