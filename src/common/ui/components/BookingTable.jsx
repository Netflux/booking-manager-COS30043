import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import { FloatingActionButton, FontIcon, Paper, RaisedButton, Tabs, Tab } from 'material-ui'

import BookingDatePicker from './BookingDatePicker'
import BookingDialog from './BookingDialog'
import Booking from './Booking'
import RoomDialog from './RoomDialog'

import { selectDate, fetchBookingsIfNeeded, fetchRoomsIfNeeded } from '../../actions'

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
		fetchBookings: (date) => {
			// Fetch the bookings for the entire week of the selected date
			const startOfWeek = moment(date, 'YYYY/M/D').startOf('isoWeek')
			const endOfWeek = moment(date, 'YYYY/M/D').endOf('isoWeek')
			let day = startOfWeek

			while (day <= endOfWeek) {
				dispatch(fetchBookingsIfNeeded(day.format('YYYY/M/D')))
				day = day.clone().add(1, 'days')
			}
		},
		fetchRooms: () => {
			dispatch(fetchRoomsIfNeeded())
		},
		onSelectDate: (date) => {
			dispatch(selectDate(date))
		}
	}
}

// Define the time slots available for booking (including header)
const timeSlots = [
	"Time",
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

// Define the days available for booking
const bookingDays = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
]

// Define the Booking Table component
class BookingTableComponent extends Component {
	componentDidMount() {
		// Fetch the bookings and rooms
		this.props.fetchBookings(this.props.selectedDate)
		this.props.fetchRooms()
	}

	componentDidUpdate(prevProps) {
		// If the new date is on a different week, fetch the bookings
		if (moment(this.props.selectedDate, 'YYYY/M/D').isoWeek() !== moment(prevProps.selectedDate, 'YYYY/M/D').isoWeek()) {
			this.props.fetchBookings(this.props.selectedDate)
		}
	}

