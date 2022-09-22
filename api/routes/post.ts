import { Router } from 'express'
import fs from 'fs'
import ytdl from 'ytdl-core'
import { string_to_slug, toHHMMSS } from '../utils'
import ffmpeg from 'fluent-ffmpeg'
let router = Router()

router.post('/check', async (req, res) => {
  let { link } = req.body
  if (!link.startsWith('https://youtube.com')) {
    return res.status(400).json({ message: 'This domain is not youtube' })
  }
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
  if (!decodedLink.startsWith('https://youtube.com')) {
    return res.status(400).json({ message: 'This domain is not youtube' })
  }
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

router.get('/cut/:link/:format/:start/:end', async (req, res) => {
  let { link, format, start, end } = req.params
  let decodedLink = decodeURIComponent(link)
  if (!decodedLink.startsWith('https://youtube.com')) {
    return res.status(400).json({ message: 'This domain is not youtube' })
  }
  try {
    let info = await ytdl.getBasicInfo(decodedLink)
    let name = string_to_slug(`${info.videoDetails.title + '_' + Date.now()}`)

    let filename = `./data/` + name + `.${format}`
    let startTime = toHHMMSS(+start)
    let duration = +end - +start
    if (duration <= 0) {
      throw 'Duration is negative'
    }
    ytdl(decodedLink, {
      //@ts-ignore
      format,
      filter: format === 'mp3' ? 'audioonly' : 'video',
    })
      .pipe(fs.createWriteStream(filename))
      .on('finish', () => {
        let ffmpegName =
          `./data/` +
          string_to_slug(`${info.videoDetails.title + '_' + Date.now()}`) +
          `.${format}`
        ffmpeg(filename)
          .setStartTime(startTime)

          .duration(duration)
          .output(ffmpegName)
          .on('end', function (err) {
            console.log(err)
            if (!err) {
              console.log(ffmpegName)
              res.download(ffmpegName)
              fs.unlink(filename, () => {})
              setTimeout(() => {
                fs.unlink(ffmpegName, () => {})
              }, 1000 * 60 * 5)
            } else {
              fs.unlink(filename, () => {})

              res.status(400).json({ message: 'Something went wrong' })
            }
          })
          .on('error', (err) => {
            console.log(err)
            fs.unlink(filename, () => {})
            res.status(400).json({ message: 'Something went wrong' })
          })
          .run()
      })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})
export default router
