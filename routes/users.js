var express = require('express')
var router = express.Router()
let User = require('../modals/user')
let Product = require('../modals/product')
let Cart = require('../modals/cart')
let auth = require('../middelware/auth')

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

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

//find admin form
router.get('/admin', (req, res, next) => {
  let userId = req.session.userId
  User.findById(userId, (err, user) => {
    if (user.admin == true) {
      Product.find({ userId }, (err, product) => {
        if (err) return next(err)
        Cart.find({ userId }, (err, cart) => {
          if (err) return next(err)
          User.find({}, (err, alluser) => {
            if (err) return next(err)
            return res.render('adminform', { product, cart, alluser })
          })
        })
      })
    } else {
      return res.redirect('/')
    }
  })
})

// find sign up form
router.get('/signup', (req, res, next) => {
  return res.render('sign-up')
})
// submit sign up form

router.post('/signup', upload.single('image'), (req, res, next) => {
  req.body.image = req.file.filename
  let email = req.body.email
  User.findOne({ email }, (err, user) => {
    if (!user) {
      User.create(req.body, (err, user) => {
        if (err) return next(err)
        return res.redirect('/users/signin')
      })
    } else {
      req.flash('error', 'This user allready sign up')
      return res.redirect('/users/signin')
    }
  })
})

// find sign in form
router.get('/signin', (req, res, next) => {
  let error = req.flash('error')[0]
  console.log('error', error)
  return res.render('sign-in', { error })
})

// submit sign in form
router.post('/signin', (req, res, next) => {
  let { email, password } = req.body
  if (!email && !password) {
    req.flash('error', 'Email,passwword is required ')
    return res.redirect('/users/signin')
  }
  User.findOne({ email }, (err, user) => {
    // no user
    if (!user) {
      req.flash('error', 'Email is invalid ')
      return res.redirect('/users/signin')
    }
    if (user.block == true) {
      req.flash('error', 'This Email is  blocked ♨️')
      return res.redirect('/users/signin')
    }
    // password compare
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err)
      if (!result) {
        req.flash('error', 'Passwword is required ')
        return res.redirect('/users/signin')
      }

      // persist loged in user information
      req.session.userId = user.id

      if (user.admin == true) {
        req.session.userId = user.id
        return res.redirect('/users/admin')
      } else {
        return res.redirect('/')
      }
    })
  })
})

// handle logout
router.get('/logout', (req, res, next) => {
  req.session.destroy()
  res.clearCookie('connect.sid')
  return res.redirect('/users/signin')
})

//add new product
router.post('/product', upload.single('image'), (req, res, next) => {
  req.body.image = req.file.filename
  req.body.userId = req.session.userId
  Product.create(req.body, (err, product) => {
    if (err) return next(err)
    return res.redirect('/users/admin')
  })
})
// add to cart
router.get('/:id/cart', (req, res, next) => {
  req.body.productId = req.params.id
  req.body.userId = req.session.userId
  Product.findById(req.params.id, (err, product) => {
    if (err) return next(err)
    if (product.quantity > 0) {
      Product.findByIdAndUpdate(
        req.params.id,
        { $inc: { quantity: -1 } },
        (err, product) => {
          if (err) return next(err)
          Cart.create(req.body, (err, cart) => {
            if (err) return next(err)
            return res.redirect('/')
          })
        },
      )
    } else {
      return res.redirect('/')
    }
  })
})

// remove cart item
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id
  Cart.findByIdAndDelete(id, (err, cart) => {
    return res.redirect('/')
  })
})

module.exports = router
