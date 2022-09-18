import { Router } from 'express'

let router = Router()

router.get('/test', (req, res) => {
  res.send('nice')
})

export default router
