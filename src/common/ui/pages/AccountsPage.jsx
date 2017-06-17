import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import AccountsList from '../components/AccountsList'
import RefreshSpinner from '../components/RefreshSpinner'

const AccountsPage = () => (
	<main>
		<Helmet>
			<title>SSSC Booking Manager | Accounts</title>
		</Helmet>

		<Menubar title="SSSC Booking Manager" />

		<AccountsList />
		<RefreshSpinner top={72} />
	</main>
)

export default AccountsPage
