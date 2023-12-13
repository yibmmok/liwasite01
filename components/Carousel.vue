<script setup>
import { ref, watch, toRefs } from 'vue'
import { Navigation, Pagination, A11y, Lazy, Thumbs } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

const props = defineProps({
  currentSlide: Number,
  liwaData: Array,
  imgWidth: String,
  slideSpace: Number,
  thumbs: Object
})

const swiperRef = ref(null)

const { currentSlide } = toRefs(props)

watch(currentSlide, () => {
  if(swiperRef.value !== null) {
    swiperRef.value.slideTo(props.currentSlide)
  }
})

const onSwiper = (swiper) => {
  swiperRef.value = swiper
}
</script>

<template>
  <swiper @swiper="onSwiper" :slides-per-view="1" :space-between="props.slideSpace" :modules="[Navigation, Pagination, A11y, Lazy, Thumbs]" navigation :pagination="{ clickable: true, dynamicBullets: true }" grab-cursor :preload-images="false" lazy :thumbs="{ swiper: thumbs }">
    <swiper-slide v-for="(pic, index) in liwaData" :key="index" class="customSlide">
      <img :data-src="pic.img" class="swiper-lazy max-w-full" :class="props.imgWidth" />
      <div class="swiper-lazy-preloader"></div>
    </swiper-slide>
  </swiper>
</template>

<style scoped>
.customSlide {
  display: grid;
  place-items: center;
  min-height:380px;
/*  height: 100vh;
  margin-top:-12rem;*/
}

.customSlide img {
  margin-top:-1rem;
}
</style>