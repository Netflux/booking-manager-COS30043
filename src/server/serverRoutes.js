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
import Validator from 'validator'

import theme from '../common/ui/theme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import configureStore from '../common/store/configureStore'
import routes from '../common/routes'
import { BookingModel, RoomModel } from './database/models'

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
				<div id="app">
					<input id="menu" type="checkbox" hidden />
					${html}
				</div>

				<script>window.__DEFAULT_STATE__ = ${JSON.stringify(defaultState).replace(/</g, '\\x3c')}</script>
				<script src="/static/bundle.js"></script>
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
	const hasDBConnection = () => (Mongoose.connection.readyState == 1)

	app.post('/api/login', (req, res) => {
		if (!hasDBConnection()) {
			return res.json({ success: false, error: 'An error occured when logging in' })
		}

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
				return res.json({ success: true, error: '' })
			})
		})(req, res)
	})

	app.get('/api/logout', (req, res) => {
		req.logout();
		res.json({ success: true })
	})

	// Fallback login/logout routes for non-JS users
	app.post('/login', (req, res) => {
		if (!hasDBConnection()) {
			req.session.loginError = 'An error occured when logging in'
			return res.redirect('/login')
		}

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
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	})

	app.get('/api/bookings/:year/:month/:day', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}

		BookingModel.find({ date: `${req.params.year}/${req.params.month}/${req.params.day}` })
			.select('bookingId bookingTitle bookingDesc roomId date timeSlot duration')
			.exec((err, bookings) => {
				if (err) {
					console.error(err)
					return res.sendStatus(500)
				}

				return res.json(bookings)
			})
	})

	app.all('/api/bookings/:bookingId', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}
		if (!req.user) {
			return res.sendStatus(401)
		}

		const bookingId = Validator.escape(req.params.bookingId)

		switch (req.method) {
			case 'POST':
				if (req.body) {
					let bodySanitized = {
						bookingId: bookingId,
						bookingTitle: Validator.escape(req.body.bookingTitle),
						bookingDesc: Validator.escape(req.body.bookingDesc),
						roomId: Validator.escape(req.body.roomId),
						date: Validator.escape(req.body.date),
						timeSlot: parseInt(Validator.escape(req.body.timeSlot), 10),
						duration: parseInt(Validator.escape(req.body.duration), 10),
						createdBy: req.user.userId,
						createdDate: moment().format('YYYY/M/D'),
						updatedBy: req.user.userId,
						updatedDate: moment().format('YYYY/M/D')
					}

					BookingModel.create(bodySanitized, (err, booking) => {
						if (err) {
							console.error(err)
							return res.sendStatus(500)
						}

						return res.sendStatus(201)
					})
				}
				break;
			case 'PUT':
				if (req.body) {
					let bodySanitized = {
						bookingTitle: Validator.escape(req.body.bookingTitle),
						bookingDesc: Validator.escape(req.body.bookingDesc),
						roomId: Validator.escape(req.body.roomId),
						date: Validator.escape(req.body.date),
						timeSlot: parseInt(Validator.escape(req.body.timeSlot), 10),
						duration: parseInt(Validator.escape(req.body.duration), 10),
						updatedBy: req.user.userId,
						updatedDate: moment().format('YYYY/M/D')
					}

					BookingModel.findOneAndUpdate({ bookingId }, bodySanitized, (err, booking) => {
						if (err) {
							console.error(err)
							return res.sendStatus(500)
						}

						return res.sendStatus(200)
					})
				}
				break;
			case 'DELETE':
				BookingModel.remove({ bookingId }, (err) => {
					if (err) {
						console.error(err)
						return res.sendStatus(500)
					}

					return res.sendStatus(200)
				})
				break;
			default:
				// Route does not handle other request types
				break;
		}
	})

	app.get('/api/bookings', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}

		BookingModel.find()
			.select('bookingId bookingTitle bookingDesc roomId date timeSlot duration')
			.exec((err, bookings) => {
				if (err) {
					console.error(err)
					return res.sendStatus(500)
				}

				return res.json(bookings)
			})
	})

	app.all('/api/rooms/:roomId', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}
		if (!req.user) {
			return res.sendStatus(401)
		}

		const roomId = Validator.escape(req.params.roomId)

		switch (req.method) {
			case 'POST':
				if (req.body) {
					let bodySanitized = {
						roomId: roomId,
						roomName: Validator.escape(req.body.roomName),
						roomDesc: Validator.escape(req.body.roomDesc),
						isAvailable: req.body.isAvailable,
						createdBy: req.user.userId,
						createdDate: moment().format('YYYY/M/D'),
						updatedBy: req.user.userId,
						updatedDate: moment().format('YYYY/M/D')
					}

					RoomModel.create(bodySanitized, (err, room) => {
						if (err) {
							console.error(err)
							return res.sendStatus(500)
						}

						return res.sendStatus(201)
					})
				}
				break;
			case 'PUT':
				if (req.body) {
					let bodySanitized = {
						roomName: Validator.escape(req.body.roomName),
						roomDesc: Validator.escape(req.body.roomDesc),
						isAvailable: req.body.isAvailable,
						updatedBy: req.user.userId,
						updatedDate: moment().format('YYYY/M/D')
					}

					RoomModel.findOneAndUpdate({ roomId }, bodySanitized, (err, room) => {
						if (err) {
							console.error(err)
							return res.sendStatus(500)
						}

						return res.sendStatus(200)
					})
				}
				break;
			case 'DELETE':
				RoomModel.remove({ roomId }, (err) => {
					if (err) {
						console.error(err)
						return res.sendStatus(500)
					}

					return res.sendStatus(200)
				})
				break;
			default:
				// Route does not handle other request types
				break;
		}
	})

	app.get('/api/rooms', (req, res) => {
		if (!hasDBConnection()) {
			return res.sendStatus(500)
		}

		RoomModel.find()
			.select('roomId roomName roomDesc isAvailable')
			.exec((err, rooms) => {
				if (err) {
					console.error(err)
					return res.sendStatus(500)
				}

				return res.json(rooms)
			})
	})

	app.get('/static/*', (req, res) => {
		// If in production, serve optimized version of the static content
		if (process.env.NODE_ENV === 'production') {
			switch (req.url) {
				case '/static/bundle.js':
					req.url = req.url + '.gz'
					res.set('Content-Encoding', 'gzip')
					break;

				case '/static/style.css':
					req.url = '/static/style.min.css'
					break;
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
					user: {
						isLoggingIn: false,
						isLoggedIn: req.user ? true : false,
						loginError: req.session.loginError ? req.session.loginError : ''
					}
				}

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
			} else {
				res.status(404).send('Error 404: Not found')
			}
		})
	})
}

export default serverRoutes
