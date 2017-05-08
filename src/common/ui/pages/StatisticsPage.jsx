import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import StatisticsList from '../components/StatisticsList'

const StatisticsPage = () => (
	<main>
		<Helmet>
			<title>SSSC Booking Manager | Statistics</title>
		</Helmet>

		<Menubar title="SSSC Booking Manager" />

		<StatisticsList />
	</main>
)

export default StatisticsPage
