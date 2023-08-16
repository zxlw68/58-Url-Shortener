const mongoose = require('mongoose')
const shortId = require('shortid')

const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    default: shortId.generate,
    // auto run default function () => shortId.generate(),
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
    // start from 0
  },
})

module.exports = mongoose.model('Modelname', shortUrlSchema, 'collectionname')
