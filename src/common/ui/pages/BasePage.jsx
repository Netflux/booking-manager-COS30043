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

const mapDispatchToProps = dispatch => ({})

// Define the Base Page component
const BasePageComponent = ({children, isOpen, isDocked}) => (
	<div id="content" className={isOpen && isDocked ? "content-offset" : ""}>
		<Helmet
			htmlAttributes={{"lang": "en"}}
			link={[
				{rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css"},
				{rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/flexboxgrid/6.3.1/flexboxgrid.min.css"},
				{rel: "stylesheet", href: "https://fonts.googleapis.com/icon?family=Roboto|Material+Icons"},
				{rel: "stylesheet", href: "/static/style.css"},
				{rel: "stylesheet", href: "/static/style-mobile.css"}
			]}
		/>

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

// Define the container for the Base Page component (maps state and dispatchers)
const BasePage = connect(mapStateToProps, mapDispatchToProps)(BasePageComponent)

export default BasePage
