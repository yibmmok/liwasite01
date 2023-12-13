import { useWindowSize } from "@vueuse/core"

// export function useShowmode() {
export default function () {
		let iMode = 0
		const { width, height } = useWindowSize()
		if ( width.value < 641 ) {
			iMode = 1
		} else {
			if ( width.value < 1025 ) 
				iMode = 2
			else 
				iMode = 3
		}
		return iMode
}