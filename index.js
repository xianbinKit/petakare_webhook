const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = 6474 // 需要打开AWS EC2对应端口
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const exec = require('child_process').exec

function promisifyCMD(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error)
      }
      resolve(stdout ? stdout : stderr)
    })
  })
}

async function updateAPI(req, res, next) {
  var content = req.body
  console.log('updated api')
  res.status(200).send('OK')
}

async function updateWebhook(req, res, next) {
  console.log('Updating webhook')
  const cmd =
    'pm2 stop webhook & npm install & pm2 start index.js --name webhook'
  promisifyCMD(cmd).then(result => {
    console.log('Updated webhook')
  })
  res.status(200).send('OK')
}

// Condiguration
app.use(jsonParser)
app.use(urlencodedParser)

// webhook trigger
app.post('/api', updateAPI)
app.post('/webhook', updateWebhook)

// Start server
app.listen(PORT)
console.log('app is listening on ', PORT)
