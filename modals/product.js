let mongoose = require('mongoose')
let Schema = mongoose.Schema

let productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  userId: { type: String, required: true },
})
module.exports = mongoose.model('Product', productSchema)
