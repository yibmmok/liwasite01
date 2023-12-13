<script setup>
    import { ref, onMounted } from 'vue'
    import { useFetch, createFetch } from "@vueuse/core"

    const sYear = ref('')
    const imgLogo = ref('')

    const getLogo = () => {
        let sJWT = window.localStorage.getItem('liwaJWT')
        if ((sJWT == 'undefined') || (sJWT == "") || (sJWT == null)) {
            imgLogo.value = '../static/Logo_web.png'
        } else {
            loadLogo()
        }
    }

    const loadLogo = async () => {
        let sAPIsvr = window.sessionStorage.getItem('liwaAPIsvr')
        let url = `${sAPIsvr}/sys_haveSiteInfo.php`
        const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
        // imgLogo.value = data.data.value.message  
        imgLogo.value = '../static/Logo_web.png'    
    }

    const getYear = () => {
        sYear.value = new Date().getFullYear();
    }

    onMounted(() => {
        getYear()
        getLogo()
    })
    
</script>

<template>
	<footer class="w-full lg:w-full bg-white">
        <hr class="w-full lg:w-[calc(100%_-_2rem)] h-[0.1rem] opacity-70 mx-auto my-4 border-0 bg-orange-500">
        <div class="w-full lg:w-[80%] mx-auto my-0">
            <div class="flex flex-col lg:flex-row">
                <div class="w-full lg:w-[300px]">
                    <div class="w-full flex flex-row">
                        <div class="w-full mb-4">
                            <img src="../static/Logo_web.jpg" class="flex md:justify-self-start mx-4 my-2"  />
                            <div class="tate01 w-full text-2xl text-orange-600 pt-0 py-6 text-center">安心交易</div>
                            <div class="flex flex-row ">
                                <div class="w-1/2 text-center text-orange-500">科學檢驗</div>
                                <div class="w-1/2 text-center  text-orange-500">雙重保障</div>
                            </div>
                            <div class="flex flex-row">
                                <div class="w-1/2 text-center  text-orange-500">中立客觀</div>
                                <div class="w-1/2 text-center text-orange-500">易於成交</div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="w-full lg:w-[550px] pt-1 pl-4">
                    <div class="w-full my-6 pl-4 flex flex-row">
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 473.806 473.806" style="enable-background:new 0 0 473.806 473.806;" xml:space="preserve">
                            <g style="fill:#ea580c;">
                                <path d="M374.456,293.506c-9.7-10.1-21.4-15.5-33.8-15.5c-12.3,0-24.1,5.3-34.2,15.4l-31.6,31.5c-2.6-1.4-5.2-2.7-7.7-4
                                    c-3.6-1.8-7-3.5-9.9-5.3c-29.6-18.8-56.5-43.3-82.3-75c-12.5-15.8-20.9-29.1-27-42.6c8.2-7.5,15.8-15.3,23.2-22.8
                                    c2.8-2.8,5.6-5.7,8.4-8.5c21-21,21-48.2,0-69.2l-27.3-27.3c-3.1-3.1-6.3-6.3-9.3-9.5c-6-6.2-12.3-12.6-18.8-18.6
                                    c-9.7-9.6-21.3-14.7-33.5-14.7s-24,5.1-34,14.7c-0.1,0.1-0.1,0.1-0.2,0.2l-34,34.3c-12.8,12.8-20.1,28.4-21.7,46.5
                                    c-2.4,29.2,6.2,56.4,12.8,74.2c16.2,43.7,40.4,84.2,76.5,127.6c43.8,52.3,96.5,93.6,156.7,122.7c23,10.9,53.7,23.8,88,26
                                    c2.1,0.1,4.3,0.2,6.3,0.2c23.1,0,42.5-8.3,57.7-24.8c0.1-0.2,0.3-0.3,0.4-0.5c5.2-6.3,11.2-12,17.5-18.1c4.3-4.1,8.7-8.4,13-12.9
                                    c9.9-10.3,15.1-22.3,15.1-34.6c0-12.4-5.3-24.3-15.4-34.3L374.456,293.506z M410.256,398.806
                                    C410.156,398.806,410.156,398.906,410.256,398.806c-3.9,4.2-7.9,8-12.2,12.2c-6.5,6.2-13.1,12.7-19.3,20
                                    c-10.1,10.8-22,15.9-37.6,15.9c-1.5,0-3.1,0-4.6-0.1c-29.7-1.9-57.3-13.5-78-23.4c-56.6-27.4-106.3-66.3-147.6-115.6
                                    c-34.1-41.1-56.9-79.1-72-119.9c-9.3-24.9-12.7-44.3-11.2-62.6c1-11.7,5.5-21.4,13.8-29.7l34.1-34.1c4.9-4.6,10.1-7.1,15.2-7.1
                                    c6.3,0,11.4,3.8,14.6,7c0.1,0.1,0.2,0.2,0.3,0.3c6.1,5.7,11.9,11.6,18,17.9c3.1,3.2,6.3,6.4,9.5,9.7l27.3,27.3
                                    c10.6,10.6,10.6,20.4,0,31c-2.9,2.9-5.7,5.8-8.6,8.6c-8.4,8.6-16.4,16.6-25.1,24.4c-0.2,0.2-0.4,0.3-0.5,0.5
                                    c-8.6,8.6-7,17-5.2,22.7c0.1,0.3,0.2,0.6,0.3,0.9c7.1,17.2,17.1,33.4,32.3,52.7l0.1,0.1c27.6,34,56.7,60.5,88.8,80.8
                                    c4.1,2.6,8.3,4.7,12.3,6.7c3.6,1.8,7,3.5,9.9,5.3c0.4,0.2,0.8,0.5,1.2,0.7c3.4,1.7,6.6,2.5,9.9,2.5c8.3,0,13.5-5.2,15.2-6.9
                                    l34.2-34.2c3.4-3.4,8.8-7.5,15.1-7.5c6.2,0,11.3,3.9,14.4,7.3c0.1,0.1,0.1,0.1,0.2,0.2l55.1,55.1
                                    C420.456,377.706,420.456,388.206,410.256,398.806z"/>
                                <path d="M256.056,112.706c26.2,4.4,50,16.8,69,35.8s31.3,42.8,35.8,69c1.1,6.6,6.8,11.2,13.3,11.2c0.8,0,1.5-0.1,2.3-0.2
                                    c7.4-1.2,12.3-8.2,11.1-15.6c-5.4-31.7-20.4-60.6-43.3-83.5s-51.8-37.9-83.5-43.3c-7.4-1.2-14.3,3.7-15.6,11
                                    S248.656,111.506,256.056,112.706z"/>
                                <path d="M473.256,209.006c-8.9-52.2-33.5-99.7-71.3-137.5s-85.3-62.4-137.5-71.3c-7.3-1.3-14.2,3.7-15.5,11
                                    c-1.2,7.4,3.7,14.3,11.1,15.6c46.6,7.9,89.1,30,122.9,63.7c33.8,33.8,55.8,76.3,63.7,122.9c1.1,6.6,6.8,11.2,13.3,11.2
                                    c0.8,0,1.5-0.1,2.3-0.2C469.556,223.306,474.556,216.306,473.256,209.006z"/>
                            </g>
                        </svg>                    
                        <span class="ml-2">(02)27525292</span>
                    </div>
                    <div class="w-full my-5 pl-4 flex flex-row">
                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 295.24 295.24" style="enable-background:new 0 0 295.24 295.24;" xml:space="preserve">
                           <g style="fill:#ea580c;">
                               <path d="M280.952,57.144h-14.286V0.001H104.762v57.143H90.476c-7.876,0-14.286,6.41-14.286,14.286v14.286h-9.524V71.43 c0-7.876-6.41-14.286-14.286-14.286H14.286C6.41,57.144,0,63.553,0,71.43v166.667c0,7.876,6.41,14.286,14.286,14.286h38.095 c7.876,0,14.286-6.41,14.286-14.286v-9.524h9.524v9.524c0,7.876,6.41,14.286,14.286,14.286h14.286v42.857h161.905v-42.857h14.286 c7.876,0,14.286-6.41,14.286-14.286V71.43C295.238,63.553,288.829,57.144,280.952,57.144z M57.143,238.095 c0,2.629-2.133,4.762-4.762,4.762H14.286c-2.629,0-4.762-2.133-4.762-4.762V71.43c0-2.629,2.133-4.762,4.762-4.762h38.095 c2.629,0,4.762,2.133,4.762,4.762V238.095z M76.191,219.048h-9.524V95.238h9.524V219.048z M114.286,9.524h142.857v47.619H114.286 V9.524z M104.762,214.287v9.524H100v-14.286h171.429v14.286h-4.762v-9.524H104.762z M257.143,285.714H114.286v-61.904h142.857 V285.714z M285.715,238.095h-0.001c0,2.629-2.133,4.762-4.762,4.762h-14.286v-9.524h14.286v-33.333H90.476v33.333h14.286v9.524 H90.476c-2.629,0-4.762-2.133-4.762-4.762V71.43c0-2.629,2.133-4.762,4.762-4.762h14.286h161.905h14.286 c2.629,0,4.762,2.133,4.762,4.762V238.095z"/>
                               <rect x="100" y="123.811" width="9.524" height="9.524"/>
                               <rect x="119.048" y="123.811" width="9.524" height="9.524"/>
                               <rect x="138.095" y="123.811" width="9.524" height="9.524"/>
                               <rect x="157.143" y="123.811" width="9.524" height="9.524"/>
                               <rect x="100" y="142.857" width="9.524" height="9.524"/>
                               <rect x="119.048" y="142.857" width="9.524" height="9.524"/>
                               <rect x="138.095" y="142.857" width="9.524" height="9.524"/>
                               <rect x="157.143" y="142.857" width="9.524" height="9.524"/>
                               <rect x="100" y="161.905" width="9.524" height="9.524"/>
                               <rect x="119.048" y="161.905" width="9.524" height="9.524"/>
                               <rect x="138.095" y="161.905" width="9.524" height="9.524"/>
                               <rect x="157.143" y="161.905" width="9.524" height="9.524"/>
                               <path d="M185.714,171.43h85.714v-47.619h-85.714V171.43z M195.238,133.334h66.667v28.571h-66.667V133.334z"/>
                               <rect x="123.81" y="19.048" width="123.81" height="9.524"/>
                               <rect x="123.81" y="38.095" width="123.81" height="9.524"/>
                               <rect x="123.81" y="266.667" width="123.81" height="9.524"/>
                               <rect x="123.81" y="247.62" width="123.81" height="9.524"/>
                           </g>
                        </svg>
                        <span class="ml-2">(02)25040880</span>
                    </div>
                    <div class="w-full my-5 pl-4 pt-1 flex flex-row">
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 255.856 255.856" style="enable-background:new 0 0 255.856 255.856; margin-top:-4px;" xml:space="preserve">
                            <g>
                                <path style="fill:#ea580c;" d="M127.928,38.8c-30.75,0-55.768,25.017-55.768,55.767s25.018,55.767,55.768,55.767 s55.768-25.017,55.768-55.767S158.678,38.8,127.928,38.8z M127.928,135.333c-22.479,0-40.768-18.288-40.768-40.767 S105.449,53.8,127.928,53.8s40.768,18.288,40.768,40.767S150.408,135.333,127.928,135.333z"/>
                                <path style="fill:#ea580c;" d="M127.928,0C75.784,0,33.362,42.422,33.362,94.566c0,30.072,25.22,74.875,40.253,98.904 c9.891,15.809,20.52,30.855,29.928,42.365c15.101,18.474,20.506,20.02,24.386,20.02c3.938,0,9.041-1.547,24.095-20.031 c9.429-11.579,20.063-26.616,29.944-42.342c15.136-24.088,40.527-68.971,40.527-98.917C222.495,42.422,180.073,0,127.928,0z M171.569,181.803c-19.396,31.483-37.203,52.757-43.73,58.188c-6.561-5.264-24.079-26.032-43.746-58.089 c-22.707-37.015-35.73-68.848-35.73-87.336C48.362,50.693,84.055,15,127.928,15c43.873,0,79.566,35.693,79.566,79.566 C207.495,112.948,194.4,144.744,171.569,181.803z"/>
                            </g>
                        </svg>
                        <span class="ml-2 pr-16">台北市大安區信義路三段162-6號1樓</span>
                    </div>                    
                </div>
                <div class="w-full lg:w-[calc(100%_-_600px)]">
                    <div class="w-full grid grid-cols-2 gap-0.5 py-6 px-4 md:grid-cols-4 flex justify-end">
                        <div class="w-full lg:w-96 lg:border-l-2 lg:border-orange-200 lg:pl-4">
                            <ul class="text-slate-400">
                                <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/Products?imode=31" class="hover:underline">全館</a>
                                </li>
                                <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/Products?imode=32" class="hover:underline">鑽石館</a>
                                </li>
                                <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/Products?imode=33" class="hover:underline">彩寶館</a>
                                </li> 
                                <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/Products?imode=34" class="hover:underline">翡翠館</a>
                                </li>
                                <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/Products?imode=35" class="hover:underline">軟玉館</a>
                                </li>       
                            </ul>
                        </div>                        
                        <div class="w-full lg:w-96 lg:border-l-2 lg:border-orange-200 lg:pl-4">
                            <ul class="text-slate-400">
                                <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/About" class="hover:underline">關於我們</a>
                                </li>
                                <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/News" class="hover:underline">通知中心</a>
                                </li>
                                <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/Blogs" class="hover:underline">部落格</a>
                                </li>           
                            </ul>
                        </div>
                        <div class="w-full lg:w-96 lg:border-l-2 lg:border-orange-200 lg:pl-4">
                            <ul class="text-slate-400">
                                <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/QnA" class="hover:underline">常見Q&A</a>
                                </li>
                                <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/Services" class="hover:underline">客服中心</a>
                                </li>
                                <!-- <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/Statics" class="hover:underline">行情統計</a>
                                </li> -->                
                            </ul>                        
                        </div>
                        <div class="w-full lg:w-96 lg:border-l-2 lg:border-orange-200 lg:pl-4">
                            <ul class="text-slate-400">
                                <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/Terms" class="hover:underline">會員合約</a>
                                </li>
                                <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/Privacy" class="hover:underline">隱私權聲明</a>
                                </li>
                                <li class="mb-4 text-lg font-semibold text-black">
                                    <a href="/Contact" class="hover:underline">聯絡我們</a>
                                </li>                            
                            </ul>
                        </div>
                    </div>
                </div>
            </div>            
        </div>

        <div class="py-6 px-4 bg-gray-700 md:flex md:items-center md:justify-between">
            <span class="text-sm text-gray-300 sm:text-center">© {{ sYear }} <a href="https://www.jewelrytrade.center">JT.C™</a>. All Rights Reserved.
            </span>
            <div class="flex mt-4 space-x-6 sm:justify-center md:mt-0">
                <a href="#" class="text-gray-400 hover:text-white">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path></svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-white">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path></svg>
                </a>
            </div>
        </div>
    </footer>
</template>

<style scope>
    .tate01 {
        font-family: "RunningScript";
    }    
</style>