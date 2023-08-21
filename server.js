const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const methodOverride = require('method-override')
const app = express()
require('dotenv').config()

/*
// mongoDB local DB
mongoose.connect('mongodb://127.0.0.1/urlShortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // get rid of deprication warnings
})
 */

// mongoDB atlas DB
try {
  mongoose.connect(process.env.MONGO_URI)
} catch (err) {
  console.err(err)
}

/* const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log('MangoDB Connected')
  } catch (error) {
    console.log(error)
    process.exit(1) // exit with failure
  }
}

connectDB()
 */
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
