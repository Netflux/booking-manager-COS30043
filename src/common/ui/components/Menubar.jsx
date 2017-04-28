import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { FontIcon, Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui'

import SearchDialog from './SearchDialog'

import theme from '../theme'

import { toggleDrawerOpen, fetchBookings, invalidateBookings, fetchRooms, invalidateRooms, fetchStatistics, invalidateStatistics } from '../../actions'

const mapStateToProps = state => {
	return {
		selectedDate: state.selectedDate
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onToggleMenu: () => {
			dispatch(toggleDrawerOpen())
		},
		onRefresh: (date) => {
			// Fetch the bookings for the entire week of the selected date
			const startOfWeek = moment(date, 'YYYY/M/D').startOf('isoWeek')
			const endOfWeek = moment(date, 'YYYY/M/D').endOf('isoWeek')
			let day = startOfWeek

			while (day <= endOfWeek) {
				dispatch(fetchBookings(day.format('YYYY/M/D')))
				day = day.clone().add(1, 'days')
			}

			// Fetch rooms and statistics
			dispatch(fetchRooms())
			dispatch(fetchStatistics())
		}
	}
}

// Define the Menubar component
const MenubarComponent = ({ title, selectedDate, onToggleMenu, onRefresh }) => {
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
				<FontIcon className="material-icons" onTouchTap={() => onRefresh(selectedDate)} style={{ color: theme.palette.alternateTextColor }}>refresh</FontIcon>
				<SearchDialog ref={(dialog) => searchDialog = dialog} />
			</ToolbarGroup>
		</Toolbar>
	)
}

// Define the property types that the component expects to receive
MenubarComponent.propTypes = {
	title: PropTypes.string.isRequired,
	selectedDate: PropTypes.string.isRequired,
	onToggleMenu: PropTypes.func.isRequired,
	onRefresh: PropTypes.func.isRequired
}

// Define the container for the Menubar component (maps state and dispatchers)
const Menubar = connect(mapStateToProps, mapDispatchToProps)(MenubarComponent)

export default Menubar
