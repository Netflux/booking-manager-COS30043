import React from 'react'
import { connect } from 'react-redux'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'

const mapStateToProps = state => {
	return {

	}
}

const MenubarComponent = () => (
	<Toolbar>
		<ToolbarTitle text="Bookings" />
	</Toolbar>
)

const Menubar = connect(mapStateToProps)(MenubarComponent)

export default Menubar
