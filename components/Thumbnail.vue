<script setup>
import { ref, toRefs, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { Thumbs } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

const props = defineProps({
  currentSlide: {
    type:Number,
    default:0
  },
  liwaData: {
    type:Array,
    default:[]
  },
  liwaClass: {
    type:String,
    required:1,
    default:'w-full'
  },
  liwaDirection: {
    type:String,
    required:1,
    default:'horizontal'
  },
  slideCSS:{
    type:String,
    default:'w-[300px]'
  },
})

const { liwaDirection, liwaClass } = toRefs(props)

const swiperBody = ref(null)
const slidesCount = ref(4)
const slideSpace = ref(20)

// const emit = defineEmits(['thumbs', 'update:currentSlide'])
const emit = defineEmits(['thumbs', 'setSlide'])

const slideClick = (idx) => {
	console.log('Slide index =', idx)
	// emit('update:currentSlide', idx)
  emit('setSlide', idx)
}

const onSwiper = (swiper) => {
  emit('thumbs', swiper)
}

onMounted(() => {
  // console.log('swiper =', swiperBody)
  // 先取得螢幕寬度 => 決定slide 寬度
  const { width, height } = useWindowSize()
  if (liwaDirection.value == 'horizontal') {
    slidesCount.value = Math.floor(Number(width.value) / 300)
  } else {
    slidesCount.value = 4
    slideSpace.value = 5
  }
  
})
</script>

<template>
  <Swiper ref="swiperBody" @swiper="onSwiper" :slides-per-view="slidesCount" :space-between="20" :modules="[Thumbs]" watch-slides-progress :direction="liwaDirection" :class="liwaClass">
    <SwiperSlide v-for="(pic, index) in liwaData" class="mx-4" :key="index" @click.stop="slideClick(index)">
      <div class="flex justify-center" :class="slideCSS">
        <img :src="pic.img" class="w-auto h-auto" />
      </div>
      
    </SwiperSlide>
  </Swiper>
</template>