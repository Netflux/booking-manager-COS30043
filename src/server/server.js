import Express from 'express'

import './database/db'
import serverAuth from './serverAuth'
import serverRoutes from './serverRoutes'

// Create a new instance of the Express application
const app = Express()
const port = process.env.PORT || 3000

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
