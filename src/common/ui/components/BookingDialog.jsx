import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import shortid from 'shortid'
import { DatePicker, Dialog, FlatButton, MenuItem, SelectField, TextField } from 'material-ui'

import { handleAddBooking, handleUpdateBooking, handleDeleteBooking } from '../../actions'

const mapStateToProps = state => {
	return {
		selectedDate: state.selectedDate,
		bookingsByDate: state.bookingsByDate,
		rooms: state.rooms,
		isLoggedIn: state.user.isLoggedIn
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addBooking: (booking) => {
			dispatch(handleAddBooking(booking))
		},
		updateBooking: (booking) => {
			dispatch(handleUpdateBooking(booking))
		},
		deleteBooking: (date, bookingId) => {
			dispatch(handleDeleteBooking(date, bookingId))
		}
	}
}

// Define the available modes for the Booking Dialog Component
const MODE_ADD = 0
const MODE_VIEW = 1
const MODE_EDIT = 2

// Define the Booking Dialog component
class BookingDialogComponent extends Component {
	constructor(props) {
		super(props)

		// Initialize the default state
		this.state = this.defaultState = {
			open: false,
			mode: MODE_ADD,
			dialogTitle: 'New Booking',
			roomId: '',
			roomIdErrorText: '',
			bookingId: '',
			bookingTitle: '',
			bookingTitleErrorText: '',
			bookingDesc: '',
			timeSlotErrorText: '',
			durationErrorText: '',
			date: this.props.selectedDate,
			timeSlot: 1,
			duration: 1
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.selectedDate !== this.state.date) {
			this.setState({ date: nextProps.selectedDate })
			this.defaultState.date = nextProps.selectedDate
		}
	}

	handleChange(value, stateName) {
		this.setState({
			[stateName]: value,
			[stateName + 'ErrorText']: ''
		})
	}

	show(props) {
		this.setState({
			...props,
			open: true
		})

		switch (props.mode) {
		case MODE_VIEW:
			this.setState({ dialogTitle: 'View Booking' })
			break
		case MODE_EDIT:
			this.setState({ dialogTitle: 'Edit Booking' })
			break
		case MODE_ADD:
		default:
			this.setState({ dialogTitle: this.defaultState.dialogTitle })
			break
		}
	}

	dismiss() {
		this.setState(this.defaultState)
	}

	delete() {
		this.props.deleteBooking(this.state.date, this.state.bookingId)
		this.dismiss()
	}

	edit() {
		this.oldState = this.state
		this.setState({
			dialogTitle: 'Edit Booking',
			mode: MODE_EDIT
		})
	}

	cancel() {
		if (this.state.mode === MODE_EDIT) {
			this.setState(this.oldState)
		} else {
			this.dismiss()
		}
	}

	accept() {
		// Reset all error text
		this.setState({
			roomIdErrorText: '',
			bookingTitleErrorText: '',
			timeSlotErrorText: '',
			durationErrorText: ''
		})

		let hasError = false

		// Check whether there are any input errors
		if (this.state.roomId === '') {
			this.setState({ roomIdErrorText: 'This field is required' })
			hasError = true
		}
		if (this.state.bookingTitle === '') {
			this.setState({ bookingTitleErrorText: 'This field is required' })
			hasError = true
		}
		if (this.props.bookingsByDate[this.state.date]) {
			// Check whether any bookings overlap with the current time slot
			this.props.bookingsByDate[this.state.date].items.filter((booking) => booking.roomId === this.state.roomId && booking.bookingId !== this.state.bookingId).some((booking) => {
				if (booking.timeSlot <= this.state.timeSlot + (this.state.duration - 1) && this.state.timeSlot <= booking.timeSlot + (booking.duration - 1)) {
					if (booking.timeSlot === this.state.timeSlot) {
						this.setState({ timeSlotErrorText: 'Overlaps with other booking' })
					} else {
						this.setState({ durationErrorText: 'Overlaps with other booking' })
					}

					hasError = true

					return true
				}

				return false
			})
		}

		// If there are no input errors, add/update the booking
		if (!hasError) {
			let booking = {
				bookingId: this.state.bookingId,
				bookingTitle: this.state.bookingTitle,
				bookingDesc: this.state.bookingDesc,
				roomId: this.state.roomId,
				date: this.state.date,
				timeSlot: this.state.timeSlot,
				duration: this.state.duration
			}

			if (this.state.mode === MODE_EDIT) {
				this.props.updateBooking(booking)
			} else if (this.state.mode === MODE_ADD) {
				booking.bookingId = shortid.generate() + moment().format('ss')
				this.props.addBooking(booking)
			}

			this.dismiss()
		}
	}

