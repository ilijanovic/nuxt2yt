<template>
    <div class="flex flex-col gap-2">
        <transition name="popin" mode="out-in">
            <div class="flex flex-col gap-2" key="1" v-if="!list">
                <small class="text-gray-600 text-center">Type in your video URL you want to cut</small>
                <div class="flex justify-center gap-2">
                    <input class="border rounded p-3 w-full outline-none" v-model="link" type="text" />
                    <Regular @click.native="check" :disabled="loading" :loading="loading">Check</Regular>
                </div>
                <transition name="popin">
                    <div class="flex gap-2" v-if="thumbnail">
                        <img :src="thumbnail" class="w-full max-w-xs object-cover" />
                        <div class="flex flex-col gap-2">
                            <p class="text-gray-600">Please type in your start end in seconds</p>
                            <div class="flex gap-2">

                                <div>
                                    <small>Start</small>
                                    <input class="border p-2 rounded" v-model="start" :min="0" type="text">
                                </div>
                                <div>
                                    <small>End</small>
                                    <input class="border p-2 rounded" v-model="end" type="text" />
                                </div>

                            </div>
                            <Regular @click.native="download" class="block">Download</Regular>
                        </div>
                    </div>
                </transition>
            </div>

        </transition>
        <div class="border rounded p-4">
            <p class="text-gray-600">Enter your video URL. Then specify start and end in seconds and click download.
                Once your video has been edited it will be downloaded automatically, fast and free!</p>
        </div>

    </div>
</template>
  
<script lang="ts">
import Vue from 'vue'
import Regular from '~/components/buttons/regular.vue'
import '@/assets/transition/list.css'
import '@/assets/transition/popin.css'
export default Vue.extend({

    name: 'IndexPage',
    layout: 'default',

    data() {
        return {
            loading: false,
            thumbnail: '',
            list: false,
            max: 10,
            link: '',
            start: 0,
            end: 0
        }
    },
    methods: {
        makeid(length: number) {
            var result = ''
            var characters =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            var charactersLength = characters.length
            for (var i = 0; i < length; i++) {
                result += characters.charAt(
                    Math.floor(Math.random() * charactersLength)
                )
            }
            return result
        },
        async getInfo(l: any) {
            try {
                let result = await this.$axios.$post('/api/check', {
                    link: l.link,
                })
                l.thumbnail = result.thumbnail
                l.title = result.videoDetails.title

            } catch (err) {
            } finally {
                this.loading = false
            }
        },
        async download(event: any, link: string) {
            //@ts-ignore
            this.$ga.event({
                eventCategory: 'category',
                eventAction: 'action',
                eventLabel: 'download_cutted_video',
                eventValue: 1
            })
            this.$store.commit("SET_NOTIFICATION", {
                text: "Your request is being processed, it will take a few seconds",
                show: true
            })
            setTimeout(() => {
                this.$store.commit("SET_NOTIFICATION", {
                    show: false
                })
            }, 5000);
            try {
                let a = document.createElement('a')
                if (!link) {
                    link = encodeURIComponent(this.link)
                }
                a.href = '/api/cut/' + link + '/' + 'mp4' + "/" + this.start + "/" + this.end
                a.click()
            } catch (err) { }
        },
        async check() {

            //@ts-ignore
            this.$ga.event({
                eventCategory: 'category',
                eventAction: 'action',
                eventLabel: 'check_video_cutter',
                eventValue: 1
            })

            this.loading = true

            try {
                let result = await this.$axios.$post('/api/check', {
                    link: this.link,
                })
                this.end = result.videoDetails.lengthSeconds
                this.thumbnail = result.thumbnail
            } catch (err) {
            } finally {
                this.loading = false
            }
        },
    },
    components: {
        Regular,
    },
})
</script>
<style scoped>
.active {
    @apply bg-purple-500 text-white;
}

.disabled {
    background: lightgrey;
    color: gray;
    pointer-events: none;
    cursor: none;
}
</style>
  