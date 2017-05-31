import { combineReducers } from 'redux'
import moment from 'moment'
import { TOGGLE_DRAWER_OPEN, TOGGLE_DRAWER_DOCKED, SELECT_DATE,
	REQUEST_BOOKINGS, RECEIVE_BOOKINGS, RECEIVE_BOOKINGS_ERROR, INVALIDATE_BOOKINGS, ADD_BOOKING, UPDATE_BOOKING, DELETE_BOOKING,
	REQUEST_ROOMS, RECEIVE_ROOMS, RECEIVE_ROOMS_ERROR, INVALIDATE_ROOMS, ADD_ROOM, UPDATE_ROOM, DELETE_ROOM,
	REQUEST_ACCOUNTS, RECEIVE_ACCOUNTS, RECEIVE_ACCOUNTS_ERROR, INVALIDATE_ACCOUNTS, ADD_ACCOUNT, UPDATE_ACCOUNT, DELETE_ACCOUNT,
	BEGIN_LOGIN, COMPLETE_LOGIN, COMPLETE_LOGIN_ERROR, CLEAR_LOGIN_ERROR, COMPLETE_LOGOUT,
	REQUEST_SEARCH_RESULTS, REQUEST_SEARCH_RESULTS_LOCAL, RECEIVE_SEARCH_RESULTS, CLEAR_SEARCH_RESULTS,
	REQUEST_STATISTICS, RECEIVE_STATISTICS, RECEIVE_STATISTICS_ERROR, INVALIDATE_STATISTICS,
	SHOW_SNACKBAR, HIDE_SNACKBAR } from '../actions'

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
const selectedDate = (state = moment().format('D/M/YYYY'), action) => {
	switch (action.type) {
	case SELECT_DATE:
		return action.date
	default:
		return state
	}
}

