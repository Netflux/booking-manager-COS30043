import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'

const NotFoundPage = () => (
	<main>
		<Helmet>
			<title>Booking Manager | Not Found</title>
		</Helmet>

		<Menubar title="Booking Manager" />

		<section>
			<h1>Not Found Page</h1>
		</section>
	</main>
)

export default NotFoundPage;
