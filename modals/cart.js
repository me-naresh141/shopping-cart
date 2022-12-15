let mongoose = require('mongoose')
let Schema = mongoose.Schema
let cartSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product'},
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
})

module.exports = mongoose.model('Cart', cartSchema)