	render() {
		// Define the action buttons to display in the dialog
		const actions = [ <FlatButton label="Ok" secondary={true} onTouchTap={() => this.accept()} /> ]

		if (this.props.isLoggedIn) {
			if (this.state.mode === MODE_ADD || this.state.mode === MODE_EDIT) {
				actions.unshift(<FlatButton label="Cancel" secondary={true} onTouchTap={() => this.cancel()} />)

				if (this.state.mode === MODE_EDIT) {
					actions.unshift(<FlatButton label="Delete" secondary={true} onTouchTap={() => this.delete()} />)
				}
			} else if (this.state.mode === MODE_VIEW) {
				actions.unshift(<FlatButton label="Edit" secondary={true} onTouchTap={() => this.edit()} />)
			}
		}

		// Define the time slots available for booking
		const timeSlots = [
			'10.30am',
			'11.30am',
			'12.30pm',
			'1.30pm',
			'2.30pm',
			'3.30pm',
			'4.30pm',
			'5.30pm',
			'6.30pm',
			'7.30pm',
			'8.30pm',
			'9.30pm',
			'10.30pm'
		]

		// Define the durations available for booking
		const durations = [
			'1 Hour',
			'2 Hour',
			'3 Hour'
		]

		return (
			<Dialog contentClassName="dialog" title={this.state.dialogTitle} autoScrollBodyContent={true} actions={actions} open={this.state.open} onRequestClose={() => this.dismiss()}>
				<SelectField id="room" className="form-input" floatingLabelText="Room" floatingLabelFixed={true} errorText={this.state.roomIdErrorText} disabled={this.state.mode === MODE_VIEW} onChange={(event, key, payload) => this.handleChange(payload, 'roomId')} value={this.state.roomId}>
					{
						this.props.rooms.items.filter((room) => room.isAvailable).map((room, index) => (
							<MenuItem primaryText={room.roomName} value={room.roomId} key={index}/>
						))
					}
				</SelectField><br />
				<TextField id="title" className="form-input" floatingLabelText="Title" floatingLabelFixed={true} errorText={this.state.bookingTitleErrorText} disabled={this.state.mode === MODE_VIEW} onChange={(event) => this.handleChange(event.target.value, 'bookingTitle')} value={this.state.bookingTitle} /><br />
				<TextField id="description" className="form-input" floatingLabelText="Description" floatingLabelFixed={true} disabled={this.state.mode === MODE_VIEW} onChange={(event) => this.handleChange(event.target.value, 'bookingDesc')} value={this.state.bookingDesc} /><br />
				<DatePicker id="date" floatingLabelText="Date" floatingLabelFixed={true} formatDate={(date) => moment(date).format('D/M/YYYY')} disabled={this.state.mode === MODE_VIEW} onChange={(event, date) => this.handleChange(moment(date).format('YYYY/M/D'), 'date')} value={moment(this.state.date, 'YYYY/M/D').toDate()} />
				<SelectField id="time" className="form-input" floatingLabelText="Time" floatingLabelFixed={true} errorText={this.state.timeSlotErrorText} disabled={this.state.mode === MODE_VIEW} onChange={(event, key, payload) => this.handleChange(payload, 'timeSlot')} value={this.state.timeSlot}>
					{
						timeSlots.map((time, index) => (
							<MenuItem primaryText={time} value={index + 1} key={index}/>
						))
					}
				</SelectField><br />
				<SelectField id="duration" className="form-input" floatingLabelText="Duration" floatingLabelFixed={true} errorText={this.state.durationErrorText} disabled={this.state.mode === MODE_VIEW} onChange={(event, key, payload) => this.handleChange(payload, 'duration')} value={this.state.duration}>
					{
						durations.map((duration, index) => (
							<MenuItem primaryText={duration} value={index + 1} key={index}/>
						))
					}
				</SelectField>
			</Dialog>
		)
	}
}

// Define the property types that the component expects to receive
BookingDialogComponent.propTypes = {
	selectedDate: PropTypes.string.isRequired,
	bookingsByDate: PropTypes.object.isRequired,
	rooms: PropTypes.object.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	addBooking: PropTypes.func.isRequired,
	updateBooking: PropTypes.func.isRequired,
	deleteBooking: PropTypes.func.isRequired
}

// Define the container for the Booking Dialog component (maps state and dispatchers)
const BookingDialog = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(BookingDialogComponent)

export default BookingDialog
