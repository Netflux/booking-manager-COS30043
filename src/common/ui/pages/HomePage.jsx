import React from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import BookingTable from '../components/BookingTable'

const HomePage = () => (
	<main>
		<Helmet>
			<title>Booking Manager | Home</title>
		</Helmet>

		<Menubar title="Booking Manager | Home" />

		<BookingTable />
	</main>
)

export default HomePage
