import path from 'path'
import React from 'react'
import Helmet from 'react-helmet'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'
import moment from 'moment'
import Mongoose from 'mongoose'
import Passport from 'passport'
import Bcrypt from 'bcrypt'

import theme from '../common/ui/theme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import configureStore from '../common/store/configureStore'
import routes from '../common/routes'
import { UserModel, BookingModel, RoomModel } from './database/models'

// Helper function to generate the base HTML including the React application
const renderPage = (html, defaultState) => {
	const head = Helmet.rewind()

	return `
		<!DOCTYPE html>
		<html ${head.htmlAttributes.toString()}>
			<head>
				${head.title.toString()}
				${head.base.toString()}
				${head.meta.toString()}
				${head.link.toString()}
				${head.script.toString()}
				<noscript><link rel="stylesheet" href="/static/style-nojs.css" /></noscript>
			</head>

			<body>
				<input id="menu" type="checkbox" hidden />
				<div id="app">${html}</div>

				<script>window.__DEFAULT_STATE__ = ${JSON.stringify(defaultState).replace(/</g, '\\x3c')}</script>
				<script src="/static/js/bundle.js"></script>
			</body>
		</html>
	`
}

// Define routes for the server
const serverRoutes = app => {
	// Inject the tap event plugin to enable usage of onTouchTap
	// More information: http://stackoverflow.com/a/34015469/988941
	injectTapEventPlugin()

	// Helper function to check whether Mongoose has an open connection
	const hasDBConnection = () => (Mongoose.connection.readyState === 1)

	app.post('/api/login', (req, res) => {
		if (!hasDBConnection()) {
			return res.json({ success: false, error: 'An error occured when logging in' })
		}

		// Input Validation
		req.checkBody('username', 'Invalid username').notEmpty().isString()
		req.checkBody('password', 'Invalid password').notEmpty().isString()

		// Get the result of input validation
		req.getValidationResult().then(result => {
			if (!result.isEmpty()) {
				return res.json({ success: false, error: 'An error occured when logging in' })
			}

			// Input Sanitization
			req.sanitizeBody('username').escape()
			req.sanitizeBody('password').escape()

			Passport.authenticate('local', (err, user, info) => {
				if (err) {
					console.error(err)
					return res.json({ success: false, error: 'An error occured when logging in' })
				}
				if (!user) { return res.json({ success: false, error: info.message }) }

				req.login(user, err => {
					if (err) {
						console.error(err)
						return res.json({ success: false, error: 'An error occured when logging in' })
					}
					return res.json({ success: true, authLevel: user.authLevel, error: '' })
				})
			})(req, res)
		})
	})

	app.get('/api/logout', (req, res) => {
		req.logout()
		res.sendStatus(200)
	})

	// Fallback login/logout routes for non-JS users
	app.post('/login', (req, res) => {
		if (!hasDBConnection()) {
			req.session.loginError = 'An error occured when logging in'
			return res.redirect('/login')
		}

		// Input Validation
		req.checkBody('username', 'Invalid username').notEmpty().isString()
		req.checkBody('password', 'Invalid password').notEmpty().isString()

		// Get the result of input validation
		req.getValidationResult().then(result => {
			if (!result.isEmpty()) {
				req.session.loginError = 'An error occured when logging in'
				return res.redirect('/login')
			}

			// Input Sanitization
			req.sanitizeBody('username').escape()
			req.sanitizeBody('password').escape()

			Passport.authenticate('local', (err, user, info) => {
				if (err) {
					console.error(err)
					req.session.loginError = 'An error occured when logging in'
					return res.redirect('/login')
				}
				if (!user) {
					req.session.loginError = info.message
					return res.redirect('/login')
				}

				req.login(user, err => {
					if (err) {
						console.error(err)
						req.session.loginError = 'An error occured when logging in'
						return res.redirect('/login')
					}
					return res.redirect('/')
				})
			})(req, res)
		})
	})
	app.get('/logout', (req, res) => {
		req.logout()
		res.redirect('/')
	})

	app.get('/api/bookings/:year/:month/:day', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}

		// Input Validation
		req.checkParams('year', 'Invalid year').notEmpty().isString()
		req.checkParams('month', 'Invalid month').notEmpty().isString()
		req.checkParams('day', 'Invalid day').notEmpty().isString()

		// Get the result of input validation
		req.getValidationResult().then(result => {
			if (!result.isEmpty()) {
				return res.sendStatus(400)
			}

			// Input Sanitization
			req.sanitizeParams('year').escape()
			req.sanitizeParams('month').escape()
			req.sanitizeParams('day').escape()

			// If logged in, include the created/updated dates
			const selectColumns = req.user ? (
				'bookingId bookingTitle bookingDesc roomId date timeSlot duration createdBy createdDate updatedBy updatedDate'
			) : (
				'bookingId bookingTitle bookingDesc roomId date timeSlot duration'
			)

			BookingModel.find({ date: `${req.params.day}/${req.params.month}/${req.params.year}` })
				.select(selectColumns)
				.exec((err, bookings) => {
					if (err) {
						console.error(err)
						return res.sendStatus(500)
					}

					return res.json(bookings)
				})
		})
	})

	app.all('/api/bookings/:bookingId', (req, res, next) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}
		if (!req.user) {
			return res.sendStatus(403)
		}

		// Input Validation
		req.checkParams('bookingId', 'Invalid booking ID').notEmpty().isString()

		// Get the result of input validation
		req.getValidationResult().then(result => {
			if (!result.isEmpty()) {
				return res.sendStatus(400)
			}

			// Input Sanitization
			req.sanitizeParams('bookingId').escape()

			const bookingId = req.params.bookingId

			switch (req.method) {
			case 'PUT':
				{
					if (!req.body) {
						return res.sendStatus(400)
					}

					// Input Validation
					req.checkBody('bookingId', 'Invalid booking ID').notEmpty().isString()
					req.checkBody('bookingTitle', 'Invalid booking title').notEmpty().isString()
					req.checkBody('bookingDesc', 'Invalid booking description').isString()
					req.checkBody('roomId', 'Invalid room ID').notEmpty().isString()
					req.checkBody('date', 'Invalid date').notEmpty().isString()
					req.checkBody('timeSlot', 'Invalid time slot').notEmpty().isInt()
					req.checkBody('duration', 'Invalid duration').notEmpty().isInt()

					// Get the result of input validation
					req.getValidationResult().then(result => {
						if (!result.isEmpty()) {
							return res.sendStatus(400)
						}

						// Input Sanitization
						req.sanitizeBody('bookingId').escape()
						req.sanitizeBody('bookingTitle').escape()
						req.sanitizeBody('bookingDesc').escape()
						req.sanitizeBody('roomId').escape()
						req.sanitizeBody('date').escape()
						req.sanitizeBody('timeSlot').toInt()
						req.sanitizeBody('duration').toInt()

						// Restore any slashes '/' in the date
						req.body.date = req.body.date.replace(/&#x2F;/g, '/')

						const body = {
							...req.body,
							updatedBy: req.user.userId,
							updatedDate: moment().format('D/M/YYYY')
						}

						BookingModel.findOneAndUpdate({ bookingId }, body, (err) => {
							if (err) {
								console.error(err)
								return res.sendStatus(500)
							}

							return res.sendStatus(200)
						})
					})
					break
				}
			case 'DELETE':
				BookingModel.remove({ bookingId }, (err) => {
					if (err) {
						console.error(err)
						return res.sendStatus(500)
					}

					return res.sendStatus(200)
				})
				break
			default:
				next() // Route does not handle other request types
				break
			}
		})
	})

	app.post('/api/bookings', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}
		if (!req.user) {
			return res.sendStatus(403)
		}
		if (!req.body) {
			return res.sendStatus(400)
		}

		// Input Validation
		req.checkBody('bookingId', 'Invalid booking ID').notEmpty().isString()
		req.checkBody('bookingTitle', 'Invalid booking title').notEmpty().isString()
		req.checkBody('bookingDesc', 'Invalid booking description').isString()
		req.checkBody('roomId', 'Invalid room ID').notEmpty().isString()
		req.checkBody('date', 'Invalid date').notEmpty().isString()
		req.checkBody('timeSlot', 'Invalid time slot').notEmpty().isInt()
		req.checkBody('duration', 'Invalid duration').notEmpty().isInt()

		// Get the result of input validation
		req.getValidationResult().then(result => {
			if (!result.isEmpty()) {
				return res.sendStatus(400)
			}

			// Input Sanitization
			req.sanitizeBody('bookingId').escape()
			req.sanitizeBody('bookingTitle').escape()
			req.sanitizeBody('bookingDesc').escape()
			req.sanitizeBody('roomId').escape()
			req.sanitizeBody('date').escape()
			req.sanitizeBody('timeSlot').toInt()
			req.sanitizeBody('duration').toInt()

			// Restore any slashes '/' in the date
			req.body.date = req.body.date.replace(/&#x2F;/g, '/')

			// Retrieve stored bookings for the specified date and check for any overlaps with the new booking entry
			BookingModel.find({ date: req.body.date }, (err, bookings) => {
				if (err) {
					console.error(err)
					return res.sendStatus(500)
				}

				// Check whether any bookings overlap with the new booking entry
				const hasOverlap = bookings.filter((booking) => booking.roomId === req.body.roomId).some((booking) => {
					return booking.timeSlot <= req.body.timeSlot + (req.body.duration - 1) && req.body.timeSlot <= booking.timeSlot + (booking.duration - 1)
				})

				if (hasOverlap) {
					return res.sendStatus(400)
				}

				const body = {
					...req.body,
					createdBy: req.user.userId,
					createdDate: moment().format('D/M/YYYY'),
					updatedBy: req.user.userId,
					updatedDate: moment().format('D/M/YYYY')
				}

				BookingModel.create(body, (err) => {
					if (err) {
						console.error(err)
						return res.sendStatus(500)
					}

					return res.sendStatus(201)
				})
			})
		})
	})

	app.get('/api/bookings', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}

		// If logged in, include the created/updated dates
		const selectColumns = req.user ? (
			'bookingId bookingTitle bookingDesc roomId date timeSlot duration createdBy createdDate updatedBy updatedDate'
		) : (
			'bookingId bookingTitle bookingDesc roomId date timeSlot duration'
		)

		BookingModel.find()
			.select(selectColumns)
			.exec((err, bookings) => {
				if (err) {
					console.error(err)
					return res.sendStatus(500)
				}

				return res.json(bookings)
			})
	})

	app.all('/api/rooms/:roomId', (req, res, next) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}
		if (!req.user) {
			return res.sendStatus(403)
		}

		// Input Validation
		req.checkParams('roomId', 'Invalid room ID').notEmpty().isString()

		// Get the result of input validation
		req.getValidationResult().then(result => {
			if (!result.isEmpty()) {
				return res.sendStatus(400)
			}

			// Input Sanitization
			req.sanitizeParams('roomId').escape()

			const roomId = req.params.roomId

			switch (req.method) {
			case 'PUT':
				{
					if (!req.body) {
						return res.sendStatus(400)
					}

					// Input Validation
					req.checkBody('roomId', 'Invalid room ID').notEmpty().isString()
					req.checkBody('roomName', 'Invalid room name').notEmpty().isString()
					req.checkBody('roomDesc', 'Invalid room description').isString()
					req.checkBody('isAvailable', 'Invalid room availability').notEmpty().isBoolean()

					// Get the result of input validation
					req.getValidationResult().then(result => {
						if (!result.isEmpty()) {
							return res.sendStatus(400)
						}

						// Input Sanitization
						req.sanitizeBody('roomId').escape()
						req.sanitizeBody('roomName').escape()
						req.sanitizeBody('roomDesc').escape()
						req.sanitizeBody('isAvailable').toBoolean()

						const body = {
							...req.body,
							updatedBy: req.user.userId,
							updatedDate: moment().format('D/M/YYYY')
						}

						RoomModel.findOneAndUpdate({ roomId }, body, (err) => {
							if (err) {
								console.error(err)
								return res.sendStatus(500)
							}

							return res.sendStatus(200)
						})
					})
					break
				}
			case 'DELETE':
				RoomModel.remove({ roomId }, (err) => {
					if (err) {
						console.error(err)
						return res.sendStatus(500)
					}

					BookingModel.remove({ roomId }, (err) => {
						if (err) {
							console.error(err)
							return res.sendStatus(500)
						}

						return res.sendStatus(200)
					})
				})
				break
			default:
				next() // Route does not handle other request types
				break
			}
		})
	})

	app.post('/api/rooms', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}
		if (!req.user) {
			return res.sendStatus(403)
		}
		if (!req.body) {
			return res.sendStatus(400)
		}

		// Input Validation
		req.checkBody('roomId', 'Invalid room ID').notEmpty().isString()
		req.checkBody('roomName', 'Invalid room name').notEmpty().isString()
		req.checkBody('roomDesc', 'Invalid room description').isString()
		req.checkBody('isAvailable', 'Invalid room availability').notEmpty().isBoolean()

		// Get the result of input validation
		req.getValidationResult().then(result => {
			if (!result.isEmpty()) {
				return res.sendStatus(400)
			}

			// Input Sanitization
			req.sanitizeBody('roomId').escape()
			req.sanitizeBody('roomName').escape()
			req.sanitizeBody('roomDesc').escape()
			req.sanitizeBody('isAvailable').toBoolean()

			const body = {
				...req.body,
				createdBy: req.user.userId,
				createdDate: moment().format('D/M/YYYY'),
				updatedBy: req.user.userId,
				updatedDate: moment().format('D/M/YYYY')
			}

			RoomModel.create(body, (err) => {
				if (err) {
					console.error(err)
					return res.sendStatus(500)
				}

				return res.sendStatus(201)
			})
		})
	})

	app.get('/api/rooms', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}

		// If logged in, include the created/updated dates
		const selectColumns = req.user ? (
			'roomId roomName roomDesc isAvailable createdBy createdDate updatedBy updatedDate'
		) : (
			'roomId roomName roomDesc isAvailable'
		)

		RoomModel.find()
			.select(selectColumns)
			.exec((err, rooms) => {
				if (err) {
					console.error(err)
					return res.sendStatus(500)
				}

				return res.json(rooms)
			})
	})

	app.all('/api/accounts/:userId', (req, res, next) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}
		if (!req.user) {
			return res.sendStatus(403)
		}

		// Input Validation
		req.checkParams('userId', 'Invalid user ID').notEmpty().isString()

		// Get the result of input validation
		req.getValidationResult().then(result => {
			if (!result.isEmpty()) {
				return res.sendStatus(400)
			}

			// Input Sanitization
			req.sanitizeParams('userId').escape()

			const userId = req.params.userId

			switch (req.method) {
			case 'PUT':
				if (!req.body) {
					return res.sendStatus(400)
				}

				// Input Validation
				req.checkBody('userId', 'Invalid user ID').notEmpty().isString()
				req.checkBody('password', 'Invalid password').notEmpty().isString()
				req.checkBody('authLevel', 'Invalid authentication level').notEmpty().isInt()

				// Get the result of input validation
				req.getValidationResult().then(result => {
					if (!result.isEmpty()) {
						return res.sendStatus(400)
					}

					// Input Sanitization
					req.sanitizeBody('userId').escape()
					req.sanitizeBody('password').escape()
					req.sanitizeBody('authLevel').toInt()

					if (req.body.authLevel > req.user.authLevel) {
						return res.sendStatus(400)
					}

					// Hash the password of the user
					Bcrypt.hash(req.body.password, 12, (err, hash) => {
						if (err) {
							console.error(err)
							return res.sendStatus(500)
						}

						const body = {
							userId: req.body.userId,
							password: hash,
							authLevel: req.body.authLevel
						}

						UserModel.findOneAndUpdate({ userId }, body, (err) => {
							if (err) {
								console.error(err)
								return res.sendStatus(500)
							}

							return res.sendStatus(200)
						})
					})
				})
				break
			case 'DELETE':
				UserModel.remove({ userId }, (err) => {
					if (err) {
						console.error(err)
						return res.sendStatus(500)
					}

					return res.sendStatus(200)
				})
				break
			default:
				next() // Route does not handle other request types
				break
			}
		})
	})

	app.post('/api/accounts', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}
		if (!req.user) {
			return res.sendStatus(403)
		}
		if (!req.body) {
			return res.sendStatus(400)
		}

		// Input Validation
		req.checkBody('userId', 'Invalid user ID').notEmpty().isString()
		req.checkBody('username', 'Invalid username').notEmpty().isString()
		req.checkBody('password', 'Invalid password').notEmpty().isString()
		req.checkBody('authLevel', 'Invalid authentication level').notEmpty().isInt()

		// Get the result of input validation
		req.getValidationResult().then(result => {
			if (!result.isEmpty()) {
				return res.sendStatus(400)
			}

			// Input Sanitization
			req.sanitizeBody('userId').escape()
			req.sanitizeBody('username').escape()
			req.sanitizeBody('password').escape()
			req.sanitizeBody('authLevel').toInt()

			if (req.body.authLevel > req.user.authLevel) {
				return res.sendStatus(400)
			}

			// Hash the password of the user
			Bcrypt.hash(req.body.password, 12, (err, hash) => {
				if (err) {
					console.error(err)
					return res.sendStatus(500)
				}

				UserModel.create({ ...req.body, password: hash }, (err) => {
					if (err) {
						console.error(err)
						return res.sendStatus(500)
					}

					return res.sendStatus(201)
				})
			})
		})
	})

	app.get('/api/accounts', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}
		if (!req.user) {
			return res.sendStatus(403)
		}

		UserModel.find()
			.select('userId username authLevel')
			.exec((err, users) => {
				if (err) {
					console.error(err)
					return res.sendStatus(500)
				}

				return res.json(users)
			})
	})

	app.get('/api/search', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}

		// Input Validation
		req.checkQuery('q', 'Invalid query').notEmpty()

		// Get the result of input validation
		req.getValidationResult().then(result => {
			if (!result.isEmpty()) {
				return res.sendStatus(400)
			}

			// Input Sanitization
			req.sanitizeQuery('q').escape()

			// Restore any slashes '/' in the search query
			req.query.q = req.query.q.replace(/&#x2F;/g, '/')

			const search = {
				bookings: [],
				rooms: []
			}

			// Convert the search query into a regular expression
			const searchQuery = new RegExp(req.query.q)

			// Define the time slots available for booking (including header)
			const timeSlots = [ '10.30am', '11.30am', '12.30pm', '1.30pm', '2.30pm', '3.30pm', '4.30pm', '5.30pm', '6.30pm', '7.30pm', '8.30pm', '9.30pm', '10.30pm' ]

			// Define the list of time slots that match the search query
			const timeSlotList = []
			for (let i = 0; i < timeSlots.length; ++i) {
				if (timeSlots[i].includes(req.query.q)) {
					timeSlotList.push(i + 1)
				}
			}

			// Define the durations available for booking
			const durations = [ '1 Hour', '2 Hour', '3 Hour' ]

			// Define the list of durations that match the search query
			const durationList = []
			for (let i = 0; i < durations.length; ++i) {
				if (durations[i].includes(req.query.q)) {
					durationList.push(i + 1)
				}
			}

			// If logged in, include the created/updated dates
			const selectBookingColumns = req.user ? (
				'bookingId bookingTitle bookingDesc roomId date timeSlot duration createdBy createdDate updatedBy updatedDate'
			) : (
				'bookingId bookingTitle bookingDesc roomId date timeSlot duration'
			)
			const selectRoomColumns = req.user ? (
				'roomId roomName roomDesc isAvailable createdBy createdDate updatedBy updatedDate'
			) : (
				'roomId roomName roomDesc isAvailable'
			)

			// Search database based on query
			RoomModel.find({
				$or: [
					{ roomId: searchQuery },
					{ roomName: searchQuery },
					{ roomDesc: searchQuery }
				]
			})
			.select(selectRoomColumns)
			.exec()
			.then((rooms) => {
				search.rooms = rooms

				return BookingModel.find({
					$or: [
						{ bookingId: searchQuery },
						{ bookingTitle: searchQuery },
						{ bookingDesc: searchQuery },
						{ roomId: { $in: rooms.map(room => room.roomId) } },
						{ date: searchQuery },
						{ timeSlot: { $in: timeSlotList } },
						{ duration: { $in: durationList } }
					]
				})
				.select(selectBookingColumns)
				.exec()
			})
			.then((bookings) => {
				search.bookings = bookings

				res.json(search)
			})
			.catch(err => {
				console.error(err)
				return res.sendStatus(500)
			})
		})
	})

	app.get('/api/statistics', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}
		if (!req.user) {
			return res.sendStatus(403)
		}

		const dbEntries = {
			bookings: [],
			rooms: []
		}

		const result = {
			bookings: {
				total: 0,
				mostPopular: {
					day: {
						label: '',
						count: 0
					},
					time: {
						label: '',
						count: 0
					},
					duration: {
						label: '',
						count: 0
					}
				},
				thisMonth: {
					labels: [],
					data: []
				},
				byRoom: {
					labels: [],
					data: []
				},
				byMonth: {
					labels: [],
					data: []
				}
			},
			rooms: {
				total: 0,
				available: 0,
				notAvailable: 0,
				mostPopular: {
					label: '',
					count: 0
				}
			}
		}

		// Fetch all bookings and rooms from database
		BookingModel.find()
			.select('bookingId bookingTitle bookingDesc roomId date timeSlot duration')
			.exec()
			.then((bookings) => {
				dbEntries.bookings = bookings

				return RoomModel.find()
					.select('roomId roomName roomDesc isAvailable')
					.exec()
			})
			.then((rooms) => {
				dbEntries.rooms = rooms
			})
			.then(() => {
				// Lookup Tables for room names
				const roomsList = {}

				// List to store statistic counts
				const countList = {
					day: { 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0, 'Sunday': 0 },
					time: { '10.30am': 0, '11.30am': 0, '12.30pm': 0, '1.30pm': 0, '2.30pm': 0, '3.30pm': 0, '4.30pm': 0, '5.30pm': 0, '6.30pm': 0, '7.30pm': 0, '8.30pm': 0, '9.30pm': 0, '10.30pm': 0 },
					duration: { '1': 0, '2': 0, '3': 0 },
					thisMonth: {},
					byRoom: {},
					byMonth: {}
				}

				// Generate statistics for rooms
				for (let room of dbEntries.rooms) {
					if (room.isAvailable) {
						result.rooms.available += 1
					} else {
						result.rooms.notAvailable += 1
					}

					// Populate lookup table with room name
					roomsList[room.roomId] = room.roomName
				}

				// Generate statistics for bookings
				for (let booking of dbEntries.bookings) {
					const bookingDate = moment(booking.date, 'D/M/YYYY')

					// Define the time slots available for booking (including header)
					const timeSlots = [ 'Time', '10.30am', '11.30am', '12.30pm', '1.30pm', '2.30pm', '3.30pm', '4.30pm', '5.30pm', '6.30pm', '7.30pm', '8.30pm', '9.30pm', '10.30pm' ]

					// Define the days available for booking
					const bookingDays = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ]

					// Increment the count for days, timeslot, duration and month with an associated booking
					countList.day[bookingDays[bookingDate.isoWeekday() - 1]] += 1
					countList.time[timeSlots[booking.timeSlot]] += 1
					countList.duration[booking.duration] += 1
					countList.byMonth[bookingDate.format('MMMM')] ? countList.byMonth[bookingDate.format('MMMM')] += 1 : countList.byMonth[bookingDate.format('MMMM')] = 1

					// Increment the count for the current month with an associated booking
					if (moment().month() === bookingDate.month()) {
						countList.thisMonth[bookingDate.date()] ? countList.thisMonth[bookingDate.date()] += 1 : countList.thisMonth[bookingDate.date()] = 1
					}

					// Increment the count for rooms with an associated booking
					countList.byRoom[roomsList[booking.roomId]] ? countList.byRoom[roomsList[booking.roomId]] += 1 : countList.byRoom[roomsList[booking.roomId]] = 1
				}

				// Store the results and send as JSON
				result.rooms.total = dbEntries.rooms.length
				result.bookings.total = dbEntries.bookings.length

				for (let key in countList.day) {
					if (countList.day[key] > result.bookings.mostPopular.day.count) {
						result.bookings.mostPopular.day.label = key
						result.bookings.mostPopular.day.count = countList.day[key]
					}
				}

				for (let key in countList.time) {
					if (countList.time[key] > result.bookings.mostPopular.time.count) {
						result.bookings.mostPopular.time.label = key
						result.bookings.mostPopular.time.count = countList.time[key]
					}
				}

				for (let key in countList.duration) {
					if (countList.duration[key] > result.bookings.mostPopular.duration.count) {
						result.bookings.mostPopular.duration.label = key
						result.bookings.mostPopular.duration.count = countList.duration[key]
					}
				}

				for (let key in countList.thisMonth) {
					result.bookings.thisMonth.labels.push(key)
					result.bookings.thisMonth.data.push(countList.thisMonth[key])
				}

				for (let key in countList.byRoom) {
					if (countList.byRoom[key] > result.rooms.mostPopular.count) {
						result.rooms.mostPopular.label = key
						result.rooms.mostPopular.count = countList.byRoom[key]
					}

					result.bookings.byRoom.labels.push(key)
					result.bookings.byRoom.data.push(countList.byRoom[key])
				}

				for (let key in countList.byMonth) {
					result.bookings.byMonth.labels.push(key)
					result.bookings.byMonth.data.push(countList.byMonth[key])
				}

				res.json(result)
			})
			.catch(err => {
				console.error(err)
				return res.sendStatus(500)
			})
	})

	app.get('/static/*', (req, res) => {
		// If in production, serve optimized version of the static content
		if (process.env.NODE_ENV === 'production') {
			switch (req.url) {
			case '/static/bundle.js':
				req.url = req.url + '.gz'
				res.set('Content-Encoding', 'gzip')
				res.contentType('js')
				break

			case '/static/style.css':
				req.url = '/static/style.min.css'
				break
			}
		}

		res.sendFile(req.url, { root: path.join(__dirname, '../../') })
	})

	// For any route besides the API, serve the web application
	app.get('/*', (req, res) => {
		match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
			if (error) {
				res.status(500).send(error.message)
			} else if (redirectLocation) {
				res.redirect(302, redirectLocation.pathname + redirectLocation.search)
			} else if (renderProps) {
				// Generate the default state
				const defaultState = {
					bookingsByDate: {},
					rooms: {
						isFetching: false,
						didInvalidate: false,
						items: []
					},
					user: {
						isLoggingIn: false,
						isLoggedIn: req.user ? true : false,
						loginError: req.session.loginError ? req.session.loginError : '',
						authLevel: req.user ? req.user.authLevel : 0
					}
				}

				const sendPage = () => {
					// Create a new Redux store instance
					const store = configureStore(defaultState)

					// Create the default theme (store the user agent when using SSR)
					const muiTheme = getMuiTheme({
						...theme,
						userAgent: req.get('user-agent')
					})

					// Get the React components as a string
					const html = renderToString(
						<Provider store={store}>
							<MuiThemeProvider muiTheme={muiTheme}>
								<RouterContext {...renderProps} />
							</MuiThemeProvider>
						</Provider>
					)

					// Get the current state of the store
					const currentState = store.getState()

					// Send the rendered page to the client
					res.send(renderPage(html, currentState))
				}

				if (hasDBConnection()) {
					// If logged in, include the created/updated dates
					const selectBookingColumns = req.user ? (
						'bookingId bookingTitle bookingDesc roomId date timeSlot duration createdBy createdDate updatedBy updatedDate'
					) : (
						'bookingId bookingTitle bookingDesc roomId date timeSlot duration'
					)
					const selectRoomColumns = req.user ? (
						'roomId roomName roomDesc isAvailable createdBy createdDate updatedBy updatedDate'
					) : (
						'roomId roomName roomDesc isAvailable'
					)

					// Fetch bookings and rooms from database
					BookingModel.find({ date: moment().format('D/M/YYYY') })
						.select(selectBookingColumns)
						.exec()
						.then((bookings) => {
							defaultState.bookingsByDate[moment().format('D/M/YYYY')] = {
								isFetching: false,
								didInvalidate: false,
								items: bookings
							}

							return RoomModel.find()
								.select(selectRoomColumns)
								.exec()
						})
						.then((rooms) => {
							defaultState.rooms.items = rooms
						})
						.then(sendPage)
						.catch(err => {
							console.error(err)
							return res.sendStatus(500)
						})
				} else {
					sendPage()
				}
			} else {
				res.status(404).send('Error 404: Not found')
			}
		})
	})
}

export default serverRoutes
