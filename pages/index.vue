<template>
  <div class="flex mx-auto flex-col gap-2">

    <small class="text-gray-600 text-center">Switch between single download or list download</small>
    <div class="flex justify-center gap-2">
      <i @click="list = false" :class="{ active: !list }"
        class="fa-solid fa-download border hover:bg-gray-100 rounded p-5 cursor-pointer"></i>
      <i @click="list = true" :class="{ active: list }"
        class="fa-solid fa-list border hover:bg-gray-100 rounded p-5 cursor-pointer"></i>
    </div>
    <transition name="popin" mode="out-in">
      <div class="flex flex-col gap-2" key="1" v-if="!list">
        <small class="text-gray-600 text-center">Type in your video URL you want to download</small>
        <div class="flex justify-center gap-2">
          <input class="border rounded p-3 w-full outline-none" v-model="link" type="text" />
          <Regular @click.native="check" :disabled="loading" :loading="loading">Check</Regular>
        </div>
        <transition name="popin">
          <div class="flex md:flex-row flex-col gap-2" v-if="thumbnail">
            <img :src="thumbnail" class="w-full md:max-w-xs object-cover" />
            <div class="flex flex-col gap-2">
              <Regular :disabled="loadMp3" :loading="loadMp3" @click.native="mp3" class="block">Download Mp3</Regular>
              <Regular :disabled="loadMp4" :loading="loadMp4" @click.native="mp4" class="block">Download Mp4</Regular>
            </div>
          </div>
        </transition>
      </div>
      <div class="flex flex-col gap-2" key="2" v-else>

        <div class="border p-4 rounded">
          <p class="text-red-600"><b>Warning: </b>When downloading in parallel, your browser may block pop-ups. You will
            need to allow this
            to download multiple files in parallel</p>
        </div>
        <p class="text-gray-600">Max: {{ links.length }} / {{ max }}</p>
        <div class="flex flex-col relative justify-center gap-2">
          <transition-group name="list">
            <div class="w-full bg-white" :key="l.key" v-for="l in links">
              <div class="flex items-center justify-between">
                <div class="flex w-full flex-col gap-2">
                  <p class="text-gray-600">Title: {{ l.title }}</p>
                  <div class="flex gap-2 w-full">
                    <i @click="l.format = 'mp3'" :class="{ active: l.format === 'mp3' }"
                      class="fa-solid fa-volume-high border hover:bg-gray-100 rounded p-2 cursor-pointer"></i>
                    <i @click="l.format = 'mp4'" :class="{ active: l.format === 'mp4' }"
                      class="fa-solid fa-video border hover:bg-gray-100 rounded p-2 cursor-pointer"></i>
                  </div>
                </div>
                <img v-if="l.thumbnail" :src="l.thumbnail" class="h-14 block w-14 max-w-xs object-cover" />
                <i @click="remove(l)"
                  class="fa-solid ml-2 flex fa-trash border  hover:bg-red-200 active:bg-red-500 rounded p-2 cursor-pointer" />

              </div>
              <input @input="getInfo(l)" class="border my-2 block rounded p-3 w-full outline-none" v-model="l.link"
                type="text" />
            </div>
          </transition-group>
        </div>
        <div class="flex justify-between">
          <Regular :loading="downloadListLoading" :disabled="downloadListLoading" @click.native="downloadList">
            Download</Regular>
          <i @click="add" :class="{ disabled: links.length >= max }"
            class="fa-solid self-end fa-plus cursor-pointer active:text-white active:bg-purple-500 p-4 border rounded"></i>
        </div>
      </div>
    </transition>
    <div class="md:flex gap-4">
      <div class="border my-2 w-full rounded flex items-center flex-col p-4 justify-center">
        <div class="border rounded-full w-16  h-16 flex justify-center items-center">
          <i class="fa-solid fa-arrow-down text-gray-600 text-3xl"></i>
        </div>

        <h3 class="font-bold text-gray-700">Automatic</h3>
        <p class="text-gray-600">Copy and paste the youtube URL, click on check and download it!</p>
      </div>
      <div class="border my-2 w-full rounded flex items-center flex-col p-4 justify-center">
        <div class="border rounded-full w-16  h-16 flex justify-center items-center">
          <i class="fa-solid fa-user-slash text-gray-600 text-3xl"></i>

        </div>

        <h3 class="font-bold text-gray-700">No registration</h3>
        <p class="text-gray-600">No registration needed to use this tool </p>
      </div>
      <div class="border my-2 w-full rounded flex items-center flex-col p-4 justify-center">
        <div class="border rounded-full w-16  h-16 flex justify-center items-center">

          <i class="fa-solid fa-list  text-gray-600 text-3xl"></i>
        </div>

        <h3 class="font-bold text-gray-700">Multiple downloads</h3>
        <p class="text-gray-600">Switch to list view and download multiple MP4 or MP3 files at once!</p>
      </div>

    </div>
    <div class="border rounded p-4">
      <p class="text-gray-600">Easy video downloader is the fastest Youtube Downloader tool that allows you to easily
        convert and download
        videos and audios
        from youtube for free. Easy video downloader is THE tool to download
        youtube
        videos without any need for registration. We support audio and video formats like MP3, MP4, and the most amazing
        thing, it's completely free.</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Regular from '~/components/buttons/regular.vue'
