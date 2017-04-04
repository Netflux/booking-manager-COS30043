import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import shortid from 'shortid'
import { DatePicker, Dialog, FlatButton, MenuItem, SelectField, Snackbar, TextField } from 'material-ui'

import { addBooking, deleteBooking, fetchRoomsIfNeeded } from '../../actions'

const mapStateToProps = state => {
	return {
		selectedDate: state.selectedDate,
		rooms: state.rooms
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addNewBooking: (booking) => {
			dispatch(addBooking(booking.date, booking))
		},
		deleteCurrentBooking: (date, bookingId) => {
			dispatch(deleteBooking(date, bookingId))
		},
		fetchRooms: () => {
			dispatch(fetchRoomsIfNeeded())
		}
	}
}

// Define the Booking Dialog component
class BookingDialogComponent extends Component {
	constructor(props) {
		super(props)

		// Initialize the default state
		this.state = this.defaultState = {
			open: false,
			editing: false,
			dialogTitle: "New Booking",
			roomId: "",
			roomIdErrorText: "",
			bookingId: "",
			bookingTitle: "",
			bookingTitleErrorText: "",
			bookingDesc: "",
			date: this.props.selectedDate,
			timeSlot: 1,
			duration: 1
		}
	}

	componentDidMount() {
		// Fetch the rooms
		this.props.fetchRooms()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.selectedDate !== this.state.date) {
			this.setState({
				date: nextProps.selectedDate
			})
			this.defaultState.date = nextProps.selectedDate
		}
	}

	handleChange(value, stateName) {
		this.setState({
			[stateName]: value,
			[stateName + "ErrorText"]: ""
		})
	}

	show(props) {
		this.setState({
			...props,
			open: true
		})
	}

	dismiss() {
		this.setState(this.defaultState)
	}

	delete() {
		this.props.deleteCurrentBooking(this.state.date, this.state.bookingId)

		this.dismiss()
	}

	accept() {
		let hasError = false

		if (this.state.roomId == "") {
			this.setState({roomIdErrorText: "This field is required"})
			hasError = true
		}

		if (this.state.bookingTitle == "") {
			this.setState({bookingTitleErrorText: "This field is required"})
			hasError = true
		}

		if (!hasError) {
			if (!this.state.editing) {
				const newBooking = {
					bookingId: shortid.generate() + moment().format('ss'),
					bookingTitle: this.state.bookingTitle,
					bookingDesc: this.state.bookingDesc,
					roomId: this.state.roomId,
					date: this.state.date,
					timeSlot: this.state.timeSlot,
					duration: this.state.duration
				}

				this.props.addNewBooking(newBooking)
			} else {

			}

			this.dismiss()
		}
	}

	render() {
		// Define the action buttons to display in the dialog
		const actions = [
			<FlatButton label="Delete" secondary={true} disabled={!this.state.editing} onTouchTap={() => this.delete()} />,
			<FlatButton label="Cancel" secondary={true} onTouchTap={() => this.dismiss()} />,
			<FlatButton label="Ok" secondary={true} onTouchTap={() => this.accept()} />
		]

		// Define the time slots available for booking
		const timeSlots = [
			"10.30am",
			"11.30am",
			"12.30pm",
			"1.30pm",
			"2.30pm",
			"3.30pm",
			"4.30pm",
			"5.30pm",
			"6.30pm",
			"7.30pm",
			"8.30pm",
			"9.30pm",
			"10.30pm"
		]

		// Define the durations available for booking
		const durations = [
			"1 Hour",
			"2 Hour",
			"3 Hour"
		]

		return (
			<Dialog contentClassName="dialog" title={this.state.dialogTitle} autoScrollBodyContent={true} actions={actions} open={this.state.open} onRequestClose={() => this.dismiss()}>
				<SelectField id="room" className="form-input" floatingLabelText="Room" floatingLabelFixed={true} errorText={this.state.roomIdErrorText} onChange={(event, key, payload) => this.handleChange(payload, "roomId")} value={this.state.roomId}>
					{
						this.props.rooms.items.filter((room) => room.isAvailable).map((room, index) => (
							<MenuItem primaryText={room.roomName} value={room.roomId} key={index}/>
						))
					}
				</SelectField><br />
				<TextField id="title" className="form-input" floatingLabelText="Title" floatingLabelFixed={true} errorText={this.state.bookingTitleErrorText} onChange={(event) => this.handleChange(event.target.value, "bookingTitle")} value={this.state.bookingTitle} /><br />
				<TextField id="description" className="form-input" floatingLabelText="Description" floatingLabelFixed={true} onChange={(event) => this.handleChange(event.target.value, "bookingDesc")} value={this.state.bookingDesc} /><br />
				<DatePicker id="date" floatingLabelText="Date" floatingLabelFixed={true} formatDate={(date) => moment(date).format('D/M/YYYY')} onChange={(event, date) => this.handleChange(moment(date).format('YYYY/M/D'), "date")} value={moment(this.state.date, 'YYYY/M/D').toDate()} />
				<SelectField id="time" className="form-input" floatingLabelText="Time" floatingLabelFixed={true} onChange={(event, key, payload) => this.handleChange(payload, "timeSlot")} value={this.state.timeSlot}>
					{
						timeSlots.map((time, index) => (
							<MenuItem primaryText={time} value={index + 1} key={index}/>
						))
					}
				</SelectField><br />
				<SelectField id="duration" className="form-input" floatingLabelText="Duration" floatingLabelFixed={true} onChange={(event, key, payload) => this.handleChange(payload, "duration")} value={this.state.duration}>
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
	rooms: PropTypes.object.isRequired,
	addNewBooking: PropTypes.func.isRequired,
	deleteCurrentBooking: PropTypes.func.isRequired,
	fetchRooms: PropTypes.func.isRequired
}

// Define the container for the Booking Dialog component (maps state and dispatchers)
const BookingDialog = connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(BookingDialogComponent)

export default BookingDialog
