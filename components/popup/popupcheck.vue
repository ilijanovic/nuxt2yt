<template>

    <div class="bg-black flex absolute w-full h-full left-0 top-0 background">
        <div class="bg-white p-4 m-auto max-w-md w-full rounded ">
            <h3 class="font-bold">Caution</h3>
            <p>Pop-ups are disabled in this browser. In order to use this tool without problems you will need to enable
                popups.</p>
            <hr class="my-2">
            <p class="mb-2">Our tool downloads and converts the youtube video and after its done it generates an URL.
                Our app
                automatic redirects
                to this URL to trigger the download. Without enabled popups the redirect may wont work
            </p>
            <hr class="my-2">
            </hr>
            <h3 class="font-bold">How to enable</h3>
            <p>Just try to download an Video or MP3 file. Your browser will open an popup window that blocks it, you
                will need to allow it manual</p>
            <Regular class="flex ml-auto" @click.native="ok">Alright!</Regular>
        </div>
    </div>
</template>
<script lang="ts">
import regularVue from "../buttons/regular.vue";
import Vue from "vue"
import Regular from "../buttons/regular.vue";
export default Vue.extend({
    components: { regularVue, Regular },
    methods: {
        ok() {
            this.$emit("close")
        }
    }
})
</script>
<style scoped>
.background {
    background: rgba(0, 0, 0, 0.5)
}
</style>