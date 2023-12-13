/*********************************************************
prog name: 數字加上千分位分隔, author: James Lin, date: 2023/02/23
Todo: 1. 傳入參數->progress
**********************************************************/	

export default function useThousandSep(str) {
	let result = ''
	if (str) {
		let pattern = /(\d)(?=(\d{3})+(?!\d))/g
		let repl = "\$1,"
		result = str.replace(pattern, repl)
	} else result = str

	return result
}