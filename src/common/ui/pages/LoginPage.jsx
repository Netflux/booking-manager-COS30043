import React from 'react'
import { Link, IndexLink } from 'react-router'
import Helmet from 'react-helmet'

export default class LoginPage extends React.Component {
	render() {
		return (
			<main>
				<Helmet
					title="Booking Manager | Login"
				/>

				<section>
					<form>
						<p><label htmlFor="email">Email Address</label></p>
						<p><input id="email" type="text" /></p>
						<p><label htmlFor="password">Password</label></p>
						<p><input id="password" type="password" /></p>

						<input type="submit" value="Log In" />
					</form>
				</section>
			</main>
		)
	}
}
