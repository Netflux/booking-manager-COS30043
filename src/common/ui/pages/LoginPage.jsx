import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import LoginForm from '../components/LoginForm'

const LoginPage = () => (
	<main>
		<Helmet>
			<title>Booking Manager | Login</title>
		</Helmet>

		<Menubar title="Booking Manager | Login" />

		<section className="row center-xs">
			<LoginForm />
		</section>
	</main>
)

export default LoginPage
