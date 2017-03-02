import React from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'

import Menubar from '../components/Menubar'

export default class HomePage extends React.Component {
	render() {
		return (
			<main>
				<Helmet
					title="Booking Manager | Home"
				/>

				<Menubar />

				<section>
					<h1>Home Page</h1>
				</section>
			</main>
		)
	}
}
