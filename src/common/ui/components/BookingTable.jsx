import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Paper, Tabs, Tab } from 'material-ui'

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

// Define the timeslots available for booking
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

// Define the Booking Table component
const BookingTableComponent = ({selectedDate, bookingsByDate, rooms}) => (
	<Tabs className="tabbar">
		<Tab label="Room View">
			<section>
				{
					rooms.items.length > 0 ? (
						<Paper className="booking-table paper text-center">
							<div className="row">
								<div className="col-xs">
									<strong>Time</strong>
								</div>

								{
									rooms.items.filter((room) => room.isAvailable).map((room) => (
										<div className="col-xs" key={room.roomId}>
											<strong>{room.roomName}</strong>
										</div>
									))
								}
							</div>

							{
								timeSlots.map((time, index) => (
									<div className="row" key={time}>
										<div className="col-xs">
											<strong>{time}</strong>
										</div>

										{
											rooms.items.filter((room) => room.isAvailable).map((room) => (
												<div className={"col-xs" + (bookingsByDate[selectedDate].items.filter((booking) => booking.roomId == room.roomId && booking.timeSlot == index + 1).length == 0 ? " selectable" : "")} data-row={index + 1} data-roomId={room.roomId} key={room.roomId}>
													{
														bookingsByDate[selectedDate].items.filter((booking) => booking.roomId == room.roomId && booking.timeSlot == index + 1).map((booking) => (
															<Booking booking={booking} key={booking.bookingId} />
														))
													}
												</div>
											))
										}
									</div>
								))
							}
						</Paper>
					) : (
						<Paper className="booking-table paper text-center">
							<h1>No rooms available!</h1>
							<p>If you're seeing this message, please contact the system administrator.</p>
						</Paper>
					)
				}
			</section>
		</Tab>

		<Tab label="Weekly View">
			<section>
				<Paper className="booking-table paper text-center">
					<div className="row">
						<div className="col-xs">
							<strong>Time</strong>
						</div>
						<div className="col-xs">
							<strong>Mon</strong>
						</div>
						<div className="col-xs">
							<strong>Tue</strong>
						</div>
						<div className="col-xs">
							<strong>Wed</strong>
						</div>
						<div className="col-xs">
							<strong>Thu</strong>
						</div>
						<div className="col-xs">
							<strong>Fri</strong>
						</div>
						<div className="col-xs">
							<strong>Sat</strong>
						</div>
					</div>

					{
						timeSlots.map((time) => (
							<div className="row" key={time}>
								<div className="col-xs">
									<strong>{time}</strong>
								</div>
								<div className="col-xs selectable"></div>
								<div className="col-xs selectable"></div>
								<div className="col-xs selectable"></div>
								<div className="col-xs selectable"></div>
								<div className="col-xs selectable"></div>
								<div className="col-xs selectable"></div>
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
