import logger from '@/config/logger'
import { Booking } from '@/models/booking.model'
import { Room } from '@/models/Room.model'
import ApiError from '@/utils/ApiError'
import express from 'express'
import httpStatus from 'http-status'
import { authenticate } from 'passport'

const router = express.Router()

router.get('/', async (req, res, next) => {
  // logger.debug('%o', req.user)
  const room = await Room.find()
  res.json(room)
})

router.post('/', async (req, res, next) => {
  try {
    logger.info(JSON.stringify(req.body))
    const room = new Room(req.body)
    await room.save()
    res.json(room)
  } catch (e) {
    next(e)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id })
    if (!room) throw new ApiError(httpStatus.NOT_FOUND, 'room not found')
    const { name, description, image } = req.body.room
    if (name) {
      room.name = name
    }
    if (description) {
      room.description = description
    }
    if (image) {
      room.images = image
    }
    await room.save()
    res.json(room)
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id })
    if (!room) throw new ApiError(httpStatus.NOT_FOUND, 'room not found')
    await room.delete()
    res.status(httpStatus.NO_CONTENT).send()
  } catch (e) {
    next(e)
  }
})

router.get('/check-availability', async (req, res, next) => {
  const checkinDate = req.query.checkinDate.toString(),
        checkoutDate = req.query.checkoutDate.toString();
  const room = await Room.find()
  const bookings = await Booking.find({
    $or: [
      {checkIn: {$gte: new Date(checkinDate), $lte: new Date(checkoutDate)}},
      {checkOut: {$gte: new Date(checkinDate), $lte: new Date(checkoutDate)}}
    ]
  });
  const roomsBooked: any = {};
  bookings.forEach(booking => {
    logger.info(JSON.stringify(booking))
    if (typeof roomsBooked[booking.roomId] !== 'undefined') {
      roomsBooked[booking.roomId] = roomsBooked[booking.roomId] + booking.noOfBookedRoom;
    } else {
      roomsBooked[booking.roomId] = booking.noOfBookedRoom;
    }
  });
  logger.info(JSON.stringify(roomsBooked));
  const roomAvailable: any[] = [];
  room.forEach(r => {
    logger.info(r.noOfRooms + " --- " + roomsBooked[r.id])
    if (r.noOfRooms > (roomsBooked[r.id] || 0)) {
      roomAvailable.push(Object.assign({}, r.toJSON(), {noOfAvaibleRoom: (+ r.noOfRooms) - (roomsBooked[r.id] || 0)}));
    }
  })
  res.json({
    status: 'ok',
    rooms: roomAvailable
  })
});

router.get('/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id })
    if (!room) throw new ApiError(httpStatus.NOT_FOUND, 'room not found')
    res.json(room)
  } catch (e) {
    next(e)
  }
})

export default router
