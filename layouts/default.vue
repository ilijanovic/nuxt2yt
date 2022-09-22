<template>
  <div>
    <transition name="slide">
      <Slider v-if="notification.show">{{notification.text}}</Slider>
    </transition>
    <div class="p-5 border-b flex justify-between items-center shadow">
      <div>
        <nuxt-link to="/" tag="h1" class="bold cursor-pointer text-3xl">Easy video downloader</nuxt-link>
        <small class="text-gray-600">We make downloading videos from YouTube easy and fast.</small>

      </div>
      <nuxt-link class="border bg-purple-500 self-end rounded px-6 py-2 text-white flex" to="/cutter">Cutter</nuxt-link>
    </div>
    <div>

    </div>
    <div class="max-w-3xl p-2 py-5 mx-auto">
      <nuxt></nuxt>
    </div>
  </div>
</template>
<script lang="ts">
import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import sliderVue from '~/components/popup/slider.vue'
import Slider from '~/components/popup/slider.vue'
import "@/assets/transition/slide.css"
export default Vue.extend({
  data() {
    return {
      structuredData: {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Easy video downloader",
        "applicationCategory": "WebApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    }
  },
  components: {
    sliderVue,
    Slider
  },
  computed: {
    ...mapGetters(["notification"])
  },
  head() {

    return {

      script: [{ type: 'application/ld+json', json: this.structuredData }]
    }
  },
})
</script>

<style>
body {
  @apply outline-none
}

.page-enter,
.page-leave-to

/* .slide-leave-active below version 2.1.8 */
  {
  opacity: 0;
}

.page-leave-active,
.page-enter-active {
  transition: all 200ms;
}
</style>
