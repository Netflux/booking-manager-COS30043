import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FontIcon, Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui'

import SearchDialog from './SearchDialog'

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
const MenubarComponent = ({ title, onToggleMenu }) => {
	// Store a reference to the Search Dialog component
	// Used to show the dialog when the user clicks on the search icon
	let searchDialog

	return (
		<Toolbar className="toolbar">
			<ToolbarGroup>
				<label className="clickable" htmlFor="menu"><FontIcon className="material-icons menu-icon" onTouchTap={() => onToggleMenu()} style={{ color: theme.palette.alternateTextColor }}>menu</FontIcon></label>
				<ToolbarTitle text={title} style={{ color: theme.palette.alternateTextColor }} />
			</ToolbarGroup>
			<ToolbarGroup>
				<FontIcon className="material-icons" onTouchTap={() => searchDialog.getWrappedInstance().show()} style={{ color: theme.palette.alternateTextColor }}>search</FontIcon>
				<SearchDialog ref={(dialog) => searchDialog = dialog} />
			</ToolbarGroup>
		</Toolbar>
	)
}

// Define the property types that the component expects to receive
MenubarComponent.propTypes = {
	title: PropTypes.string.isRequired,
	onToggleMenu: PropTypes.func.isRequired
}

// Define the container for the Menubar component (maps dispatchers)
const Menubar = connect(null, mapDispatchToProps)(MenubarComponent)

export default Menubar
