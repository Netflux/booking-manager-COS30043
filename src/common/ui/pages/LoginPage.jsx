import React from 'react'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'
import LoginForm from '../components/LoginForm'

const LoginPage = () => (
	<main>
		<Helmet
			title="Booking Manager | Login"
		/>

		<Menubar title="Login" />

		<section className="row center-xs">
			<LoginForm />
		</section>
	</main>
)

export default LoginPage
