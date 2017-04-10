import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import SideDrawer from '../components/SideDrawer'

const mapStateToProps = state => {
	return {
		isOpen: state.sideDrawerState.isOpen,
		isDocked: state.sideDrawerState.isDocked
	}
}

// Define the Base Page component
const BasePageComponent = ({ children, isOpen, isDocked }) => (
	<div id="content" className={isOpen && isDocked ? "content-offset" : ""}>
		<Helmet>
			<html lang="en" />
			<meta name="viewport" content="width=device-width" />
			<meta charSet="utf-8" />

			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" />
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flexboxgrid/6.3.1/flexboxgrid.min.css" />
			<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
			<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
			<link rel="stylesheet" href="/static/style.css" />
		</Helmet>

		{children}

		<SideDrawer />
	</div>
)

// Define the property types that the component expects to receive
BasePageComponent.propTypes = {
	children: PropTypes.object.isRequired,
	isOpen: PropTypes.bool.isRequired,
	isDocked: PropTypes.bool.isRequired
}

// Define the container for the Base Page component (maps state)
const BasePage = connect(mapStateToProps)(BasePageComponent)

export default BasePage
