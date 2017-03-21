import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'

const NotFoundPage = () => (
	<main>
		<Helmet
			title={"Booking Manager | Not Found"}
		/>

		<Menubar title="Booking Manager | Not Found" />

		<section>
			<h1>Not Found Page</h1>
		</section>
	</main>
)

export default NotFoundPage;
