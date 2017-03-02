// Action when the user opens/closes the side drawer
export const TOGGLE_DRAWER_OPEN = 'TOGGLE_DRAWER_OPEN'
export const toggleDrawerOpen = () => {
	return {
		type: TOGGLE_DRAWER_OPEN
	}
}

// Action when the user docks/undocks the side drawer
export const TOGGLE_DRAWER_DOCKED = 'TOGGLE_DRAWER_DOCKED'
export const toggleDrawerDocked = () => {
	return {
		type: TOGGLE_DRAWER_DOCKED
	}
}

// Action when the user selects a specific date to show
export const SELECT_DATE = 'SELECT_DATE'
export const selectDate = date => {
	return {
		type: SELECT_DATE,
		date
	}
}

// Helper function to determine whether booking entries need to be fetched for a specific date
const shouldFetchPosts = (state, date) => {
	const bookings = state.bookings[date]

	if (!bookings) {
		return true;
	} else if (bookings.isFetching) {
		return false
	} else {
		return bookings.didInvalidate
	}
}

// Action when the user needs to fetch booking entries
export const fetchBookingsIfNeeded = date => {
	return (dispatch, getState) => {
		// Fetch booking entries if not in memory, else return a resolved promise
		if (shouldFetchPosts(getState(), date)) {
			return dispatch(fetchBookings(date))
		} else {
			return Promise.resolve()
		}
	}
}

// Action when the user is fetching booking entries
export const fetchBookings = date => {
	return dispatch => {
		// Dispatch a request bookings action
		dispatch(requestBookings(date))

		// Fetch the booking entries and dispatch a receive bookings action
		return fetch(`/api/bookings/${date}`)
			.then(response => response.json())
			.then(json => dispatch(receiveBookings(date, json)))
	}
}

// Action when the user requests booking entries
export const REQUEST_BOOKINGS = 'REQUEST_BOOKINGS'
export const requestBookings = date => {
	return {
		type: REQUEST_BOOKINGS,
		date
	}
}

// Action when the user receives booking entries
export const RECEIVE_BOOKINGS = 'RECEIVE_BOOKINGS'
export const receiveBookings = (date, json) => {
	return {
		type: RECEIVE_BOOKINGS,
		date,
		bookings: json,
		receivedAt: Date.now()
	}
}

// Action when the booking entries have become invalid (after add/delete)
export const INVALIDATE_BOOKINGS = 'INVALIDATE_BOOKINGS'
export const invalidateBookings = date => {
	return {
		type: INVALIDATE_BOOKINGS,
		date
	}
}

// Action when the user adds a booking entry
export const ADD_BOOKING = 'ADD_BOOKING'
export const addBooking = (date, booking) => {
	return {
		type: ADD_BOOKING,
		date,
		booking
	}
}

// Action when the user deletes a booking entry
export const DELETE_BOOKING = 'DELETE_BOOKING'
export const deleteBooking = (date, bookingId) => {
	return {
		type: DELETE_BOOKING,
		date,
		bookingId
	}
}
