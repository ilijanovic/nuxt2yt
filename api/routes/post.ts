import { Router } from 'express'
import fs from 'fs'
import ytdl from 'ytdl-core'
import { isYoutubeLink, string_to_slug, toHHMMSS } from '../utils'
import ffmpeg from 'fluent-ffmpeg'
import childProcess from 'child_process'
;(function () {
  var oldSpawn = childProcess.spawn
  function mySpawn() {
    console.log('spawn called')
    console.log(arguments)
    //@ts-ignore
    var result = oldSpawn.apply(this, arguments)
    return result
  }
  //@ts-ignore
  childProcess.spawn = mySpawn
})()

let router = Router()

router.post('/check', async (req, res) => {
  let { link } = req.body
  if (!isYoutubeLink(link)) {
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

router.post('/generate', async (req, res) => {
  let { link, format } = req.body

  if (!isYoutubeLink(link)) {
    return res.status(400).json({ message: 'This domain is not youtube' })
  }
  try {
    let info = await ytdl.getBasicInfo(link)
    let name = string_to_slug(`${info.videoDetails.title + '_' + Date.now()}`)

    let filename = `./data/` + name + `.${format}`

    ytdl(link, {
      //@ts-ignore
      format,
      quality: 'highest',
      filter: format === 'mp3' ? 'audioonly' : 'video',
    })
      .pipe(fs.createWriteStream(filename))

      .on('finish', async () => {
        ffmpeg('./data/' + name + `.${format}`)
          .toFormat('mp3')
          .save('./music/' + name + `.${format}`)

        res.status(200).json({ filename: name + `.${format}` })
        setTimeout(() => {
          fs.unlink(filename, () => {})
        }, 1000 * 60 * 5)
      })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/download/:filename', async (req, res) => {
  let { filename } = req.params

  let path = `./data/` + filename

  res.download(path)
})

router.post('/cut', async (req, res) => {
  let { link, format, start, end } = req.body

  if (!isYoutubeLink(link)) {
    return res.status(400).json({ message: 'This domain is not youtube' })
  }
  try {
    let info = await ytdl.getBasicInfo(link)
    let name = string_to_slug(`${info.videoDetails.title + '_' + Date.now()}`)

    let filename = `./data/` + name + `.${format}`
    let startTime = toHHMMSS(+start)
    let duration = +end - +start
    if (duration <= 0) {
      throw 'Duration is negative'
    }
    ytdl(link, {
      //@ts-ignore
      format,
      filter: format === 'mp3' ? 'audioonly' : 'video',
    })
      .pipe(fs.createWriteStream(filename))
      .on('finish', () => {
        let name = string_to_slug(`${info.videoDetails.title}`) + `.${format}`
        let ffmpegName = `./data/` + name

        ffmpeg(filename)
          .setStartTime(startTime)

          .duration(duration)
          .output(ffmpegName)
          .on('end', function (err) {
            if (!err) {
              res.status(200).json({ filename: name })

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
