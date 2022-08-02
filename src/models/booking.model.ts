import { Schema, Document, model } from 'mongoose'

export interface IBooking {
  roomId: string
  userId: string
  bookingDate: Date
  checkIn: Date
  checkOut: Date
  noOfBookedRoom: number
  specialRequest: string
  totalBillAmmount: number
  ammountPaid: number
  balanceRemaining: number
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
    },
    totalBillAmmount: {
        type: Number,
        required: true
    },
    ammountPaid: {
        type: Number,
        required: true
    },
    balanceRemaining: {
        type: Number,
        required: true
    },
  },
  {
    timestamps: true,
  },
)

export const Booking = model<IBookingModel>('Booking', schema)
