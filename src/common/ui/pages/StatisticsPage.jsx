import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import StatisticsList from '../components/StatisticsList'
import RefreshSpinner from '../components/RefreshSpinner'

const StatisticsPage = () => (
	<main>
		<Helmet>
			<title>SSSC Booking Manager | Statistics</title>
		</Helmet>

		<Menubar title="SSSC Booking Manager" />

		<StatisticsList />
		<RefreshSpinner top={72} />
	</main>
)

export default StatisticsPage
