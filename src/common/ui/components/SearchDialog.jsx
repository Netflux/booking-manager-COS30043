import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Dialog, Divider, FlatButton, List, ListItem, Subheader, TextField } from 'material-ui'

import BookingDialog from './BookingDialog'
import RoomDialog from './RoomDialog'

import { fetchSearchResults, clearSearchResults } from '../../actions'

const mapStateToProps = state => {
	return {
		bookingsByDate: state.bookingsByDate,
		rooms: state.rooms,
		isLoggedIn: state.user.isLoggedIn,
		search: state.search
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onSearch: (query) => {
			dispatch(fetchSearchResults(query))
		},
		onClearSearch: () => {
			dispatch(clearSearchResults())
		}
	}
}

// Define the Search Dialog component
class SearchDialogComponent extends Component {
	constructor(props) {
		super(props)

		// Initialize the default state
		this.state = this.defaultState = {
			open: false,
			searchQuery: ''
		}

		// Bind "this" to the function
		this.handleSearch = this.handleSearch.bind(this)
	}

	handleChange(value, stateName) {
		this.setState({ [stateName]: value })
		this.handleSearch(value)
	}

	handleSearch(query) {
		clearTimeout(this.searchTimer)

		if (query === '') {
			this.props.onClearSearch()
		} else {
			// Set a delay of 200ms for handling search requests
			this.searchTimer = setTimeout(() => {
				this.props.onSearch(query)
			}, 200)
		}

	}

	show(props) {
		this.setState({
			...props,
			open: true
		})
	}

	dismiss() {
		this.props.onClearSearch()

		this.setState(this.defaultState)
	}

	render() {
		// Define the action buttons to display in the dialog
		const actions = [
			<FlatButton label="Ok" secondary={true} onTouchTap={() => this.dismiss()} />
		]

		// Store a reference to the Booking Dialog component
		// Used to show the dialog when the user clicks on a time slot
		let bookingDialog

		// Store a reference to the Room Dialog component
		// Used to show the dialog when the user clicks on a room
		let roomDialog

		return (
			<Dialog contentClassName="dialog" autoScrollBodyContent={true} actions={actions} open={this.state.open} onRequestClose={() => this.dismiss()}>
				<TextField id="searchQuery" className="search-box form-input" floatingLabelText="Search Query" floatingLabelFixed={true} onChange={(event) => this.handleChange(event.target.value, 'searchQuery')} value={this.state.searchQuery} />

				{
					// Display a message if no results are available
					this.props.search.bookings.length === 0 && this.props.search.rooms.length === 0 && (
						<h1 className="text-center">{this.props.search.query === '' ? 'Enter a search query' : 'No results'}</h1>
					)
				}

				{
					// Display the list of bookings if results are available
					this.props.search.bookings.length > 0 && (
						<List>
							<Subheader>Bookings</Subheader>
							{
								this.props.search.bookings.map((booking) => {
									const room = this.props.rooms.items.find((room) => room.roomId === booking.roomId)
									const secondaryText = room ? `${room.roomName} -- ${booking.bookingDesc}` : booking.bookingDesc

									return (
										<ListItem primaryText={booking.bookingTitle} secondaryText={secondaryText} onTouchTap={() => bookingDialog.getWrappedInstance().show({ mode: 1, ...booking })} key={booking.bookingId} />
									)
								})
							}
						</List>
					)
				}

				{
					// Display a divider if both bookings and rooms are available
					this.props.search.bookings.length > 0 && this.props.search.rooms.length > 0 && (
						<Divider />
					)
				}

				{
					// Display the list of rooms if results are available
					this.props.search.rooms.length > 0 && (
						<List>
							<Subheader>Rooms</Subheader>
							{
								this.props.search.rooms.map((room) => (
									<ListItem primaryText={room.roomName} secondaryText={room.roomDesc} onTouchTap={() => roomDialog.getWrappedInstance().show({ mode: 1, ...room })} key={room.roomId} />
								))
							}
						</List>
					)
				}

				<BookingDialog ref={(dialog) => bookingDialog = dialog} />
				<RoomDialog ref={(dialog) => roomDialog = dialog} />
			</Dialog>
		)
	}
}

// Define the property types that the component expects to receive
SearchDialogComponent.propTypes = {
	bookingsByDate: PropTypes.object.isRequired,
	rooms: PropTypes.object.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	search: PropTypes.object.isRequired,
	onSearch: PropTypes.func.isRequired,
	onClearSearch: PropTypes.func.isRequired
}

// Define the container for the Search Dialog component (maps state and dispatchers)
const SearchDialog = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(SearchDialogComponent)

export default SearchDialog
