const express = require('express')
const router = express.Router()

router.get('/info', (req, res, next) => {
  res.json('user info....')
})

module.exports = router
