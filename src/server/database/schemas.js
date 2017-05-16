import { Schema } from 'mongoose'

// Schema for the User details
const userSchema = new Schema({
	userId: {
		type: String,
		unique: true,
		required: [true, 'User ID is required']
	},
	username: {
		type: String,
		unique: true,
		required: [true, 'Username is required']
	},
	password: {
		type: String,
		required: [true, 'Password is required']
	},
	authLevel: {
		type: Number,
		min: 1,
		max: 100,
		required: [true, 'Authentication Level is required']
	}
})

// Schema for the Booking details
const bookingSchema = new Schema({
	bookingId: {
		type: String,
		unique: true,
		required: [true, 'Booking ID is required']
	},
	bookingTitle: {
		type: String,
		required: [true, 'Booking Title is required']
	},
	bookingDesc: String,
	roomId: {
		type: String,
		required: [true, 'Room ID is required']
	},
	date: {
		type: String,
		required: [true, 'Date is required']
	},
	timeSlot: {
		type: Number,
		min: 1,
		max: 13,
		required: [true, 'Time Slot is required']
	},
	duration: {
		type: Number,
		min: 1,
		max: 3,
		required: [true, 'Duration is required']
	},
	createdBy: {
		type: String,
		required: [true, '(Created By) User ID is required']
	},
	createdDate: {
		type: String,
		required: [true, 'Created Date is required']
	},
	updatedBy: {
		type: String,
		required: [true, '(Updated By) User ID is required']
	},
	updatedDate: {
		type: String,
		required: [true, 'Updated Date is required']
	}
})

// Schema for the Room details
const roomSchema = new Schema({
	roomId: {
		type: String,
		unique: true,
		required: [true, 'Room ID is required']
	},
	roomName: {
		type: String,
		unique: true,
		required: [true, 'Room Name is required']
	},
	roomDesc: String,
	isAvailable: {
		type: Boolean,
		required: [true, 'Room Availability is required']
	},
	createdBy: {
		type: String,
		required: [true, '(Created By) User ID is required']
	},
	createdDate: {
		type: String,
		required: [true, 'Created Date is required']
	},
	updatedBy: {
		type: String,
		required: [true, '(Updated By) User ID is required']
	},
	updatedDate: {
		type: String,
		required: [true, 'Updated Date is required']
	}
})

export { userSchema, bookingSchema, roomSchema }
