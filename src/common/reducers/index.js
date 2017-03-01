import { combineReducers } from 'redux'
import moment from 'moment'
import { SELECT_DATE, REQUEST_BOOKINGS, RECEIVE_BOOKINGS, INVALIDATE_BOOKINGS, ADD_BOOKING, DELETE_BOOKING } from '../actions'

// Helper function for bookings reducer
const handleBookings = (state = {
	isFetching: false,
	didInvalidate: false,
	items: []
}, action) => {
	switch (action.type) {
		case REQUEST_BOOKINGS:
			return {
				...state,
				isFetching: true
			}
		case RECEIVE_BOOKINGS:
			return {
				...state,
				isFetching: false,
				items: action.bookings,
				lastUpdated: action.receivedAt
			}
		case INVALIDATE_BOOKINGS:
			return {
				...state,
				didInvalidate: true
			}
		case ADD_BOOKING:
			return {
				...state,
				items: [...state.items, action.booking]
			}
		case DELETE_BOOKING:
			return {
				...state,
				items: state.items.filter((booking) => {
					booking._id != action.bookingId
				})
			}
		default:
			return state
	}
}

// Reducer for the selected date
const selectedDate = (state = moment().format('YYYY/M/D'), action) => {
	switch (action.type) {
		case SELECT_DATE:
			return action.date
		default:
			return state
	}
}

// Reducer for booking-related actions
const bookingsByDate = (state = {}, action) => {
	switch (action.type) {
		case REQUEST_BOOKINGS:
		case RECEIVE_BOOKINGS:
		case INVALIDATE_BOOKINGS:
		case ADD_BOOKING:
		case DELETE_BOOKING:
			return {
				...state,
				[action.date]: handleBookings(state[action.date], action)
			}
		default:
			return state
	}
}

// Combine all reducers into a singular root reducer
const rootReducer = combineReducers({
	bookingsByDate,
	selectedDate
})

export default rootReducer
