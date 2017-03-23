import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Paper, Tabs, Tab } from 'material-ui'

import BookingDatePicker from './BookingDatePicker'
import Booking from './Booking'

const mapStateToProps = state => {
	return {
		selectedDate: state.selectedDate,
		bookingsByDate: state.bookingsByDate,
		rooms: state.rooms
	}
}

const mapDispatchToProps = dispatch => {
	return {

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
const BookingTableComponent = ({selectedDate, bookingsByDate, rooms}) => (
	<Tabs className="tabbar">
		<Tab label="Room View">
			{
				// If at least 1 room is available, display the booking table
				// Else, display a message indicating that no rooms are available
				rooms.items.length > 0 ? (
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
											rooms.items.filter((room) => room.isAvailable).map((room) => (
												<div className={"col-xs" + (index != 0 && bookingsByDate[selectedDate].items.filter((booking) => booking.roomId == room.roomId && booking.timeSlot == index).length == 0 ? " selectable" : "")} data-row={index} data-roomId={room.roomId} key={room.roomId}>
													{
														// If displaying the first row of the table, simply display it as a header
														// Else, check if any bookings exist for the time slot and display it
														index == 0 ? (
															<strong>{room.roomName}</strong>
														) : (
															bookingsByDate[selectedDate].items.filter((booking) => booking.roomId == room.roomId && booking.timeSlot == index).map((booking) => (
																<Booking booking={booking} key={booking.bookingId} />
															))
														)
													}
												</div>
											))
										}
									</div>
								))
							}
						</Paper>
					</section>
				) : (
					<section>
						<Paper className="booking-table paper text-center">
							<h1>No rooms available!</h1>
							<p>If you're seeing this message, please contact the system administrator.</p>
						</Paper>
					</section>
				)
			}
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
										<div className={"col-xs" + (dayIndex + 1 == moment(selectedDate, 'YYYY/M/D').isoWeekday() ? " selected-date" : "")} key={dayIndex}>
											{
												// If displaying the first row of the table, simply display it as a header
												index == 0 && (
													<strong>{day}</strong>
												)
											}
										</div>
									))
								}
							</div>
						))
					}
				</Paper>
			</section>
		</Tab>
	</Tabs>
)

// Define the property types that the component expects to receive
BookingTableComponent.propTypes = {
	selectedDate: PropTypes.string.isRequired,
	bookingsByDate: PropTypes.object.isRequired,
	rooms: PropTypes.object.isRequired
}

// Define the container for the Booking Table component (maps state and dispatchers)
const BookingTable = connect(mapStateToProps, mapDispatchToProps)(BookingTableComponent)

export default BookingTable
