import { Router } from 'express'
import fs from 'fs'
import ytdl from 'ytdl-core'
import { string_to_slug } from '../utils'
let router = Router()

router.post('/check', async (req, res) => {
  let { link } = req.body
  try {
    let info = await ytdl.getBasicInfo(link)
    let thumbnail =
      info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url
    res.status(200).json({ thumbnail, videoDetails: info.videoDetails })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/download/:link/:format', async (req, res) => {
  let { link, format } = req.params
  let decodedLink = decodeURIComponent(link)

  try {
    let info = await ytdl.getBasicInfo(decodedLink)
    let name = string_to_slug(`${info.videoDetails.title + '_' + Date.now()}`)

    let filename = `./data/` + name + `.${format}`

    ytdl(decodedLink, {
      //@ts-ignore
      format,
      filter: format === 'mp3' ? 'audioonly' : 'video',
    })
      .pipe(fs.createWriteStream(filename))
      .on('finish', () => {
        res.download(filename)
        setTimeout(() => {
          fs.unlink(filename, () => {})
        }, 1000 * 60 * 5)
      })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})
export default router
