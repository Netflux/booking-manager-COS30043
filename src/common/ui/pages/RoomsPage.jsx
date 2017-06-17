import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import RoomsList from '../components/RoomsList'
import RefreshSpinner from '../components/RefreshSpinner'

const RoomsPage = () => (
	<main>
		<Helmet>
			<title>SSSC Booking Manager | Rooms</title>
		</Helmet>

		<Menubar title="SSSC Booking Manager" />

		<RoomsList />
		<RefreshSpinner top={72} />
	</main>
)

export default RoomsPage
