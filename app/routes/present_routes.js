const express = require('express')
const passport = require('passport')
const Present = require('../models/present')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

// middleware that removes blank fields
const removeBlanks = require('../../lib/remove_blank_fields')

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

// DeSTROY /presents/id#
router.delete('/presents/:id', requireToken, (req, res, next) => {
  Present.findById(req.params.id)
    .then(handle404)
    .then(present => {
    // throw an err if current user doesn;t own presents
      requireOwnership(req, present)
      // delete the example ONLY if the above didn't throw
      present.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// show | GET
router.get('/presents/:id', requireToken, (req, res, next) => {
  // req.params.d will be set based on the id in the route
  Present.findById(req.params.id)
    .then(handle404)
  // if findById is successful, respond with 200 and present in JSON form
    .then(present => res.status(200).json({ present: present.toObject() }))
  // if an err occurs , pass it to the handler
    .catch(next)
})

module.exports = router
