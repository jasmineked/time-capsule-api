const express = require('express')
const passport = require('passport')
const Present = require('../models/present')
const customErrors = require('../../lib/custom_errors')
// const handle404 = customErrors.handle404
// const requireOwnership = customErrors.requireOwnership

// middleware that removes blank fields
// const removeBlanks = require('../../lib/remove_blank_fields')

// passing this as a second arguent to `router.verb` will make it so that a token must be passerd for that route to be avai
// it will also set to req.user
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// CREATE, POST
router.post('/presents', requireToken, (req, res, next) => {
  // set owner of new present to be current user
  req.body.present.owner = req.user.id

  Present.create(req.body.present)
    .then(present => {
      res.status(201).json({ present: present.toObject() })
    })
    .catch(next)
})

module.exports = router
