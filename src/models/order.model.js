const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({
  amount: {
    type: String
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'USER'
  },

  comment:{
    type: String
  },
  deadline: {
    type: String
  },
  file_link: {
    type: String
  },
  highlight :{
    type: String
  },
  order_file_link: {
    type: String
  },
  order_response_file_link: {
    type: String
  },
  pages: {
    type: String
  },
  payment_credited: {
    type: String
  },
  rating:{
    type: String
  },
  wordsLimit:{
    type: String
  },
  review: {
    type: String
  },
  status: {
    type: String
  },
  subject: {
    type: String
  },
  topic: {
    type: String
  },
  written_choice: {
    type: String
  },

  timestamp: {
    type: Date,
    default: Date.now
  }
})

const Order = mongoose.model('ORDER', OrderSchema)
module.exports = Order
