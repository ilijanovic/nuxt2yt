<template>
  <div>
    <div class="p-5 border-b shadow">
      <h1 class="bold text-3xl">Free youtube converter</h1>
      <small class="text-gray-500">We make downloading videos from YouTube easy and fast.</small>
    </div>
    <div class="max-w-3xl py-5 mx-auto">
      <nuxt></nuxt>
    </div>
  </div>
</template>
<script lang="ts">
import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      structuredData: {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Free youtube downloader",
        "applicationCategory": "WebApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    }
  },
  head() {
    return {
      script: [{ type: 'application/ld+json', json: this.structuredData }]
    }
  },
})
</script>