import '@/assets/transition/list.css'
import '@/assets/transition/popin.css'
import socket from '@/plugins/socket'
export default Vue.extend({

  name: 'IndexPage',
  layout: 'default',
  data() {
    return {
      downloadListLoading: false,
      loading: false,
      thumbnail: '',
      list: false,
      loadMp3: false,
      loadMp4: false,
      max: 60,
      link: '',
      downloadPromises: [],
      links: [
        {
          link: '',
          key: 'asdfasdfasdfdasf',
          title: '',
          thumbnail: '',
          format: 'mp3',
        },
      ],
    }
  },
  methods: {

    remove(l: any) {
      //@ts-ignore
      this.$ga.event({
        eventCategory: 'category',
        eventAction: 'action',
        eventLabel: 'remove_list_item',
        eventValue: 1
      })
      let index = this.links.findIndex(link => link.key === l.key)

      if (index !== -1) {
        this.links.splice(index, 1)
      }
    },
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
    async downloadList() {
      this.downloadListLoading = true
      //@ts-ignore
      this.$ga.event({
        eventCategory: 'category',
        eventAction: 'action',
        eventLabel: 'downloadList',
        eventValue: 1
      })
      for (let i = 0; i < this.links.length; i++) {
        let link = this.links[i]
        this.link = link.link
        if (link.format === 'mp3') {

          let promise = this.mp3()
          //@ts-ignore
          this.downloadPromises.push(promise)
        } else {
          let promise = this.mp4()
          //@ts-ignore
          this.downloadPromises.push(promise)
        }
      }
      try {
        await Promise.all(this.downloadPromises)

      } catch (err) { } finally {
        this.downloadListLoading = false
        this.downloadPromises = []
      }

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
    add() {
      //@ts-ignore
      this.$ga.event({
        eventCategory: 'category',
        eventAction: 'action',
        eventLabel: 'add_item_to_list',
        eventValue: 1
      })
      this.links.push({
        link: '',
        key: this.makeid(10),
        title: '',
        thumbnail: '',
        format: 'mp3',
      })
    },
    async mp4() {
      this.loadMp4 = true

      this.$store.commit("SET_NOTIFICATION", {
        text: "Your request is being processed, it will take a few seconds",
        show: true
      })
      setTimeout(() => {
        this.$store.commit("SET_NOTIFICATION", {
          show: false
        })
      }, 5000);
      //@ts-ignore
      this.$ga.event({
        eventCategory: 'category',
        eventAction: 'action',
        eventLabel: 'mp4_download',
        eventValue: 1
      })
      try {
        let result = await this.$axios.$post("/api/generate", {
          link: this.link,
          format: "mp4"
        })
        window.open('/api/download/' + result.filename, this.makeid(5))
      } catch (err) { } finally {

        this.loadMp4 = false

      }
    },
    async mp3() {
      this.loadMp3 = true
      this.$store.commit("SET_NOTIFICATION", {
        text: "Your request is being processed, it will take a few seconds",
        show: true
      })
      setTimeout(() => {
        this.$store.commit("SET_NOTIFICATION", {
          show: false
        })
      }, 5000);
      //@ts-ignore
      this.$ga.event({
        eventCategory: 'category',
        eventAction: 'action',
        eventLabel: 'mp3_download',
        eventValue: 1
      })
      try {
        let result = await this.$axios.$post("/api/generate", {
          link: this.link,
          format: "mp3"
        })
        window.open('/api/download/' + result.filename, this.makeid(5))
        // let a = document.createElement('a')
        // a.target = "_blank"
        // a.href = '/api/download/' + result.filename
        // a.click()
      } catch (err) { } finally {

        this.loadMp3 = false

      }
    },
    async check() {
      this.loading = true
      //@ts-ignore
      this.$ga.event({
        eventCategory: 'category',
        eventAction: 'action',
        eventLabel: 'video_check',
        eventValue: 1
      })
      try {
        let result = await this.$axios.$post('/api/check', {
          link: this.link,
        })
        this.thumbnail = result.thumbnail
      } catch (err) {
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    if (process.client) {
      socket.on("test", data => {
        console.log(data)
      })
    }
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
