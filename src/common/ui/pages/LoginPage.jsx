import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import LoginForm from '../components/LoginForm'

const LoginPage = () => (
	<main>
		<Helmet>
			<title>SSSC Booking Manager | Login</title>
		</Helmet>

		<Menubar title="SSSC Booking Manager" />

		<LoginForm />
	</main>
)

export default LoginPage
