import React from 'react'
import Helmet from 'react-helmet'

import { Drawer } from 'material-ui'

export default class BasePage extends React.Component {
	render() {
		return (
			<div id="content">
				<Helmet
					htmlAttributes={{"lang": "en"}}
				/>

				{this.props.children}


			</div>
		)
	}
}
