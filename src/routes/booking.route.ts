import { Booking } from '@/models/booking.model'
import ApiError from '@/utils/ApiError'
import express from 'express'
import httpStatus from 'http-status'
import passport, { authenticate } from 'passport'
import { Types } from 'mongoose'

const router = express.Router()

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    // logger.debug('%o', req.user)
    const user: any = req.user;
    const bookings = await Booking.find({userId: user.id});
    res.status(200).json({
      status: 'ok',
      data: bookings
    });
  })

  router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
      const user: any = req.user;
      const booking = await Booking.findOne({ _id: Types.ObjectId(req.params.id), userId: user.id })
      if (!booking) throw new ApiError(httpStatus.NOT_FOUND, 'booking not found')
      res.status(200).json({
        status: 'ok',
        data: booking
      });
    } catch (e) {
      next(e)
    }
  })

  router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
      const booking = new Booking(req.body)
      await booking.save()
      res.status(200).json({
        status: 'ok',
        data: booking
      });
    } catch (e) {
      next(e)
    }
  })

  router.patch('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
      const user: any = req.user;
      const booking = await Booking.findOne({ _id: Types.ObjectId(req.params.id), userId: user.id })
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
      const user: any = req.user;
      const booking = await Booking.findOne({ _id: Types.ObjectId(req.params.id), userId: '' + user._id })
      if (!booking) throw new ApiError(httpStatus.NOT_FOUND, 'booking not found')
      await booking.delete()
      res.status(200).json({
        status: 'ok',
        msg: 'Booking deleted successfully'
      });
    } catch (e) {
      next(e)
    }
  })

export default router