	render() {
		const getSelectedDate = dayIndex => {
			// Get the date offset and use it to generate the selected date
			const dateOffset = (dayIndex + 1) - moment(this.props.selectedDate, 'YYYY/M/D').isoWeekday()

			return moment(this.props.selectedDate, 'YYYY/M/D').add(dateOffset, 'days').format('YYYY/M/D')
		}

		// Store a reference to the Booking Dialog component
		// Used to show the dialog when the user clicks on a time slot
		let bookingDialog

		// Store a reference to the Room Dialog component
		// Used to show the dialog when the user clicks on a room
		let roomDialog

		// Store a list of all available rooms
		const availableRooms = this.props.rooms.items.filter((room) => room.isAvailable)

		return (
			<div>
				{
					// If at least 1 room is available, display the booking table
					// Else, display a message indicating that no rooms are available
					availableRooms.length > 0 ? (
						<Tabs className="tabbar">
							<Tab label="Room View">
								<section>
									<BookingDatePicker />

									<Paper className="booking-table paper text-center">
										{
											timeSlots.map((time, index) => (
												<div className="row" key={time}>
													<div className="col-xs">
														<strong>{time}</strong>
													</div>

													{
														availableRooms.map((room) => {
															let bookingsByTimeSlot = []
															let timeSlotAvailable = true

															if (this.props.bookingsByDate[this.props.selectedDate]) {
																// Filter for any bookings that are available on the current time slot
																bookingsByTimeSlot = this.props.bookingsByDate[this.props.selectedDate].items.filter((booking) => booking.roomId == room.roomId && booking.timeSlot == index)

																// Check whether any bookings overlap with the current time slot
																timeSlotAvailable = !(this.props.bookingsByDate[this.props.selectedDate].items.filter((booking) => booking.roomId == room.roomId).some((booking) => {
																	for (let i = 0; i < booking.duration; ++i) {
																		if (booking.timeSlot + i == index) {
																			return true
																		}
																	}

																	return false
																}))
															}

															return (
																<div className={"col-xs" + (this.props.isLoggedIn && index != 0 && timeSlotAvailable ? " selectable" : "")} onTouchTap={() => this.props.isLoggedIn && index != 0 && timeSlotAvailable && bookingDialog.getWrappedInstance().show({roomId: room.roomId, timeSlot: index})} key={room.roomId}>
																	{
																		// If displaying the first row of the table, simply display it as a header
																		// Else, display any bookings that exist for the time slot
																		index == 0 ? (
																			<strong>{room.roomName}</strong>
																		) : (
																			bookingsByTimeSlot.map((booking) => (
																				<Booking className={this.props.isLoggedIn ? "clickable" : ""} booking={booking} onTouchTap={() => this.props.isLoggedIn && bookingDialog.getWrappedInstance().show({dialogTitle: "Edit Booking", editing: true, ...booking})} key={booking.bookingId} />
																			))
																		)
																	}
																</div>
															)
														})
													}
												</div>
											))
										}
									</Paper>
								</section>
							</Tab>

							<Tab label="Weekly View">
								<section>
									<BookingDatePicker />

									<Paper className="booking-table paper text-center">
										{
											timeSlots.map((time, index) => (
												<div className="row" key={time}>
													<div className="col-xs">
														<strong>{time}</strong>
													</div>

													{
														bookingDays.map((day, dayIndex) => (
															// If displaying the first row of the table, simply display it as a header
															// Else, check if any bookings exist for the time slot and display it
															index == 0 ? (
																<div className={"col-xs clickable" + (dayIndex + 1 == moment(this.props.selectedDate, 'YYYY/M/D').isoWeekday() ? " selected-date" : "")} onTouchTap={() => this.props.onSelectDate(getSelectedDate(dayIndex))} key={dayIndex}>
																	<strong>{day}</strong>
																</div>
															) : (
																<div className={"col-xs" + (this.props.isLoggedIn ? " selectable" : "") + (dayIndex + 1 == moment(this.props.selectedDate, 'YYYY/M/D').isoWeekday() ? " selected-date" : "")} onTouchTap={() => this.props.isLoggedIn && bookingDialog.getWrappedInstance().show({date: getSelectedDate(dayIndex), timeSlot: index})} key={dayIndex}></div>
															)
														))
													}
												</div>
											))
										}
									</Paper>
								</section>
							</Tab>
						</Tabs>
					) : (
						<section>
							<Paper className="paper text-center">
								<h1>No rooms available!</h1>

								{
									// If logged in, display the 'Add New Room' button
									// Else, display a message to the user
									this.props.isLoggedIn ? (
										<RaisedButton label="Add New Room" secondary={true} onTouchTap={() => roomDialog.getWrappedInstance().show()} />
									) : (
										<p>If you're seeing this message, please contact the system administrator.</p>
									)
								}
							</Paper>
						</section>
					)
				}

				{
					// If logged in, display the FAB for adding new rooms/bookings
					this.props.isLoggedIn && (
						<FloatingActionButton className="fab" secondary={true} onTouchTap={() => availableRooms.length > 0 ? bookingDialog.getWrappedInstance().show() : roomDialog.getWrappedInstance().show()}>
							<FontIcon className="material-icons">add</FontIcon>
						</FloatingActionButton>
					)
				}

				<BookingDialog ref={(dialog) => bookingDialog = dialog} />
				<RoomDialog ref={(dialog) => roomDialog = dialog} />
			</div>
		)
	}
}

// Define the property types that the component expects to receive
BookingTableComponent.propTypes = {
	selectedDate: PropTypes.string.isRequired,
	bookingsByDate: PropTypes.object.isRequired,
	rooms: PropTypes.object.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	fetchBookings: PropTypes.func.isRequired,
	fetchRooms: PropTypes.func.isRequired,
	onSelectDate: PropTypes.func.isRequired
}

// Define the container for the Booking Table component (maps state and dispatchers)
const BookingTable = connect(mapStateToProps, mapDispatchToProps)(BookingTableComponent)

export default BookingTable
