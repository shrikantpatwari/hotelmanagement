import { Schema, Document, model } from 'mongoose'

export interface IRoom {
  name: string
  description: string
  images: string[]
  features: string[]
  bathroomAccessories: string[]
  entertainment: string[]
  comforts: string[]
  capacityAdult: number
  capacityChild: number
  noOfRooms: number
  pricePerNight: number
  discountPercentge: number
  customerRating: number
}

export default interface IRoomModel extends Document, IRoom {}

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    images: {
      type: Array<string>,
      required: true,
    },
    features: {
      type: Array<string>,
      required: false
    },
    bathroomAccessories: {
      type: Array<string>,
      required: false
    },
    entertainment: {
      type: Array<string>,
      required: false
    },
    comforts: {
      type: Array<string>,
      required: false
    },
    capacityAdult: {
      type: Number,
      required: true
    },
    capacityChild: {
      type: Number,
      required: true
    },
    noOfRooms: {
      type: Number,
      required: true
    },
    pricePerNight: {
      type: Number,
      required: true
    },
    discountPercentge: {
      type: Number,
      required: false
    },
    customerRating: {
      type: Number,
      required: false
    }
  },
  {
    timestamps: true,
  },
)

export const Room = model<IRoomModel>('Room', schema)
