import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { FontIcon } from 'material-ui'

import { selectDate } from '../../actions'

const mapStateToProps = state => {
	return {
		selectedDate: state.selectedDate
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onPreviousDate: (date) => {
			dispatch(selectDate(moment(date, 'YYYY/M/D').subtract(1, 'days').format('YYYY/M/D')))
		},
		onNextDate: (date) => {
			dispatch(selectDate(moment(date, 'YYYY/M/D').add(1, 'days').format('YYYY/M/D')))
		},
		onSelectDate: (date) => {
			dispatch(selectDate(date))
		}
	}
}

const BookingDatePickerComponent = ({selectedDate, onPreviousDate, onNextDate, onSelectDate}) => (
	<div className="booking-date-picker row between-xs">
		<p className="text-center vertical-center selectable" onTouchTap={() => onPreviousDate(selectedDate)}><FontIcon className="material-icons">arrow_back</FontIcon></p>
		<h1 className="text-center col-xs selectable" onTouchTap={() => onChangeDate()}>{moment(selectedDate, 'YYYY/M/D').format('D/M/YYYY')}</h1>
		<p className="text-center vertical-center selectable" onTouchTap={() => onNextDate(selectedDate)}><FontIcon className="material-icons">arrow_forward</FontIcon></p>
	</div>
)

// Define the property types that the component expects to receive
BookingDatePickerComponent.propTypes = {
	selectedDate: PropTypes.string.isRequired,
	onPreviousDate: PropTypes.func.isRequired,
	onNextDate: PropTypes.func.isRequired,
	onSelectDate: PropTypes.func.isRequired
}

// Define the container for the Booking Date Picker component (maps state and dispatchers)
const BookingDatePicker = connect(mapStateToProps, mapDispatchToProps)(BookingDatePickerComponent)

export default BookingDatePicker
