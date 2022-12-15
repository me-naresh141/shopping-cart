let mongoose = require('mongoose')
let Schema = mongoose.Schema
let bcrypt = require('bcrypt')
let userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    mobile: { type: Number, required: true },
    city: { type: String, required: true },
    image: { type: String, required: true },
    admin: { type: Boolean, default: false, required: true },
    productId: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    block: { type: Boolean, default: false, required: true },
    info: { type: String, default: 'user unblock', required: true },
  },
  { timestamps: true },
)

userSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err)
      this.password = hashed
      return next()
    })
  }
})
// password
userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result)
  })
}

module.exports = mongoose.model('User', userSchema)
