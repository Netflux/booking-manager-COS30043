import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import BookingTable from '../components/BookingTable'

const HomePage = () => (
	<main>
		<Helmet>
			<title>SSSC Booking Manager | Home</title>
		</Helmet>

		<Menubar title="SSSC Booking Manager" />

		<BookingTable />
	</main>
)

export default HomePage
