import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { FontIcon } from 'material-ui'
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'

import { selectDate } from '../../actions'

const mapStateToProps = state => {
	return {
		selectedDate: state.selectedDate
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onPreviousDate: (date, changeDayOffset) => {
			dispatch(selectDate(moment(date, 'D/M/YYYY').subtract(changeDayOffset, 'days').format('D/M/YYYY')))
		},
		onNextDate: (date, changeDayOffset) => {
			dispatch(selectDate(moment(date, 'D/M/YYYY').add(changeDayOffset, 'days').format('D/M/YYYY')))
		},
		onSelectDate: (date) => {
			dispatch(selectDate(date))
		}
	}
}

// Define the Booking Date Picker component
const BookingDatePickerComponent = ({ selectedDate, changeDayOffset = 1, onPreviousDate, onNextDate, onSelectDate }) => {
	// Store a reference to the Date Picker Dialog component
	// Used to show the dialog when the user clicks on the displayed date
	let datePickerDialog

	return (
		<div className="booking-date-picker row between-xs">
			<p className="text-center vertical-center selectable" onTouchTap={() => onPreviousDate(selectedDate, changeDayOffset)}><FontIcon className="material-icons">arrow_back</FontIcon></p>
			<h1 className="text-center col-xs selectable" onTouchTap={() => datePickerDialog.show()}>{moment(selectedDate, 'D/M/YYYY').format('D/M/YYYY')}</h1>
			<p className="text-center vertical-center selectable" onTouchTap={() => onNextDate(selectedDate, changeDayOffset)}><FontIcon className="material-icons">arrow_forward</FontIcon></p>

			<DatePickerDialog ref={(dialog) => datePickerDialog = dialog} initialDate={moment(selectedDate, 'D/M/YYYY').toDate()} firstDayOfWeek={1} onAccept={(date) => onSelectDate(moment(date).format('D/M/YYYY'))}/>
		</div>
	)
}

// Define the property types that the component expects to receive
BookingDatePickerComponent.propTypes = {
	selectedDate: PropTypes.string.isRequired,
	changeDayOffset: PropTypes.number,
	onPreviousDate: PropTypes.func.isRequired,
	onNextDate: PropTypes.func.isRequired,
	onSelectDate: PropTypes.func.isRequired
}

// Define the container for the Booking Date Picker component (maps state and dispatchers)
const BookingDatePicker = connect(mapStateToProps, mapDispatchToProps)(BookingDatePickerComponent)

export default BookingDatePicker
