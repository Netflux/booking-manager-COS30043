import Express from 'express'
import Session from 'express-session'
import ConnectMDB from 'connect-mongodb-session'
import Mongoose from 'mongoose'
import Passport from 'passport'
import LocalStrategy from 'passport-local'
import Bcrypt from 'bcrypt'

import dbURI from './database/db'
import { UserModel } from './database/models'

// Setup the MongoDB store for sessions
const MongoDBStore = ConnectMDB(Session)
const store = new MongoDBStore({
	uri: dbURI,
	collection: 'sessions'
})
store.on('error', (error) => {
	console.error(`MongoDB Session connection error: ${error}`)
})

// Helper functions for finding users based on ID or username
const findUserById = (id, callback) => {
	return UserModel.findOne({ userId: id }).exec(callback)
}
const findUserByUsername = (username, callback) => {
	return UserModel.findOne({ username: username }).exec(callback)
}

const serverAuth = app => {
	// Allow persistent sessions by providing serialize/deserialize methods for user data
	Passport.serializeUser((user, done) => {
		done(null, user.userId)
	})
	Passport.deserializeUser((id, done) => {
		findUserById(id, (err, user) => {
			done(err, user)
		})
	})

	// Set up the LocalStrategy for login authentication
	Passport.use(new LocalStrategy((username, password, done) => {
		findUserByUsername(username, (err, user) => {
			if (err) { return done(err) }
			if (!user) { return done(null, false, { message: 'Invalid username or password' }) }
			Bcrypt.compare(password, user.password, (err, res) => {
				if (err) { return done(err) }
				if (!res) { return done(null, false, { message: 'Invalid username or password' }) }
				return done(null, user)
			})
		})
	}))

	app.use(Session({
		cookie: {
			maxAge: 604800000 // Persist session cookie for 7 days
		},
		resave: false,
		saveUninitialized: false,
		secret: 'booking-manager',
		store: store
	}))
	app.use(Passport.initialize())
	app.use(Passport.session())
}

export default serverAuth
