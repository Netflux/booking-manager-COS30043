import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FontIcon, Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui'

import theme from '../theme'

import { toggleDrawerOpen } from '../../actions'

const mapDispatchToProps = dispatch => {
	return {
		onToggleMenu: () => {
			dispatch(toggleDrawerOpen())
		}
	}
}

// Define the Menubar component
const MenubarComponent = ({ title, onToggleMenu }) => (
	<Toolbar className="toolbar">
		<ToolbarGroup>
			<label className="clickable" htmlFor="menu"><FontIcon className="material-icons menu-icon" onTouchTap={() => onToggleMenu()} style={{ color: theme.palette.alternateTextColor }}>menu</FontIcon></label>
			<ToolbarTitle text={title} style={{ color: theme.palette.alternateTextColor }} />
		</ToolbarGroup>
	</Toolbar>
)

// Define the property types that the component expects to receive
MenubarComponent.propTypes = {
	title: PropTypes.string.isRequired,
	onToggleMenu: PropTypes.func.isRequired
}

// Define the container for the Menubar component (maps dispatchers)
const Menubar = connect(null, mapDispatchToProps)(MenubarComponent)

export default Menubar
