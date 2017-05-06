import Express from 'express'
import Helmet from 'helmet'
import bodyParser from 'body-parser'
import ExpressValidator from 'express-validator'

import './database/db'
import serverAuth from './serverAuth'
import serverRoutes from './serverRoutes'

// Create a new instance of the Express application
const app = Express()
const port = process.env.PORT || 3000

// Enable Helmet middleware to set security-related HTTP headers
app.use(Helmet())

// Enable parsing for application/x-www-form-urlencoded and application/json data
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Enable Express Validator for input validation/sanitization
app.use(ExpressValidator({
	customValidators: {
		isString: value => typeof(value) === 'string'
	}
}))

// Load the authentication settings for the Express application
serverAuth(app)

// Load the routes for the Express application
serverRoutes(app)

// Start the Express application on the specified port
app.listen(port, (error) => {
	if (error) {
		console.error(error)
	} else {
		console.log(`Booking Manager listening on port ${port}.`)
	}
})
