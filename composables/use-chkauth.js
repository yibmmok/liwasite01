import { useFetch, createFetch } from "@vueuse/core"
import queryString from "query-string"

export async function useChkauth(progID) {
	return new Promise((resolve, reject) => {
		let APIsvr = window.sessionStorage.getItem('liwaAPIsvr')
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT'),
			'progID':progID
		}
		let sQuery = queryString.stringify(keydata)	
		let url = `${APIsvr}/sys_chkAuth.php?${sQuery}`
	
		useFetch(url, {method: 'GET'}, {refetch: true}).get().then((res) => { 
			// let datastr = res.data.value
			let objTmp = JSON.parse(res.data.value)
			console.log('objTmp =', objTmp.status)
			if (objTmp.status === 'success') {
				resolve(res.data)
			} else {
				reject('回傳失誤')
			}
		})
	})
}