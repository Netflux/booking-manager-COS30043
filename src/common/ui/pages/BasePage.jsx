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
						{rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css"},
						{rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/flexboxgrid/6.3.1/flexboxgrid.min.css"},
						{rel: "stylesheet", href: "https://fonts.googleapis.com/icon?family=Roboto|Material+Icons"},
						{rel: "stylesheet", href: "/static/style.css"}
					]}
				/>

				{this.props.children}

				<SideDrawer />
			</div>
		)
	}
}
