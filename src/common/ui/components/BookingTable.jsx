import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Paper } from 'material-ui'

const mapStateToProps = state => {
	return {
		bookingsByDate: state.bookingsByDate
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
const BookingTableComponent = ({bookingsByDate}) => (
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
)

// Define the property types that the component expects to receive
BookingTableComponent.propTypes = {
	bookingsByDate: PropTypes.object.isRequired
}

// Define the container for the Booking Table component (maps state and dispatchers)
const BookingTable = connect(mapStateToProps, mapDispatchToProps)(BookingTableComponent)

export default BookingTable
