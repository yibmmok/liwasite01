import { useTimeAgo } from "@vueuse/core"

export default function useTimeAgoTW(sTime) {
	let dTime = new Date(sTime)
	const strTmp = useTimeAgo(dTime)
	let sResult = strTmp.value
	let AA = ''
	let bModi = false	
	if (sResult == 'just now') {
		AA = '剛剛'
		bModi = true
	}
	if (sResult.includes('yesterday')) {
		AA = sResult.replace('yesterday', '昨天', sResult)
		bModi = true
	} 						
	if (sResult.includes('seconds'))  {
		sResult = sResult.replace('seconds', '秒', sResult)
		bModi = true
	} else if (sResult.includes('second')) {
		sResult = sResult.replace('second', '秒', sResult)	
		bModi = true
	}
	if (sResult.includes('minutes')) {
		sResult = sResult.replace('minutes', '分', sResult)		
		bModi = true
	} else if (sResult.includes('minute')) {
		sResult = sResult.replace('minute', '分', sResult)	
		bModi = true
	}
	if (sResult.includes('hours')) {
		sResult = sResult.replace('hours', '小時', sResult)		
		bModi = true
	} else if (sResult.includes('hour'))  {
		sResult = sResult.replace('hour', '小時', sResult)
		bModi = true
	}
	if (sResult.includes('days'))  {
		sResult = sResult.replace('days', '天', sResult)		
		bModi = true
	} else if (sResult.includes('day'))  {
		sResult = sResult.replace('day', '天', sResult)
		bModi = true
	}
	if (!bModi) AA = sTime 
	else {
		if (sResult.includes('ago'))  AA = sResult.replace('ago', '前', sResult)	
		AA = AA.replace(/\s+/g, '')	
	}
	
	return AA
}