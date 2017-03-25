import Mongoose, { Schema } from 'mongoose'

// Schema for the User details
const userSchema = new Schema({
	userId: String,
	username: String,
	password: String,
	authLevel: Number
})

// Schema for the Booking details
const bookingSchema = new Schema({
	bookingId: String,
	bookingTitle: String,
	bookingDesc: String,
	userId: String,
	roomId: String,
	date: Date,
	timeSlot: Number,
	duration: Number
})

// Schema for the Room details
const roomSchema = new Schema({
	roomId: String,
	roomName: String,
	roomDesc: String,
	isAvailable: Boolean
})

export { userSchema, bookingSchema, roomSchema }
