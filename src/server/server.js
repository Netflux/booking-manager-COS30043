import Express from 'express'
import serverRoutes from './serverRoutes'

// Create a new instance of the Express application
const app = Express()
const port = 3000

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
