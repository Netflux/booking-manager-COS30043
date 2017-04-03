import path from 'path'
import React from 'react'
import Helmet from 'react-helmet'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Passport from 'passport'

import theme from '../common/ui/theme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import configureStore from '../common/store/configureStore'
import routes from '../common/routes'

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

	app.post('/api/login', (req, res) => {
		Passport.authenticate('local', (err, user, info) => {
			if (err) {
				console.log(err)
				return res.json({ success: false, error: 'An error occured when logging in' })
			}
			if (!user) { return res.json({ success: false, error: info.message }) }

			req.login(user, err => {
				if (err) {
					console.log(err)
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
		Passport.authenticate('local', (err, user, info) => {
			if (err) {
				console.log(err)
				req.session.loginError = 'An error occured when logging in'
				return res.redirect('/login')
			}
			if (!user) {
				req.session.loginError = info.message
				return res.redirect('/login')
			}

			req.login(user, err => {
				if (err) {
					console.log(err)
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
		res.sendStatus(403)
	})

	app.get('/api/bookings', (req, res) => {
		res.sendStatus(403)
	})

	app.get('/api/rooms', (req, res) => {
		res.sendStatus(403)
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
