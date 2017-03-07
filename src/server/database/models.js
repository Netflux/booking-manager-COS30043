import Mongoose from 'mongoose'
import { userSchema, roomSchema, bookingSchema } from './schemas'

// Create document models based on the schemas
const UserModel = Mongoose.model('User', userSchema)
const RoomModel = Mongoose.model('Room', roomSchema)
const BookingModel = Mongoose.model('Booking', bookingSchema)

export { UserModel, RoomModel, BookingModel }
