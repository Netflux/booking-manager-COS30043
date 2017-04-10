import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import { Divider, Drawer, FontIcon, MenuItem, Subheader, Toolbar, ToolbarTitle } from 'material-ui'

import theme from '../theme'

import { toggleDrawerOpen, toggleDrawerDocked, selectDate, clearLoginError, requestLogout } from '../../actions'

const mapStateToProps = state => {
	return {
		isOpen: state.sideDrawerState.isOpen,
		isDocked: state.sideDrawerState.isDocked,
		selectedDateHistory: state.selectedDateHistory,
		isLoggedIn: state.user.isLoggedIn
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onNavigate: (shouldToggle) => {
			dispatch(clearLoginError())
			if (shouldToggle) { dispatch(toggleDrawerOpen()) }
		},
		onToggleMenu: (shouldToggle) => {
			if (shouldToggle) { dispatch(toggleDrawerOpen()) }
		},
		onSelectDate: (date) => {
			dispatch(selectDate(date))
		},
		onLogout: () => {
			dispatch(requestLogout())
		},
		onWindowResize: (isOpen, isDocked) => {
			if (window.innerWidth >= 1024) {
				if (!isOpen) { dispatch(toggleDrawerOpen()) }
				if (!isDocked) { dispatch(toggleDrawerDocked()) }
			} else {
				if (isOpen) { dispatch(toggleDrawerOpen()) }
				if (isDocked) { dispatch(toggleDrawerDocked()) }
			}
		}
	}
}

// Define the Side Drawer component
class SideDrawerComponent extends Component {
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
			<Drawer className="side-drawer" open={this.props.isOpen} docked={this.props.isDocked} onRequestChange={() => this.props.onToggleMenu(true)} containerStyle={!(this.props.isOpen && this.props.isDocked) ? {transition: "transform 550ms cubic-bezier(0.23, 1, 0.32, 1) 10ms"} : null}>
				<Toolbar className="menu-bar">
					<ToolbarTitle text="Navigation" style={{ color: theme.palette.alternateTextColor }} />
				</Toolbar>

				<Link to="/" onTouchTap={() => this.props.onNavigate(!this.props.isDocked)}><MenuItem leftIcon={<FontIcon className="material-icons">home</FontIcon>}>Home</MenuItem></Link>
				<Link to="/about" onTouchTap={() => this.props.onNavigate(!this.props.isDocked)}><MenuItem leftIcon={<FontIcon className="material-icons">info</FontIcon>}>About</MenuItem></Link>
				<Link to="/rooms" onTouchTap={() => this.props.onNavigate(!this.props.isDocked)}><MenuItem leftIcon={<FontIcon className="material-icons">room</FontIcon>}>Rooms</MenuItem></Link>

				{
					// Render either the login/logout button depending on the user login status
					this.props.isLoggedIn ? (
						<Link to="/logout" onTouchTap={(event) => {
								event.preventDefault()
								this.props.onNavigate(!this.props.isDocked)
								this.props.onLogout()
							}} onClick={(event) => event.preventDefault()}><MenuItem leftIcon={<FontIcon className="material-icons">power_settings_new</FontIcon>}>Logout</MenuItem></Link>
					) : (
						<Link to="/login" onTouchTap={() => this.props.onNavigate(!this.props.isDocked)}><MenuItem leftIcon={<FontIcon className="material-icons">account_circle</FontIcon>}>Login</MenuItem></Link>
					)
				}

				{
					// Only render history list if there are entries to display
					this.props.selectedDateHistory.length > 0 && (
						<div>
							<Divider />
							<Subheader>Recently Viewed Dates</Subheader>

							{
								this.props.selectedDateHistory.map((date) => (
									<Link to="/" onTouchTap={() => {
											this.props.onNavigate(!this.props.isDocked)
											this.props.onSelectDate(date)
										}} key={date}><MenuItem>{moment(date, 'YYYY/M/D').format('D/M/YYYY')}</MenuItem></Link>
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
	isLoggedIn: PropTypes.bool.isRequired,
	onNavigate: PropTypes.func.isRequired,
	onToggleMenu: PropTypes.func.isRequired,
	onSelectDate: PropTypes.func.isRequired,
	onLogout: PropTypes.func.isRequired,
	onWindowResize: PropTypes.func.isRequired
}

// Define the container for the Side Drawer component (maps state and dispatchers)
const SideDrawer = connect(mapStateToProps, mapDispatchToProps)(SideDrawerComponent)

export default SideDrawer
