let express = require('express')
let router = express.Router()
let User = require('../modals/user')
let Product = require('../modals/product')
let Cart = require('../modals/cart')

// multer
let multer = require('multer')
const product = require('../modals/product')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now + file.originalname)
  },
})
var upload = multer({ storage: storage })

// find  edit product form
router.get('/:id/edit', (req, res, next) => {
  let userId = req.session.userId
  let productId = req.params.id
  Product.findById(productId, (err, product) => {
    if (err) return next(err)
    Cart.find({ userId }, (err, cart) => {
      return res.render('editproduct', { product, cart })
    })
  })
})

// submit edit form
router.post('/:id/edit', upload.single('image'), (req, res, next) => {
  let productId = req.params.id
  Product.findByIdAndUpdate(
    productId,
    req.body,
    { new: true },
    (err, product) => {
      return res.redirect('/users/admin')
    },
  )
})

// delete product
router.get('/:id/delete', (req, res, next) => {
  let productId = req.params.id
  Product.findByIdAndDelete(productId, (err, product) => {
    return res.redirect('/users/admin')
  })
})

// block user
router.get('/:id/block', (req, res, next) => {
  let userId = req.params.id
  req.body.block = true
  req.body.info = 'this user blocked'
  User.findByIdAndUpdate(userId, req.body, (err, user) => {
    return res.redirect('/users/admin')
  })
})

// unblock user
router.get('/:id/unblock', (req, res, next) => {
  let userId = req.params.id
  req.body.block = false
  req.body.info = 'this user unblock'
  User.findByIdAndUpdate(userId, req.body, (err, user) => {
    return res.redirect('/users/admin')
  })
})

module.exports = router
