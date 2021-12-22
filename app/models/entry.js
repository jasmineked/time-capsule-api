const mongoose = require('mongoose')

const entrySchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: false
    },
    text: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },

  {
    timestamps: true
  }
)
module.exports = mongoose.model('Entry', entrySchema)
