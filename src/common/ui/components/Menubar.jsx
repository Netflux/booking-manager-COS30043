import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FontIcon, Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui'
import { white } from 'material-ui/styles/colors'

import { toggleDrawerOpen } from '../../actions'

const mapStateToProps = state => {
	return {

	}
}

const mapDispatchToProps = dispatch => {
	return {
		onToggleMenu: () => {
			dispatch(toggleDrawerOpen())
		}
	}
}

// Define the Menubar component
const MenubarComponent = ({title, onToggleMenu}) => (
	<Toolbar>
		<ToolbarGroup>
			<FontIcon className="material-icons menu-icon" onTouchTap={() => onToggleMenu()} color={white} hoverColor={white}>&#8801;</FontIcon>
			<ToolbarTitle text={title} style={{color: white}} />
		</ToolbarGroup>
	</Toolbar>
)

// Define the property types that the component expects to receive
MenubarComponent.propTypes = {
	title: PropTypes.string.isRequired,
	onToggleMenu: PropTypes.func.isRequired
}

// Define the container for the Menubar component (maps state and dispatchers)
const Menubar = connect(mapStateToProps, mapDispatchToProps)(MenubarComponent)

export default Menubar
