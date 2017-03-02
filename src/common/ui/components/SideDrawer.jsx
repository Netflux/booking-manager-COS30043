import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Drawer, MenuItem, Toolbar, ToolbarTitle } from 'material-ui'
import { white } from 'material-ui/styles/colors'

import { toggleDrawerOpen } from '../../actions'

const mapStateToProps = state => {
	return {
		isOpen: state.sideDrawerState.isOpen,
		isDocked: state.sideDrawerState.isDocked
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onToggleMenu: (shouldToggle) => {
			if (shouldToggle) {
				dispatch(toggleDrawerOpen())
			}
		}
	}
}

// Define the Side Drawer component
const SideDrawerComponent = ({isOpen, isDocked, onToggleMenu}) => (
	<Drawer className="side-drawer" open={isOpen} docked={isDocked} onRequestChange={() => onToggleMenu(true)}>
		<Toolbar className="menu-bar">
			<ToolbarTitle text="Navigation" style={{color: white}} />
		</Toolbar>

		<Link to="/" onTouchTap={() => onToggleMenu(!isDocked)}><MenuItem>Home</MenuItem></Link>
		<Link to="/about" onTouchTap={() => onToggleMenu(!isDocked)}><MenuItem>About</MenuItem></Link>
		<Link to="/login" onTouchTap={() => onToggleMenu(!isDocked)}><MenuItem>Login</MenuItem></Link>
	</Drawer>
)

// Define the property types that the component expects to receive
SideDrawerComponent.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	isDocked: PropTypes.bool.isRequired,
	onToggleMenu: PropTypes.func.isRequired
}

// Define the container for the Side Drawer component (maps state and dispatchers)
const SideDrawer = connect(mapStateToProps, mapDispatchToProps)(SideDrawerComponent)

export default SideDrawer
