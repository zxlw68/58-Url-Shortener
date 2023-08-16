const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://127.0.0.1/urlShortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // get rid of deprication warnings
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
// tell express we are using url parameters, to access form input, req.body,fullUrl
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  // get all urls in the ShortUrl table
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })
  // index.ejs  access form-input-name="fullUrl"
  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.delete('/:id', async (req, res) => {
  // const shortUrl = await ShortUrl.findById(req.params.id)
  // console.log(req.params.id)
  // console.log(shortUrl)

  await ShortUrl.findByIdAndDelete(req.params.id)
  res.redirect('/')

  // const shortUrl = await ShortUrl.findById(req.params.id)
  // console.log(shortUrl)
  // shortUrl.deleteOne()
  // res.redirect('/')
})

app.listen(process.env.PORT || 5000)
