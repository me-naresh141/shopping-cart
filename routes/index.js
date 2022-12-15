var express = require('express')
var router = express.Router()
let User = require('../modals/user')
let Product = require('../modals/product')
let Cart = require('../modals/cart')
let auth = require('../middelware/auth')

/* GET home page. */
router.get('/', function (req, res, next) {
  let userId = req.session.userId
  let obj = {}
  let { category } = req.query
   if (category) {
    obj.category = category
  }
  Product.find(obj, (err, product) => {
    if (err) return next(err)
    Product.distinct('category', (err, uniqueCategory) => {
      Cart.find({ userId })
        .populate('productId')
        .exec((err, cart) => {
          return res.render('index', { product, cart, uniqueCategory })
        })
    })
  })
})

module.exports = router
