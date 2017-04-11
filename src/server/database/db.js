import Mongoose from 'mongoose'
import Bcrypt from 'bcrypt'

import { UserModel } from './models'

// Set the connection URI
const dbURI = process.env.DB_URI || 'mongodb://localhost/booking-manager'

// Setup the default promises used by Mongoose
Mongoose.Promise = global.Promise

// Setup the database connection events
Mongoose.connection.on('connected', () => {
	console.log(`Mongoose connection opened to: ${dbURI}`)

	// Define the default user
	const user = {
		userId: 'root',
		username: 'root',
		password: '12345',
		authLevel: 100
	}

	// Hash the password of the default user
	Bcrypt.hash(user.password, 12, (err, hash) => {
		if (err) {
			console.error(err)
		}

		// Insert the default user if it does not exist
		UserModel.update(
			{ userId: user.userId },
			{ $setOnInsert: { ...user, password: hash } },
			{ upsert: true },
			(err) => {
				if (err) console.error(err)
			}
		)
	})
})
Mongoose.connection.on('disconnected', () => {
	console.log('Mongoose connection closed')
})
Mongoose.connection.on('error', err => {
	console.error(`Mongoose connection error: ${err}`)
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

export default dbURI
