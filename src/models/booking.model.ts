import { Schema, Document, model } from 'mongoose'

export interface IBooking {
  roomId: string
  userId: string
  bookingDate: Date
  checkIn: Date
  checkOut: Date
  noOfBookedRoom: Number
  specialRequest: string
}

export default interface IBookingModel extends Document, IBooking {}

const schema = new Schema(
  {
    roomId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    checkIn: {
      type: Date,
      required: true
    },
    checkOut: {
      type: Date,
      required: true
    },
    noOfBookedRoom: {
        type: Number,
        required: true
    },
    specialRequest: {
        type: String,
        required: false
    }
  },
  {
    timestamps: true,
  },
)

export const Booking = model<IBookingModel>('Booking', schema)
