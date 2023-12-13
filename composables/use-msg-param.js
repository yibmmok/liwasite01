import { ref } from "vue"
// import {toRefs, reactive} from "vue"

// 用來暫存 liwaMsg 對話盒的按鈕值
export default function useMsgParam() {
	// const state = reactive({
	// 	isConfirm: false
	// })

	const isConfirm = ref(false)

	const setConfirm = () => {
		isConfirm.value = true
		console.log("isConfirm = ", isConfirm.value)
	}

	const initConfirm = () => {
		isConfirm.value = false
		console.log("isConfirm = ", isConfirm.value)
	}

	// return {...toRefs(state), setConfirm}
	return { setConfirm, initConfirm }
}
