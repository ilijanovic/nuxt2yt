<template>
  <div class="flex mx-auto flex-col gap-2">
    <small class="text-gray-500 text-center">Switch between single download or list download</small>
    <div class="flex justify-center gap-2">
      <i @click="list = false" :class="{ active: !list }"
        class="fa-solid fa-download border hover:bg-gray-100 rounded p-5 cursor-pointer"></i>
      <i @click="list = true" :class="{ active: list }"
        class="fa-solid fa-list border hover:bg-gray-100 rounded p-5 cursor-pointer"></i>
    </div>
    <transition name="popin" mode="out-in">
      <div class="flex flex-col gap-2" key="1" v-if="!list">
        <small class="text-gray-500 text-center">Type in your video URL you want to download</small>
        <div class="flex justify-center gap-2">
          <input class="border rounded p-3 w-full outline-none" v-model="link" type="text" />
          <Regular @click.native="check" :disabled="loading" :loading="loading">Check</Regular>
        </div>
        <transition name="popin">
          <div class="flex gap-2" v-if="thumbnail">
            <img :src="thumbnail" class="w-full max-w-xs object-cover" />
            <div class="flex flex-col gap-2">
              <Regular @click.native="mp3" class="block">Download Mp3</Regular>
              <Regular @click.native="mp4" class="block">Download Mp4</Regular>
            </div>
          </div>
        </transition>
      </div>
      <div class="flex flex-col gap-2" key="2" v-else>
        <p>Max: {{ links.length }} / {{ max }}</p>
        <div class="flex flex-col justify-center gap-2">
          <transition-group name="list">
            <div :key="l.key" v-for="l in links">
              <div class="flex items-center justify-between">
                <div class="flex flex-col gap-2">
                  <p>Title: {{ l.title }}</p>
                  <div>
                    <i @click="l.format = 'mp3'" :class="{ active: l.format === 'mp3' }"
                      class="fa-solid fa-volume-high border hover:bg-gray-100 rounded p-2 cursor-pointer"></i>
                    <i @click="l.format = 'mp4'" :class="{ active: l.format === 'mp4' }"
                      class="fa-solid fa-video border hover:bg-gray-100 rounded p-2 cursor-pointer"></i>
                  </div>
                </div>
                <img v-if="l.thumbnail" :src="l.thumbnail" class="h-14 w-14 max-w-xs object-cover" />
              </div>
              <input @input="getInfo(l)" class="border my-2 block rounded p-3 w-full outline-none" v-model="l.link"
                type="text" />
            </div>
          </transition-group>
        </div>
        <div class="flex justify-between">
          <Regular @click.native="downloadList">Download</Regular>
          <i @click="add" :class="{ disabled: links.length >= max }"
            class="fa-solid self-end fa-plus cursor-pointer active:text-white active:bg-purple-500 p-4 border rounded"></i>
        </div>
      </div>
    </transition>
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
      for (let i = 0; i < this.links.length; i++) {
        await new Promise((res) => setTimeout(res, 2000))
        let link = this.links[i]
        if (link.format === 'mp3') {
          this.mp3(undefined, link.link)
        } else {
          this.mp4(undefined, link.link)
        }
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
      this.links.push({
        link: '',
        key: this.makeid(10),
        title: '',
        thumbnail: '',
        format: 'mp3',
      })
    },
    async mp4(event: any, link: string) {
      try {
        let a = document.createElement('a')
        if (!link) {
          link = encodeURIComponent(this.link)
        }
        a.href = '/api/download/' + link + '/' + 'mp4'
        a.click()
      } catch (err) { }
    },
    async mp3(event: any, link: string) {
      try {
        let a = document.createElement('a')
        if (!link) {
          link = encodeURIComponent(this.link)
        } else {
          link = encodeURIComponent(link)
        }
        console.log(link)
        a.href = '/api/download/' + link + '/' + 'mp3'
        a.click()
        document.removeChild(a)
      } catch (err) { }
    },
    async check() {
      this.loading = true

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
