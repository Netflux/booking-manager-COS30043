import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import AccountsList from '../components/AccountsList'

const AccountsPage = () => (
	<main>
		<Helmet>
			<title>Booking Manager | Accounts</title>
		</Helmet>

		<Menubar title="Booking Manager" />

		<AccountsList />
	</main>
)

export default AccountsPage
