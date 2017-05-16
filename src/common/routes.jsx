import React from 'react'
import { Route, IndexRoute } from 'react-router'

// Import the main components
import BasePage from '../common/ui/pages/BasePage'
import HomePage from '../common/ui/pages/HomePage'
import AboutPage from '../common/ui/pages/AboutPage'
import RoomsPage from '../common/ui/pages/RoomsPage'
import AccountsPage from '../common/ui/pages/AccountsPage'
import StatisticsPage from '../common/ui/pages/StatisticsPage'
import LoginPage from '../common/ui/pages/LoginPage'
import NotFoundPage from '../common/ui/pages/NotFoundPage'

// Define routes for the application
const routes = (
	<Route path="/" component={BasePage}>
		<IndexRoute component={HomePage} />
		<Route path="/about" component={AboutPage} />
		<Route path="/rooms" component={RoomsPage} />
		<Route path="/accounts" component={AccountsPage} />
		<Route path="/statistics" component={StatisticsPage} />
		<Route path="/login" component={LoginPage} />

		{/* Fallback route for undefined routes */}
		<Route path="*" component={NotFoundPage} />
	</Route>
)

export default routes
