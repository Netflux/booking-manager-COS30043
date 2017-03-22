import Mongoose from 'mongoose'
import { userSchema, bookingSchema, roomSchema } from './schemas'

// Create document models based on the schemas
const UserModel = Mongoose.model('User', userSchema)
const BookingModel = Mongoose.model('Booking', bookingSchema)
const RoomModel = Mongoose.model('Room', roomSchema)

export { UserModel, BookingModel, RoomModel }
