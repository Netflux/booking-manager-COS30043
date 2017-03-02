import React from 'react'
import { connect } from 'react-redux'
import { AppBar, Drawer, MenuItem } from 'material-ui'

const mapStateToProps = state => {
	return {
		open: true
	}
}

const SideDrawerComponent = (props) => (
	<Drawer open={props.open}>
		<AppBar title="Navigation" showMenuIconButton={false} />
		<MenuItem>Home</MenuItem>
		<MenuItem>About</MenuItem>
		<MenuItem>Login</MenuItem>
	</Drawer>
)

const SideDrawer = connect(mapStateToProps)(SideDrawerComponent)

export default SideDrawer
