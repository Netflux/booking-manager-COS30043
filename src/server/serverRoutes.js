import path from 'path'
import React from 'react'
import Helmet from 'react-helmet'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

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
			</head>

			<body>
				<div id="app">${html}</div>

				<script>window.__DEFAULT_STATE__ = ${JSON.stringify(defaultState).replace(/</g, '\\x3c')}</script>
				<script src="/static/bundle.js"></script>
			</body>
		</html>
	`
}

// Define routes for the server
const serverRoutes = app => {
	app.get('/api/bookings/:date', (req, res) => {
		res.sendStatus(403)
	})

	app.get('/api/bookings', (req, res) => {
		res.sendStatus(403)
	})

	app.post('/api/login', (req, res) => {
		res.sendStatus(403)
	})

	app.get('/static/*', (req, res) => {
		res.sendFile(req.originalUrl, { root: path.join(__dirname, '../../') })
	})

	// For any route besides the API, serve the web application
	app.get('/*', (req, res) => {
		match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
			if (error) {
				res.status(500).send(error.message)
			} else if (redirectLocation) {
				res.redirect(302, redirectLocation.pathname + redirectLocation.search)
			} else if (renderProps) {
				// Inject the tap event plugin to enable usage of onTouchTap
				// More information: http://stackoverflow.com/a/34015469/988941
				injectTapEventPlugin()

				// Generate the default state
				const defaultState = {}

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
