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

// CREATE, POST; /presents
router.post('/presents', requireToken, (req, res, next) => {
  // set owner of new present to be current user
  req.body.present.owner = req.user.id

  Present.create(req.body.present)
    .then(present => {
      res.status(201).json({ present: present.toObject() })
    })
    .catch(next)
})

// INDEX, GET; /presents
router.get('/presents', requireToken, (req, res, next) => {
  Present.find()
    .then(presents => {
      // presents will be an arr of Mongoose docs
      // we convert each one to POJO using
      // .map & .toObject
      return presents.map(present => present.toObject())
    })
    // respond with 200 status & JSON of the presents
    .then(presents => res.status(200).json({ presents: presents }))
    // if an err occurs, pass it to handler
    .catch(next)
})

module.exports = router
