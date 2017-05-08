import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import RoomsList from '../components/RoomsList'

const RoomsPage = () => (
	<main>
		<Helmet>
			<title>SSSC Booking Manager | Rooms</title>
		</Helmet>

		<Menubar title="Booking Manager" />

		<RoomsList />
	</main>
)

export default RoomsPage
