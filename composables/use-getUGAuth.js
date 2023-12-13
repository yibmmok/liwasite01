	/*********************************************************
	prog name: 檢查使用者群組的權限, author: James Lin, date: 2023/08/07
	**********************************************************/	

import { useFetch, createFetch } from "@vueuse/core"
import queryString from "query-string"

export async function usegetUGAuth(progID) {
	return new Promise((resolve, reject) => {
		let APIsvr = window.sessionStorage.getItem('liwaAPIsvr')
		let uGroupID = window.sessionStorage.getItem('liwaUserGroupID')
		let keydata = {
			'JWT': window.localStorage.getItem('liwaJWT'),
			'uGroupID': uGroupID,
			'progID': progID
		}
		let sQuery = queryString.stringify(keydata)	
		// console.log('sQuery in usegetUGAuth =', sQuery)
		let url = `${APIsvr}/sys_haveGAuth.php?${sQuery}`
	
		useFetch(url, {method: 'GET'}, {refetch: true}).get().then((res) => { 
			// let datastr = res.data.value
			let objTmp = JSON.parse(res.data.value)
			if (objTmp.status === 'success') {
				resolve(res.data)
			} else {
				reject('回傳失誤')
			}
		})
	})
}