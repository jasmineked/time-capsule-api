const express = require('express')
const passport = require('passport')
const Entry = require('../models/entry')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

// middleware that removes blank fields
const removeBlanks = require('../../lib/remove_blank_fields')

// passing this as a second arguent to `router.verb` will make it so that a token must be passerd for that route to be avai
// it will also set to req.user
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// CREATE, POST; /entries
router.post('/entries', requireToken, (req, res, next) => {
  // set owner of new entry to be current user
  req.body.entry.owner = req.user.id

  Entry.create(req.body.entry)
    .then(entry => {
      res.status(201).json({ entry: entry.toObject() })
    })
    .catch(next)
})

// INDEX, GET; /entries
router.get('/entries', requireToken, (req, res, next) => {
  Entry.find()
    .then(entries => {
      // entries will be an arr of Mongoose docs
      // we convert each one to POJO using
      // .map & .toObject
      return entries.map(entry => entry.toObject())
    })
    // respond with 200 status & JSON of the entries
    .then(entries => res.status(200).json({ entries: entries }))
    // if an err occurs, pass it to handler
    .catch(next)
})

// DeSTROY /entries/id#
router.delete('/entries/:id', requireToken, (req, res, next) => {
  Entry.findById(req.params.id)
    .then(handle404)
    .then(entry => {
    // throw an err if current user doesn;t own entries
      requireOwnership(req, entry)
      // delete the example ONLY if the above didn't throw
      entry.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// show | GET
router.get('/entries/:id', requireToken, (req, res, next) => {
  // req.params.d will be set based on the id in the route
  Entry.findById(req.params.id)
    .then(handle404)
  // if findById is successful, respond with 200 and entry in JSON form
    .then(entry => res.status(200).json({ entry: entry.toObject() }))
  // if an err occurs , pass it to the handler
    .catch(next)
})

// update
// patch
router.patch('/entries/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new owner, prevent that by deleting that ey value pair
  delete req.body.entry.owner

  Entry.findById(req.params.id)
    .then(handle404)
    .then(entry => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an err if the current user isnt the owner
      requireOwnership(req, entry)

      // pass the result of Mongoose's `update` to the next `then`
      return entry.updateOne(req.body.entry)
    })
  // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
  // if an error occurs pass it to the handler
    .catch(next)
})
module.exports = router
