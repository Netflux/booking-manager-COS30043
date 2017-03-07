import Express from 'express'
import Session from 'express-session'
import Mongoose from 'mongoose'
import Passport from 'passport'
import LocalStrategy from 'passport-local'
import Validator from 'validator'
import Bcrypt from 'bcrypt'
import Crypto from 'crypto'

import { UserModel } from './database/models'

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

	// Set up the LocalStrategy for logging in through the login form
	Passport.use(new LocalStrategy((username, password, done) => {
		const usernameEscaped = Validator.escape(username)
		const passwordEscaped = Validator.escape(password)

		findUserByUsername(usernameEscaped, (err, user) => {
			if (err) { return done(err) }
			if (!user) { return done(null, false, { message: 'Invalid username or password' }) }
			Bcrypt.compare(passwordEscaped, user.password, (err, res) => {
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
		secret: 'booking-manager'
	}))
	app.use(Passport.initialize())
	app.use(Passport.session())
}

export default serverAuth
