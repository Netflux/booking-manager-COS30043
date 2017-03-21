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

		<div className="row">
			<div className="col-xs">
				<strong>10.30am</strong>
			</div>
			<div className="col-xs">

			</div>
			<div className="col-xs">

			</div>
			<div className="col-xs">

			</div>
			<div className="col-xs">

			</div>
			<div className="col-xs">

			</div>
			<div className="col-xs">

			</div>
		</div>
	</Paper>
)

// Define the property types that the component expects to receive
BookingTableComponent.propTypes = {
	bookingsByDate: PropTypes.object.isRequired
}

// Define the container for the Booking Table component (maps state and dispatchers)
const BookingTable = connect(mapStateToProps, mapDispatchToProps)(BookingTableComponent)

export default BookingTable
