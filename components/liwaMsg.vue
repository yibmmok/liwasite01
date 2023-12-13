<script setup>
	import { ref, reactive, toRefs } from "vue"
	import useMsgParam from "../composables/use-msg-param"

	const props = defineProps({
		msgTitle: {
			type: String,
			required: true,
			default:""
		},
		msgBody: {
			type: String,
			default: ""
		},
		modalType: {
			type: Number,
			required: true,
			default: 1,
		}
	})

	const state = reactive({
		msgTitle: props.msgTitle,
		msgBody: props.msgBody,
		modalType: props.modalType
	})

	const emits = defineEmits(["hideMsg", "confirmOK"])

	const sendOK = () => {
		emits("confirmOK")
	}

	const closeMsg = () => {
		emits("hideMsg")
	}
</script>

<template>
<div class="w-full h-full min-h-screen bg-gradient-to-b from-gray-100 to-gray-400 opacity-90 flex justify-center items-start">
  <div class="mt-12 bg-white rounded-lg">
  	<div class="relative w-96 border-t-8 border-pink-600 rounded-lg flex">
      <div v-if="state.modalType==2" class="absolute w-8 h-8 bg-white cursor-pointer top-2 right-2">
        <svg
          class="w-6 h-6 float-left"
          fill="red"
          stroke="red"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          @click.prevent="closeMsg()"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>              
      </div>    
      <div v-if="state.modalType==1" class="w-1/3 pt-6 flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 bg-pink-600 text-white p-3 rounded-full" fill="none" viewBox="0 0 24 24" height="24" width="24">
          <path xmlns="http://www.w3.org/2000/svg" d="M12 4.52765C9.64418 2.41689 6.02125 2.49347 3.75736 4.75736C1.41421 7.1005 1.41421 10.8995 3.75736 13.2426L10.5858 20.0711C11.3668 20.8521 12.6332 20.8521 13.4142 20.0711L20.2426 13.2426C22.5858 10.8995 22.5858 7.1005 20.2426 4.75736C17.9787 2.49347 14.3558 2.41689 12 4.52765ZM10.8284 6.17157L11.2929 6.63604C11.6834 7.02656 12.3166 7.02656 12.7071 6.63604L13.1716 6.17157C14.7337 4.60948 17.2663 4.60948 18.8284 6.17157C20.3905 7.73367 20.3905 10.2663 18.8284 11.8284L12 18.6569L5.17157 11.8284C3.60948 10.2663 3.60948 7.73367 5.17157 6.17157C6.73367 4.60948 9.26633 4.60948 10.8284 6.17157Z" fill="currentcolor"></path>
        </svg>
      </div>
      <div class="w-full py-6 px-4">
        <h3 class="font-bold text-pink-700 text-center">{{ state.msgTitle }}</h3>
        <p class="py-4 text-sm text-gray-400 text-left">{{ state.msgBody }}</p>
      </div>
    </div>
    <div v-if="state.modalType==1" class="p-4 flex space-x-4">
      <a href="#" class="w-1/2 px-4 py-3 text-center bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-black font-bold rounded-lg text-sm" @click="closeMsg">取消</a>
      <a href="#" class="w-1/2 px-4 py-3 text-center text-pink-100 bg-pink-600 rounded-lg hover:bg-pink-700 hover:text-white font-bold text-sm"
      @click="sendOK"
      >確定</a>
    </div>
  </div>    
</div>
</template>