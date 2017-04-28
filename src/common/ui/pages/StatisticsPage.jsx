import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import StatisticsList from '../components/StatisticsList'

const StatisticsPage = () => (
	<main>
		<Helmet>
			<title>Booking Manager | Statistics</title>
		</Helmet>

		<Menubar title="Booking Manager" />

		<StatisticsList />
	</main>
)

export default StatisticsPage
