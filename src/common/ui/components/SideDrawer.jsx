import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Divider, Drawer, MenuItem, Subheader, Toolbar, ToolbarTitle } from 'material-ui'
import { white } from 'material-ui/styles/colors'

import { toggleDrawerOpen, toggleDrawerDocked } from '../../actions'

const mapStateToProps = state => {
	return {
		isOpen: state.sideDrawerState.isOpen,
		isDocked: state.sideDrawerState.isDocked,
		selectedDateHistory: state.selectedDateHistory
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onToggleMenu: (shouldToggle) => {
			if (shouldToggle) {
				dispatch(toggleDrawerOpen())
			}
		},
		onWindowResize: (isOpen, isDocked) => {
			if (window.innerWidth >= 1024) {
				if (!isOpen) dispatch(toggleDrawerOpen())
				if (!isDocked) dispatch(toggleDrawerDocked())
			} else {
				if (isOpen) dispatch(toggleDrawerOpen())
				if (isDocked) dispatch(toggleDrawerDocked())
			}
		}
	}
}

class SideDrawerComponent extends React.Component {
	constructor(props) {
		super(props)

		// Bind "this" to the function
		this.handleResize = this.handleResize.bind(this)
	}

	handleResize(event) {
		// Set a timeout of 250ms for handling window resize events
		if (!this.resizeTimer) {
			this.props.onWindowResize(this.props.isOpen, this.props.isDocked)

			this.resizeTimer = setTimeout(() => {
				this.resizeTimer = false
			}, 250)
		}
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize)
		this.handleResize()
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize)
	}

	render() {
		return (
			<Drawer className="side-drawer" open={this.props.isOpen} docked={this.props.isDocked} onRequestChange={() => this.props.onToggleMenu(true)}>
				<Toolbar className="menu-bar">
					<ToolbarTitle text="Navigation" style={{color: white}} />
				</Toolbar>

				<Link to="/" onTouchTap={() => this.props.onToggleMenu(!this.props.isDocked)}><MenuItem>Home</MenuItem></Link>
				<Link to="/about" onTouchTap={() => this.props.onToggleMenu(!this.props.isDocked)}><MenuItem>About</MenuItem></Link>
				<Link to="/login" onTouchTap={() => this.props.onToggleMenu(!this.props.isDocked)}><MenuItem>Login</MenuItem></Link>

				{
					// Only render history list if there are entries to display
					this.props.selectedDateHistory.length > 0 && (
						<div>
							<Divider />
							<Subheader>Recently Viewed Dates</Subheader>
							
							{
								this.props.selectedDateHistory.map((date) => (
									<Link to={`/bookings/${date}`} onTouchTap={() => this.props.onToggleMenu(!this.props.isDocked)} key={date}><MenuItem>{date}</MenuItem></Link>
								))
							}
						</div>
					)
				}
			</Drawer>
		)
	}
}

// Define the property types that the component expects to receive
SideDrawerComponent.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	isDocked: PropTypes.bool.isRequired,
	selectedDateHistory: PropTypes.array.isRequired,
	onToggleMenu: PropTypes.func.isRequired,
	onWindowResize: PropTypes.func.isRequired
}

// Define the container for the Side Drawer component (maps state and dispatchers)
const SideDrawer = connect(mapStateToProps, mapDispatchToProps)(SideDrawerComponent)

export default SideDrawer
