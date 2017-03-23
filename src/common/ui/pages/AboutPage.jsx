import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'

const AboutPage = () => (
	<main>
		<Helmet>
			<title>Booking Manager | About</title>
		</Helmet>

		<Menubar title="Booking Manager" />

		<section>
			<h1>About Page</h1>
		</section>
	</main>
)

export default AboutPage
