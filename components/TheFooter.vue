<script setup>
	import { ref } from 'vue'

	const sYear = ref('')

	const getYear = () => {
		sYear.value = new Date().getFullYear();
	}

	getYear()
</script>

<template>
<div class="max-w-full bg-white w-full h-12 border-t border-t-gray-200 dark:bg-black dark:border-t-white">
	<footer class="pt-2 mx-auto w-full lg:w-[1024px] sm:pt-4">
		<div class="sm:flex sm:items-center sm:justify-between ">
			<span class="w-full text-sm text-gray-800 sm:text-center dark:text-gray-200 dark:text-white">Copyright © {{ sYear }} <a href="https://www.liwasite.com" target="_blank" class="hover:underline">Liwasite™</a>. All Rights Reserved.
			</span>
		</div>
	</footer>
</div>    
</template>


