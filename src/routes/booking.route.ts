import logger from '@/config/logger'
import { Room } from '@/models/Room.model'
import { Booking } from '@/models/booking.model'
import ApiError from '@/utils/ApiError'
import express from 'express'
import httpStatus from 'http-status'
import passport, { authenticate } from 'passport'

const router = express.Router()

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    // logger.debug('%o', req.user)
    const bookings = await Booking.find()
    res.json(bookings)
  })

  router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
      const booking = await Booking.findOne({ _id: req.params.id })
      if (!booking) throw new ApiError(httpStatus.NOT_FOUND, 'booking not found')
      res.json(booking)
    } catch (e) {
      next(e)
    }
  })

  router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        console.log(req.body);
      const booking = new Booking(req.body)
      await booking.save()
      res.json(booking)
    } catch (e) {
      next(e)
    }
  })

  router.patch('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
      const booking = await Booking.findOne({ _id: req.params.id })
      if (!booking) throw new ApiError(httpStatus.NOT_FOUND, 'booking not found')
      const { name, description, image } = req.body
      await booking.save()
      res.json(booking)
    } catch (e) {
      next(e)
    }
  })

  router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
      const booking = await Booking.findOne({ _id: req.params.id })
      if (!booking) throw new ApiError(httpStatus.NOT_FOUND, 'booking not found')
      await booking.delete()
      res.status(httpStatus.NO_CONTENT).send()
    } catch (e) {
      next(e)
    }
  })

export default router