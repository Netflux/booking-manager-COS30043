import Mongoose, { Schema } from 'mongoose'

// Schema for the User details
const userSchema = new Schema({
	userId: String,
	username: String,
	password: String,
	authLevel: Number
})

// Schema for the Room details
const roomSchema = new Schema({
	roomId: String,
	roomName: String,
	isAvailable: Boolean,
	bookings: Array
})

// Schema for the Booking details
const bookingSchema = new Schema({
	userId: [String],
	date: Date,
	duration: Number
})

export { userSchema, roomSchema, bookingSchema }
