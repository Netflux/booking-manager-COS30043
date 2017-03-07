import Mongoose from 'mongoose'

// Set the connection URI
const dbURI = process.env.DB_URI || 'mongodb://localhost/booking-manager'

// Setup the database connection events
Mongoose.connection.on('connected', () => {
	console.log(`Mongoose connection opened to: ${dbURI}`)
})
Mongoose.connection.on('disconnected', () => {
	console.log(`Mongoose connection closed`)
})
Mongoose.connection.on('error', err => {
	console.log(`Mongoose connection error: ${err}`)
})

// Close the connection when the application terminates
process.on('SIGINT', () => {
	Mongoose.connection.close(() => {
		console.log('Application terminated. Closing the Mongoose connection...')
		process.exit(0)
	})
})

// Start the connection to the database
Mongoose.connect(dbURI)
