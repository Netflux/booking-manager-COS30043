import React from 'react'
import { IndexLink } from 'react-router'
import Helmet from 'react-helmet'

const NotFoundPage = () => (
	<main>
		<Helmet
			title={"Booking Manager | Not Found"}
		/>

		<section>
			<h1>Not Found Page</h1>
		</section>
	</main>
)

export default NotFoundPage;