// Reducer for the selected date history list
const selectedDateHistory = (state = [moment().format('D/M/YYYY')], action) => {
	switch (action.type) {
	case SELECT_DATE:
		// Only add the new selected date if it doesn't exist, otherwise move it to the front of the list
		return state.includes(action.date) ? [action.date, ...state.filter((date) => date !== action.date)] : [action.date, ...state]
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
			didInvalidate: false,
			items: action.bookings,
			lastUpdated: action.receivedAt
		}
	case RECEIVE_BOOKINGS_ERROR:
		return {
			...state,
			isFetching: false
		}
	case INVALIDATE_BOOKINGS:
		return {
			...state,
			didInvalidate: true
		}
	case ADD_BOOKING:
	case UPDATE_BOOKING:
		return {
			...state,
			items: [...state.items, action.booking]
		}
	case DELETE_BOOKING:
		return {
			...state,
			items: state.items.filter((booking) => booking.bookingId !== action.bookingId)
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
	case UPDATE_BOOKING:
		{
			const newState = {}

			for (let date in state) {
				newState[date] = {
					isFetching: state[date].isFetching,
					didInvalidate: state[date].didInvalidate,
					items: state[date].items.filter((booking) => booking.bookingId !== action.booking.bookingId)
				}
			}

			return {
				...newState,
				[action.date]: handleBookings(newState[action.date], action)
			}
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
			didInvalidate: false,
			items: action.rooms,
			lastUpdated: action.receivedAt
		}
	case RECEIVE_ROOMS_ERROR:
		return {
			...state,
			isFetching: false
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
	case UPDATE_ROOM:
		return {
			...state,
			items: [...state.items.filter((room) => room.roomId !== action.room.roomId), action.room]
		}
	case DELETE_ROOM:
		return {
			...state,
			items: state.items.filter((room) => room.roomId !== action.roomId)
		}
	default:
		return state
	}
}

// Reducer for account-related actions
const accounts = (state = {
	isFetching: false,
	didInvalidate: false,
	items: []
}, action) => {
	switch (action.type) {
	case REQUEST_ACCOUNTS:
		return {
			...state,
			isFetching: true
		}
	case RECEIVE_ACCOUNTS:
		return {
			...state,
			isFetching: false,
			didInvalidate: false,
			items: action.users,
			lastUpdated: action.receivedAt
		}
	case RECEIVE_ACCOUNTS_ERROR:
		return {
			...state,
			isFetching: false
		}
	case INVALIDATE_ACCOUNTS:
		return {
			...state,
			didInvalidate: true
		}
	case ADD_ACCOUNT:
		return {
			...state,
			items: [...state.items, action.user]
		}
	case UPDATE_ACCOUNT:
		return {
			...state,
			items: [...state.items.filter((user) => user.userId !== action.user.userId), action.user]
		}
	case DELETE_ACCOUNT:
		return {
			...state,
			items: state.items.filter((user) => user.userId !== action.userId)
		}
	default:
		return state
	}
}

// Reducer for user-related actions
const user = (state = {
	isLoggingIn: false,
	isLoggedIn: false,
	authLevel: 0,
	loginError: ''
}, action) => {
	switch (action.type) {
	case BEGIN_LOGIN:
		return {
			...state,
			isLoggingIn: true,
			loginError: ''
		}
	case COMPLETE_LOGIN:
		return {
			...state,
			isLoggingIn: false,
			isLoggedIn: action.response.success,
			loginError: action.response.error,
			authLevel: action.response.authLevel
		}
	case COMPLETE_LOGIN_ERROR:
		return {
			...state,
			isLoggingIn: false,
			loginError: 'An error occured when logging in'
		}
	case CLEAR_LOGIN_ERROR:
		return {
			...state,
			loginError: ''
		}
	case COMPLETE_LOGOUT:
		return {
			...state,
			isLoggedIn: false,
			authLevel: 0
		}
	default:
		return state
	}
}

// Reducer for search-related actions
const search = (state = {
	query: '',
	isFetching: false,
	bookings: [],
	rooms: []
}, action) => {
	switch (action.type) {
	case REQUEST_SEARCH_RESULTS:
	case REQUEST_SEARCH_RESULTS_LOCAL:
		return {
			...state,
			query: action.query,
			isFetching: true
		}
	case RECEIVE_SEARCH_RESULTS:
		return {
			...state,
			isFetching: false,
			bookings: action.bookings,
			rooms: action.rooms,
		}
	case CLEAR_SEARCH_RESULTS:
		return {
			...state,
			query: '',
			bookings: [],
			rooms: []
		}
	case UPDATE_BOOKING:
		if (state.bookings.filter((booking) => booking.bookingId === action.booking.bookingId).length !== 0) {
			const regexp = new RegExp(state.query)

			return {
				...state,
				bookings: [...state.bookings.filter((booking) => booking.bookingId !== action.booking.bookingId), action.booking].filter((booking) => {
					return regexp.test(booking.bookingId) || regexp.test(booking.bookingTitle) || regexp.test(booking.bookingDesc) || regexp.test(booking.roomId) || regexp.test(booking.date)
				})
			}
		}

		return state
	case DELETE_BOOKING:
		return {
			...state,
			bookings: state.bookings.filter((booking) => booking.bookingId !== action.bookingId)
		}
	case UPDATE_ROOM:
		if (state.rooms.filter((room) => room.roomId === action.room.roomId) !== 0) {
			const regexp = new RegExp(state.query)

			return {
				...state,
				rooms: [...state.rooms.filter((room) => room.roomId !== action.room.roomId), action.room].filter((room) => {
					return regexp.test(room.roomId) || regexp.test(room.roomName) || regexp.test(room.roomDesc)
				})
			}
		}

		return state
	case DELETE_ROOM:
		return {
			...state,
			rooms: state.rooms.filter((room) => room.roomId !== action.roomId)
		}
	default:
		return state
	}
}

// Reducer for statistics-related actions
const statistics = (state = {
	isFetching: false,
	didInvalidate: false,
	data: false
}, action) => {
	switch (action.type) {
	case REQUEST_STATISTICS:
		return {
			...state,
			isFetching: true
		}
	case RECEIVE_STATISTICS:
		return {
			...state,
			isFetching: false,
			didInvalidate: false,
			data: action.data,
			lastUpdated: action.receivedAt
		}
	case RECEIVE_STATISTICS_ERROR:
		return {
			...state,
			isFetching: false
		}
	case INVALIDATE_STATISTICS:
		return {
			...state,
			didInvalidate: true
		}
	default:
		return state
	}
}

// Reducer for snackbar-related actions
const snackbar = (state = {
	open: false,
	message: '',
	action: null,
	onActionTouchTap: null
}, action) => {
	switch (action.type) {
	case SHOW_SNACKBAR:
		return {
			...state,
			open: true,
			message: action.message,
			action: action.action,
			onActionTouchTap: action.onActionTouchTap
		}
	case HIDE_SNACKBAR:
		return {
			...state,
			open: false,
			message: '',
			action: null,
			onActionTouchTap: null
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
	rooms,
	accounts,
	user,
	search,
	statistics,
	snackbar
})

export default rootReducer
