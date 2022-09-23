export function makeid(length: number) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
export function string_to_slug(str: string) {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
  var to = 'aaaaeeeeiiiioooouuuunc------'
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '_') // collapse whitespace and replace by -
    .replace(/-+/g, '_') // collapse dashes

  return str
}

export function toHHMMSS(seconds: number) {
  return new Date(seconds * 1000).toISOString().slice(11, 19)
}

export function isYoutubeLink(link: string) {
  return (
    link.startsWith('https://youtube.com') ||
    link.startsWith('https://youtu.be') ||
    link.startsWith('https://wwww.youtu.be') ||
    link.startsWith('https://www.youtube.com') ||
    link.startsWith('http://youtube.com') ||
    link.startsWith('http://www.youtube.com')
  )
}
