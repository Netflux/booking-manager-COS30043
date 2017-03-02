import React from 'react'
import Helmet from 'react-helmet'

import SideDrawer from '../components/SideDrawer'

export default class BasePage extends React.Component {
	render() {
		return (
			<div id="content">
				<Helmet
					htmlAttributes={{"lang": "en"}}
					link={[
						{rel: "stylesheet", href: "/static/normalize.css"},
					]}
				/>

				{this.props.children}

				<SideDrawer />
			</div>
		)
	}
}
