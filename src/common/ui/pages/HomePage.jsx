import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import BookingTable from '../components/BookingTable'
import RefreshSpinner from '../components/RefreshSpinner'

const HomePage = () => (
	<main>
		<Helmet>
			<title>Booking Manager | Home</title>
		</Helmet>

		<Menubar title="Booking Manager" />

		<BookingTable />
		<RefreshSpinner top={120} />
	</main>
)

export default HomePage
