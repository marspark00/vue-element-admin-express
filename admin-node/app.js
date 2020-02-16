const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', router)
const server = app.listen(5000, function() {
  const host = server.address().address
  const port = server.address().port

  console.log('HTTP Server is running on http://%s:%s', host, port)
})
