import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import RoomsList from '../components/RoomsList'
import RefreshSpinner from '../components/RefreshSpinner'

const RoomsPage = () => (
	<main>
		<Helmet>
			<title>Booking Manager | Rooms</title>
		</Helmet>

		<Menubar title="Booking Manager" />

		<RoomsList />
		<RefreshSpinner top={72} />
	</main>
)

export default RoomsPage
