import React from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { Paper } from 'material-ui'

import Menubar from '../components/Menubar'

const NotFoundPage = () => (
	<main>
		<Helmet>
			<title>SSSC Booking Manager | Not Found</title>
		</Helmet>

		<Menubar title="Booking Manager" />

		<section>
			<Paper className="paper text-center">
				<h1>Error 404 - Page not found!</h1>
				<p><Link to="/" className="text-color-dark">Lost? Click here to return home.</Link></p>
			</Paper>
		</section>
	</main>
)

export default NotFoundPage
