import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'

// Import the main components
import BasePage from '../common/ui/pages/BasePage'
import HomePage from '../common/ui/pages/HomePage'
import AboutPage from '../common/ui/pages/AboutPage'
import RoomsPage from '../common/ui/pages/RoomsPage'
import LoginPage from '../common/ui/pages/LoginPage'
import NotFoundPage from '../common/ui/pages/NotFoundPage'

// Define routes for the application
const routes = (
	<Route path="/" component={BasePage}>
		<IndexRoute component={HomePage} />
		<Route path="/about" component={AboutPage} />
		<Route path="/rooms" component={RoomsPage} />
		<Route path="/login" component={LoginPage} />

		{/* Fallback route for undefined routes */}
		<Route path="*" component={NotFoundPage} />
	</Route>
)

export default routes
