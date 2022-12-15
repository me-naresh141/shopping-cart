let User = require('../modals/user')
module.exports = {
  isUserlogged: (req, res, next) => {
    if (req.session && req.session.userId) {
      next()
    } else {
      res.redirect('/users/signin')
    }
  },
  userinfo: (req, res, next) => {
    let userId = req.session && req.session.userId
    if (userId) {
      User.findById(userId, (err, user) => {
        if (err) return next(err)
        req.user = user
        res.locals.user = user
        next()
      })
    } else {
      req.user = null
      res.locals.user = null
      next()
    }
  },
}
