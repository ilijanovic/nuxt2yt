<template>
  <button :class="{ disabled }"
    class="px-8 py-2 rounded active:bg-purple-700 bg-purple-500 transition text-white hover:bg-purple-600">
    <slot cy="buttontext" v-if="!loading"></slot>
    <div cy="buttonloader" v-else class="loader mx-auto"></div>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    disabled: {
      default: false,
    },
    loading: {
      default: false,
    },
  },
})
</script>
<style scoped>
.disabled {
  background: lightgrey;
  color: gray;
  pointer-events: none;
  cursor: none;
}

.loader {
  border: 3px solid #f3f3f3;
  /* Light grey */
  border-top: 3px solid #727272;
  /* Blue */
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 400ms linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
