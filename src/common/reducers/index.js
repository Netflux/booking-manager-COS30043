import { combineReducers } from 'redux'
import moment from 'moment'
import { TOGGLE_DRAWER_OPEN, TOGGLE_DRAWER_DOCKED, SELECT_DATE,
	REQUEST_BOOKINGS, RECEIVE_BOOKINGS, INVALIDATE_BOOKINGS, ADD_BOOKING, DELETE_BOOKING,
	REQUEST_ROOMS, RECEIVE_ROOMS, INVALIDATE_ROOMS, ADD_ROOM, DELETE_ROOM } from '../actions'

// Reducer for side drawer-related actions
const sideDrawerState = (state = {
	isOpen: false,
	isDocked: false
}, action) => {
	switch (action.type) {
		case TOGGLE_DRAWER_OPEN:
			return {
				...state,
				isOpen: !state.isOpen
			}
		case TOGGLE_DRAWER_DOCKED:
			return {
				...state,
				isDocked: !state.isDocked
			}
		default:
			return state
	}
}

// Reducer for the selected date action
const selectedDate = (state = moment().format('YYYY/M/D'), action) => {
	switch (action.type) {
		case SELECT_DATE:
			return action.date
		default:
			return state
	}
}

// Reducer for the selected date history list
const selectedDateHistory = (state = [moment().format('YYYY/M/D')], action) => {
	switch (action.type) {
		case SELECT_DATE:
			// Only add the new selected date if it doesn't exist, otherwise move it to the front of the list
			// The list only stores a maximum of 5 selected dates
			return state.includes(action.date) ? [action.date, ...state.filter((date) => date != action.date)] : [action.date, ...state.slice(0, 4)]
		default:
			return state
	}
}

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
				items: state.items.filter((booking) => booking.bookingId != action.bookingId)
			}
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

// Reducer for room-related actions
const rooms = (state = {
	isFetching: false,
	didInvalidate: false,
	items: []
}, action) => {
	switch (action.type) {
		case REQUEST_ROOMS:
			return {
				...state,
				isFetching: true
			}
		case RECEIVE_ROOMS:
			return {
				...state,
				isFetching: false,
				items: action.rooms,
				lastUpdated: action.receivedAt
			}
		case INVALIDATE_ROOMS:
			return {
				...state,
				didInvalidate: true
			}
		case ADD_ROOM:
			return {
				...state,
				items: [...state.items, action.room]
			}
		case DELETE_ROOM:
			return {
				...state,
				items: state.items.filter((room) => room.roomId != action.roomId)
			}
		default:
			return state
	}
}

// Combine all reducers into a singular root reducer
const rootReducer = combineReducers({
	sideDrawerState,
	selectedDate,
	selectedDateHistory,
	bookingsByDate,
	rooms
})

export default rootReducer
